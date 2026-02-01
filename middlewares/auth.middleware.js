import prisma from "../prisma/client.js";
import { verifyAccessToken } from "../utils/jwt.js";
import { getRealIP } from "../utils/ip.js";
import logger from "../utils/logger.js";
import {CANCELD_SESSION, FAILURE_REQUEST, IN_ACTIVE_ACCOUNT, NO_AUTH, NOT_VERIFIED, TOKEN_EXPIRED, TOKEN_NOT_CORRECT, USER_NOT_FOUND } from "../validators/messagesResponse.js";

/**
 * Middleware للتحقق من المصادقة
 */
export const requireAuth = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (!auth?.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: NO_AUTH });
    }

    const token = auth.slice(7);
    const payload = verifyAccessToken(token);

    const user = await prisma.users.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        role: true,
        is_active: true,
        currentSessionId: true,
      }
    });

    if (!user || !user.is_active) {
      return res.status(401).json({ success: false, message: IN_ACTIVE_ACCOUNT });
    }

    if (user.currentSessionId !== payload.sid) {
      return res.status(401).json({ success: false, message: CANCELD_SESSION });
    }

    const session = await prisma.session.findUnique({
      where: { id: payload.sid }
    });

    if (!session || session.revokedAt) {
      return res.status(401).json({ success: false, message: CANCELD_SESSION });
    }

    req.user = { id: user.id, role: user.role, sessionId: session.id };
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: TOKEN_NOT_CORRECT });
  }
};


/**
 * Middleware للتحقق من الصلاحيات
 */
export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: FAILURE_REQUEST,
        message: NO_AUTH,
        data: {}
      });
    }

    const userRole = req.user.role;
    const allowedRoles = Array.isArray(roles) ? roles : [roles];

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: FAILURE_REQUEST,
        message: NO_AUTH,
        data: {}
      });
    }

    next();
  };
};

/**
 * Middleware للتحقق من صلاحية الإدارة
 */
export const requireAdmin = requireRole(['ADMIN', 'SUBADMIN']);

/**
 * Middleware للتحقق من صلاحية الإدارة الرئيسية فقط
 */
export const requireMainAdmin = requireRole(['ADMIN']);

/**
 * Middleware اختياري للمصادقة (لا يرفض الطلب إذا لم يكن مصادق عليه)
 */
export const optionalAuth = async (req, res, next) => {
  const hdr = req.headers.authorization;

  if (!hdr?.startsWith("Bearer ")) {
    return next(); // المتابعة بدون مصادقة
  }

  try {
    const token = hdr.slice(7);
    const payload = verifyAccessToken(token);

    const user = await prisma.users.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        role: true,
        is_active: true,
        currentSessionId: true
      }
    });

    if (user && user.is_active && user.currentSessionId === payload.sid) {
      const session = await prisma.session.findUnique({
        where: { id: payload.sid },
        select: {
          id: true,
          userId: true,
          revokedAt: true
        }
      });

      if (session && !session.revokedAt && session.userId === user.id) {
        req.user = {
          id: user.id,
          role: user.role,
          sessionId: session.id
        };
      }
    }
  } catch (error) {
    // تجاهل الأخطاء في المصادقة الاختيارية
  }

  next();
};

/**
 * Middleware لتسجيل معلومات الطلب
 */
export const logRequest = (req, res, next) => {
  const realIp = getRealIP(req);
  const userAgent = req.headers["user-agent"];
  const method = req.method;
  const url = req.originalUrl;
  const timestamp = new Date().toISOString();

  logger.info(`[${timestamp}] ${method} ${url} - IP: ${realIp} - UA: ${userAgent}`);

  // إضافة معلومات الطلب للاستخدام في controllers
  req.requestInfo = {
    realIp,
    userAgent,
    method,
    url,
    timestamp
  };

  next();
};

