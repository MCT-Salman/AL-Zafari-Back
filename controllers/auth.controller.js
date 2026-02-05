
import { serializeResponse } from "../utils/serialize.js";
import {
  loginUser,
  refreshToken as refreshAccessTokenService,
  verifyToken,
  logoutUser,
  logoutAllDevices,
  requestPasswordReset as requestPasswordResetService,
  verifyOTP as verifyOTPService,
  resetPassword as resetPasswordService
} from "../services/auth.service.js";
import { UserModel, SessionModel } from "../models/index.js";
import { BAD_REQUEST_STATUS_CODE, SUCCESS_CREATE_STATUS_CODE, UNAUTHORIZED_STATUS_CODE, FORBIDDEN_STATUS_CODE, NOT_FOUND_STATUS_CODE } from "../validators/statusCode.js";
import { FAILURE_REQUEST, SUCCESS_LOGIN, SUCCESS_REFERESH_TOKEN, SUCCESS_REGISTER, SUCCESS_REQUEST, UPDATE_PROFILE_INFO_SUCCESSFULLY, USER_NOT_FOUND_FORGET, USER_NOT_FOUND_PROFILE } from "../validators/messagesResponse.js";
import logger from "../utils/logger.js";
import bcrypt from "bcrypt";


/**
 * تسجيل دخول المستخدم
 */
export const login = async (req, res, next) => {
  try {
    const { username, phone, password } = req.body;
    if (!phone && !username) {
      throw new Error("بيانات تسجيل الدخول غير صحيحة");
    }
    const loginIdentifier = phone || username;
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
    const { token } = req.body;

    const decoded = await verifyToken(token);

    if (!decoded) {
      return res.status(UNAUTHORIZED_STATUS_CODE).json({
        success: false,
        message: "Invalid or expired token",
        data: {}
      });
    }

    return res.json({
      success: true,
      message: "Token is valid",
      data: {
        userId: decoded.id,
        sessionId: decoded.sid,
        role: decoded.role
      }
    });
  } catch (error) {
    logger.error('Validate token error', {
      message: error?.message,
      stack: error?.stack
    });

    return res.status(UNAUTHORIZED_STATUS_CODE).json({
      success: false,
      message: "Invalid token",
      data: {}
    });
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
      created_at: true,
      updated_at: true
    });

    if (!user) {
      logger.warn('User not found for getProfile', { userId });
      return res.status(BAD_REQUEST_STATUS_CODE).json({
        success: FAILURE_REQUEST,
        message: USER_NOT_FOUND_PROFILE,
        data: {}
      });
    }
    const { password, ...users } = user;

    res.json({
      success: SUCCESS_REQUEST,
      message: "تم جلب البيانات بنجاح",
      data: {
        ...serializeResponse(users)
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
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const existing = await UserModel.findById(userId);
    if (!existing) {
      return res.status(NOT_FOUND_STATUS_CODE).json({
        success: FAILURE_REQUEST,
        message: "المستخدم غير موجود",
      });
    }

    if (!existing.is_active) {
      return res.status(FORBIDDEN_STATUS_CODE).json({
        success: FAILURE_REQUEST,
        message: "الحساب غير نشط",
      });
    }

    const { full_name, phone, username, password } = req.body;
    const updateData = {};

    /* ========= Full Name ========= */
    if (typeof full_name === "string" && full_name.trim()) {
      updateData.full_name = full_name.trim();
    }

    /* ========= Phone ========= */
    if (typeof phone === "string" && phone.trim() && phone !== existing.phone) {
      const phoneExists = await UserModel.findByPhone(phone);
      if (phoneExists) {
        return res.status(BAD_REQUEST_STATUS_CODE).json({
          success: FAILURE_REQUEST,
          message: "رقم الهاتف مستخدم بالفعل",
        });
      }
      updateData.phone = phone.trim();
    }

    /* ========= Username ========= */
    if (typeof username === "string" && username.trim() && username !== existing.username) {
      const usernameExists = await UserModel.findByUsername(username);
      if (usernameExists) {
        return res.status(BAD_REQUEST_STATUS_CODE).json({
          success: FAILURE_REQUEST,
          message: "اسم المستخدم مستخدم بالفعل",
        });
      }
      updateData.username = username.trim();
    }

    /* ========= Password ========= */
    if (typeof password === "string" && password.length >= 8) {
      updateData.password = await bcrypt.hash(password, 12);
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(BAD_REQUEST_STATUS_CODE).json({
        success: FAILURE_REQUEST,
        message: "لا توجد بيانات صالحة للتحديث",
      });
    }

    const user = await UserModel.updateById(userId, updateData, {
      id: true,
      phone: true,
      full_name: true,
      username: true,
      role: true,
      country: true,
      countryCode: true,
      is_active: true,
      created_at: true,
      updated_at: true,
    });
    const { password: userPassword, ...users } = user;

    return res.json({
      success: SUCCESS_REQUEST,
      message: UPDATE_PROFILE_INFO_SUCCESSFULLY,
      data: serializeResponse(users),
    });

  } catch (error) {
    logger.error("Update profile error", {
      message: error.message,
      stack: error.stack,
      userId: req.user?.id,
    });

    return res.status(BAD_REQUEST_STATUS_CODE).json({
      success: FAILURE_REQUEST,
      message: "فشل تحديث البيانات",
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
