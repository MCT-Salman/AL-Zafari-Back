// socket/socketServer.js
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import logger from "../utils/logger.js";

// تخزين المستخدمين المتصلين
const connectedUsers = new Map(); // userId -> Set of socketIds
const socketToUser = new Map(); // socketId -> userId

/**
 * إعداد Socket.IO Server
 */
export const initializeSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || "*",
      methods: ["GET", "POST"],
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  // Middleware للمصادقة
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(" ")[1];

      if (!token) {
        return next(new Error("Authentication error: No token provided"));
      }

      // التحقق من الـ token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      socket.userRole = decoded.role;
      socket.username = decoded.username;

      logger.info(`Socket authentication successful for user ${decoded.id}`);
      next();
    } catch (error) {
      logger.error("Socket authentication failed:", error);
      next(new Error("Authentication error: Invalid token"));
    }
  });

  // عند الاتصال
  io.on("connection", (socket) => {
    const userId = socket.userId;
    const userRole = socket.userRole;

    logger.info(`User ${userId} (${socket.username}) connected with socket ${socket.id}`);

    // إضافة المستخدم للقائمة
    if (!connectedUsers.has(userId)) {
      connectedUsers.set(userId, new Set());
    }
    connectedUsers.get(userId).add(socket.id);
    socketToUser.set(socket.id, userId);

    // الانضمام إلى غرفة المستخدم الخاصة
    socket.join(`user:${userId}`);

    // الانضمام إلى غرفة الصلاحية
    socket.join(`role:${userRole}`);

    // إرسال حالة الاتصال
    socket.emit("connected", {
      success: true,
      message: "تم الاتصال بنجاح",
      userId,
      socketId: socket.id,
    });

    // إرسال عدد الإشعارات غير المقروءة
    socket.on("get:unread:count", async () => {
      try {
        const { getUnreadCount } = await import("../models/notification.model.js");
        const count = await getUnreadCount(userId);
        socket.emit("unread:count", { count });
      } catch (error) {
        logger.error("Error getting unread count:", error);
      }
    });

    // تحديد إشعار كمقروء
    socket.on("mark:read", async (notificationId) => {
      try {
        const { markAsRead } = await import("../models/notification.model.js");
        await markAsRead(notificationId);
        socket.emit("notification:read", { id: notificationId });
      } catch (error) {
        logger.error("Error marking notification as read:", error);
      }
    });

    // تحديد جميع الإشعارات كمقروءة
    socket.on("mark:all:read", async () => {
      try {
        const { markAllUserNotificationsAsRead } = await import("../models/notification.model.js");
        await markAllUserNotificationsAsRead(userId);
        socket.emit("all:notifications:read", { success: true });
      } catch (error) {
        logger.error("Error marking all notifications as read:", error);
      }
    });

    // عند قطع الاتصال
    socket.on("disconnect", () => {
      logger.info(`User ${userId} disconnected (socket ${socket.id})`);

      // إزالة المستخدم من القائمة
      if (connectedUsers.has(userId)) {
        connectedUsers.get(userId).delete(socket.id);
        if (connectedUsers.get(userId).size === 0) {
          connectedUsers.delete(userId);
        }
      }
      socketToUser.delete(socket.id);
    });

    // معالجة الأخطاء
    socket.on("error", (error) => {
      logger.error(`Socket error for user ${userId}:`, error);
    });
  });

  return io;
};

/**
 * الحصول على جميع المستخدمين المتصلين
 */
export const getConnectedUsers = () => {
  return Array.from(connectedUsers.keys());
};

/**
 * التحقق من اتصال مستخدم
 */
export const isUserConnected = (userId) => {
  return connectedUsers.has(userId);
};

/**
 * الحصول على عدد المستخدمين المتصلين
 */
export const getConnectedUsersCount = () => {
  return connectedUsers.size;
};

export { connectedUsers, socketToUser };

