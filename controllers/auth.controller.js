
import { serializeResponse } from "../utils/serialize.js";
import {
  loginUser,
  refreshToken as refreshAccessTokenService,
  verifyToken,
  logoutUser,
  logoutAllDevices,
  getActiveSessions,
  revokeSession,
  requestPasswordReset as requestPasswordResetService,
  verifyOTP as verifyOTPService,
  resetPassword as resetPasswordService
} from "../services/auth.service.js";
import { UserModel, SessionModel } from "../models/index.js";
import { BAD_REQUEST_STATUS_CODE, SUCCESS_CREATE_STATUS_CODE, UNAUTHORIZED_STATUS_CODE, FORBIDDEN_STATUS_CODE, NOT_FOUND_STATUS_CODE } from "../validators/statusCode.js";
import { FAILURE_REQUEST, SUCCESS_LOGIN, SUCCESS_REFERESH_TOKEN, SUCCESS_REGISTER, SUCCESS_REQUEST, UPDATE_PROFILE_INFO_SUCCESSFULLY, USER_NOT_FOUND_FORGET, USER_NOT_FOUND_PROFILE } from "../validators/messagesResponse.js";
import logger from "../utils/logger.js";

 
/**
 * تسجيل دخول المستخدم
 */
export const login = async (req, res, next) => {
  try {
     const { username, phone, password } = req.body;
    const loginIdentifier = phone || username; // أي واحد موجود
    const result = await loginUser(loginIdentifier, password, req);
    res.json({
      success: SUCCESS_REQUEST,
      message: SUCCESS_LOGIN,
      data: {
        ...serializeResponse(result)
      }
    });
  } catch (error) {
    logger.error('Auth controller error', { message: error?.message, stack: error?.stack, url: req.originalUrl, method: req.method, ip: req.ip, params: req.params, query: req.query, body: req.body, userId: req.user?.id });

    if (error.code === 'ACCOUNT_LOCKED') {
      error.statusCode = 429;
    } else {
      error.statusCode = error.statusCode || UNAUTHORIZED_STATUS_CODE;
    }
    return next(error);
  }
};

/**
 * تجديد access token
 */
export const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    const result = await refreshAccessTokenService(refreshToken);

    res.json({
      success: SUCCESS_REQUEST,
      message: SUCCESS_REFERESH_TOKEN,
      data: {
        ...serializeResponse(result)
      }
    });
  } catch (error) {
    logger.error('Auth controller error', { message: error?.message, stack: error?.stack, url: req.originalUrl, method: req.method, ip: req.ip, params: req.params, query: req.query, body: req.body, userId: req.user?.id });

    error.statusCode = error.statusCode || UNAUTHORIZED_STATUS_CODE;
    return next(error);
  }
};

export const validateToken = async (req, res, next) => {
  try {
    const { Token } = req.body;

    const result = await verifyToken(Token);
    if (!result) {
      logger.warn('Invalid token', { hasToken: Boolean(Token) });
      return res.status(UNAUTHORIZED_STATUS_CODE).json({
        success: false,
        message: "Invalid token",
        data: {}
      });
    } else {
      return res.json({
        success: true,
        message: "Token is valid",
        data: {}
      });
    }
  } catch (error) {
    logger.error('Auth controller error', { message: error?.message, stack: error?.stack, url: req.originalUrl, method: req.method, ip: req.ip, params: req.params, query: req.query, body: req.body, userId: req.user?.id });

    error.statusCode = error.statusCode || UNAUTHORIZED_STATUS_CODE;
    return next(error);
  }
};
export const getstatususer = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await UserModel.findById(userId, {
      id: true,
      phone: true,
      name: true,
      role: true,
      is_active: true
    });
    res.json({
      success: true,
      message: "تم جلب حالة المستخدم بنجاح",
      data: {
        is_active: user.is_active
      }
    });
  } catch (error) {
    logger.error('Auth controller error', { message: error?.message, stack: error?.stack, url: req.originalUrl, method: req.method, ip: req.ip, params: req.params, query: req.query, body: req.body, userId: req.user?.id });

    error.statusCode = error.statusCode || UNAUTHORIZED_STATUS_CODE;
    return next(error);
  }
};
/**
 * تسجيل خروج المستخدم
 */
export const logout = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const result = await logoutUser(userId);

    res.json({
      success: SUCCESS_REQUEST,
      message: result.message,
      data: {}
    });
  } catch (error) {
    logger.error('Auth controller error', { message: error?.message, stack: error?.stack, url: req.originalUrl, method: req.method, ip: req.ip, params: req.params, query: req.query, body: req.body, userId: req.user?.id });

    res.status(BAD_REQUEST_STATUS_CODE).json({
      success: FAILURE_REQUEST,
      message: error.message,
      data: {}
    });
  }
};

/**
 * تسجيل خروج من جميع الأجهزة
 */
export const logoutAll = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const result = await logoutAllDevices(userId);

    res.json({
      success: true,
      message: result.message,
      data: {}
    });
  } catch (error) {
    logger.error('Auth controller error', { message: error?.message, stack: error?.stack, url: req.originalUrl, method: req.method, ip: req.ip, params: req.params, query: req.query, body: req.body, userId: req.user?.id });

    res.status(BAD_REQUEST_STATUS_CODE).json({
      success: false,
      message: error.message,
      data: {}
    });
  }
};

/**
 * الحصول على الجلسات النشطة
 */
export const getSessions = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const sessions = await getActiveSessions(userId);

    res.json({
      success: true,
      data: {
        ...serializeResponse(sessions)
      }
    });
  } catch (error) {
    logger.error('Auth controller error', { message: error?.message, stack: error?.stack, url: req.originalUrl, method: req.method, ip: req.ip, params: req.params, query: req.query, body: req.body, userId: req.user?.id });

    res.status(BAD_REQUEST_STATUS_CODE).json({
      success: false,
      message: error.message,
      data: {}
    });
  }
};

/**
 * إلغاء جلسة محددة
 */
export const revokeSessionById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { sessionId } = req.params;

    const result = await revokeSession(userId, sessionId);

    res.json({
      success: true,
      message: result.message,
      data: {}
    });
  } catch (error) {
    logger.error('Auth controller error', { message: error?.message, stack: error?.stack, url: req.originalUrl, method: req.method, ip: req.ip, params: req.params, query: req.query, body: req.body, userId: req.user?.id });

    res.status(BAD_REQUEST_STATUS_CODE).json({
      success: false,
      message: error.message,
      data: {}
    });
  }
};

/**
 * الحصول على معلومات المستخدم الحالي
 */
export const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await UserModel.findById(userId, {
      id: true,
      phone: true,
      name: true,
      birthDate: true,
      avatarUrl: true,
      role: true,
      sex: true,
      country: true,
      countryCode: true,
      points: true,
      is_active: true,
      createdAt: true,
      updatedAt: true
    });

    if (!user) {
      logger.warn('User not found for getProfile', { userId });
      return res.status(BAD_REQUEST_STATUS_CODE).json({
        success: FAILURE_REQUEST,
        message: USER_NOT_FOUND_PROFILE,
        data: {}
      });
    }

    res.json({
      success: SUCCESS_REQUEST,
      message: "تم جلب البيانات بنجاح",
      data: {
        ...serializeResponse(user)
      }
    });
  } catch (error) {
    logger.error('Auth controller error', { message: error?.message, stack: error?.stack, url: req.originalUrl, method: req.method, ip: req.ip, params: req.params, query: req.query, body: req.body, userId: req.user?.id });

    res.status(BAD_REQUEST_STATUS_CODE).json({
      success: FAILURE_REQUEST,
      message: error.message,
      data: {}
    });
  }
};

/**
 * تحديث معلومات المستخدم
 */
export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // جلب بيانات المستخدم الحالية أولاً
    const existing = await UserModel.findById(userId);
    if (!existing) {
      if (req.file) deleteFile(`/user/${req.file.filename}`);
      logger.warn('User not found for updateProfile', { userId });
      return res.status(NOT_FOUND_STATUS_CODE).json({
        success: FAILURE_REQUEST,
        message: "المستخدم غير موجود",
      });
    }

    const { name, birthDate, sex } = req.body;
    const updateData = {};

    // فقط القيم المرسلة
    if (name !== undefined) updateData.name = name;
    if (birthDate !== undefined) updateData.birthDate = new Date(birthDate);
    if (sex !== undefined) updateData.sex = sex;

    // معالجة الصورة
    if (req.file) {
      // حذف الصورة القديمة (إن وُجدت)
      if (existing.avatarUrl) deleteFile(existing.avatarUrl);
      updateData.avatarUrl = `/uploads/images/user/${req.file.filename}`;
    }

    // تحديث المستخدم
    const user = await UserModel.updateById(userId, updateData, {
      id: true,
      phone: true,
      name: true,
      birthDate: true,
      avatarUrl: true,
      role: true,
      sex: true,
      country: true,
      countryCode: true,
      is_active: true,
      createdAt: true,
      updatedAt: true
    });

    res.json({
      success: SUCCESS_REQUEST,
      message: UPDATE_PROFILE_INFO_SUCCESSFULLY,
      data: serializeResponse(user),
    });

  } catch (error) {
    logger.error('Auth controller error', { message: error?.message, stack: error?.stack, url: req.originalUrl, method: req.method, ip: req.ip, params: req.params, query: req.query, body: req.body, userId: req.user?.id });

    // حذف الصورة الجديدة إذا فشل التحديث
    if (req.file) deleteFile(`/user/${req.file.filename}`);

    res.status(BAD_REQUEST_STATUS_CODE).json({
      success: FAILURE_REQUEST,
      message: error.message,
      data: {}
    });
  }
};

export const deleteaccount = async (req, res, next) => {
  try {
    const userId = req.user.id;
    await UserModel.updateById(userId, { is_active: false });
    res.json({
      success: true,
      message: "تم حذف الحساب بنجاح",
      data: {}
    });
  } catch (error) {
    logger.error('Auth controller error', { message: error?.message, stack: error?.stack, url: req.originalUrl, method: req.method, ip: req.ip, params: req.params, query: req.query, body: req.body, userId: req.user?.id });

    res.status(BAD_REQUEST_STATUS_CODE).json({
      success: FAILURE_REQUEST,
      message: error.message,
      data: {}
    });
  }
};

/**
 * Request password reset - Send OTP
 * POST /auth/forgot-password
 */
export const requestPasswordReset = async (req, res, next) => {
  try {
    const { phone } = req.body;

    const result = await requestPasswordResetService(phone, req);

    res.json({
      success: SUCCESS_REQUEST,
      message: result.message,
      data: {
        expiresIn: result.expiresIn
      }
    });
  } catch (error) {
    logger.error('Request password reset controller error', {
      message: error?.message,
      stack: error?.stack,
      url: req.originalUrl,
      method: req.method,
      ip: req.ip,
      body: req.body
    });

    error.statusCode = error.statusCode || BAD_REQUEST_STATUS_CODE;
    return next(error);
  }
};

/**
 * Verify OTP code
 * POST /auth/verify-otp
 */
export const verifyOTP = async (req, res, next) => {
  try {
    const { phone, otp } = req.body;

    const result = await verifyOTPService(phone, otp);

    res.json({
      success: SUCCESS_REQUEST,
      message: result.message,
      data: {
        resetToken: result.resetToken
      }
    });
  } catch (error) {
    logger.error('Verify OTP controller error', {
      message: error?.message,
      stack: error?.stack,
      url: req.originalUrl,
      method: req.method,
      ip: req.ip,
      body: req.body
    });

    error.statusCode = error.statusCode || BAD_REQUEST_STATUS_CODE;
    return next(error);
  }
};

/**
 * Reset password with verified token
 * POST /auth/reset-password
 */
export const resetPassword = async (req, res, next) => {
  try {
    const { resetToken, newPassword } = req.body;

    const result = await resetPasswordService(resetToken, newPassword);

    res.json({
      success: SUCCESS_REQUEST,
      message: result.message,
      data: {}
    });
  } catch (error) {
    logger.error('Reset password controller error', {
      message: error?.message,
      stack: error?.stack,
      url: req.originalUrl,
      method: req.method,
      ip: req.ip,
      body: req.body
    });

    error.statusCode = error.statusCode || BAD_REQUEST_STATUS_CODE;
    return next(error);
  }
};
