import { generateTokenPair, refreshAccessToken, revokeAllUserRefreshTokens, revokeRefreshToken, verifyAccessToken, revokeUserRefreshTokensExceptSession } from "../utils/jwt.js";
import { getRealIP } from "../utils/ip.js";
import { rateLimiter } from "../utils/rateLimiter.js";
import { SessionModel, UserModel, PasswordResetModel } from "../models/index.js";
import { FAILURE_LOGOUT, FALIURE_REFERESH_TOKEN, IN_ACTIVE_ACCOUNT, Username_OR_PASSWORD_FAILED, SUCCESS_LOGOUT, SUCCESS_REQUEST, USER_NOT_FOUND, USER_NOT_FOUND_LOGIN, ACCOUNT_LOCKED_LOGIN } from "../validators/messagesResponse.js";
import logger from '../utils/logger.js';
import bcrypt from "bcrypt";
import crypto from "crypto";


/**
 * تسجيل دخول المستخدم مع حماية من هجمات القوة الغاشمة
 */
export const loginUser = async (loginIdentifier, password, req) => {
  const ip = getRealIP(req);
  const canAttempt = await rateLimiter.canAttempt(loginIdentifier);
  if (!canAttempt) throw new Error(ACCOUNT_LOCKED_LOGIN);

  const user = await UserModel.findByPhoneOrUsername(loginIdentifier);
  if (!user) {
    await rateLimiter.recordFailedAttempt(loginIdentifier, ip, req.headers['user-agent']);
    throw new Error(Username_OR_PASSWORD_FAILED);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    await rateLimiter.recordFailedAttempt(loginIdentifier, ip, req.headers['user-agent'], user.id);
    throw new Error(Username_OR_PASSWORD_FAILED);
  }

  if (!user.is_active) throw new Error(IN_ACTIVE_ACCOUNT);

  const session = await SessionModel.createSession({
    userId: user.id,
    userAgent: req.headers['user-agent'],
    realIp: getRealIP(req),
  });
  await UserModel.updateById(user.id, { currentSessionId: session.id });

  const tokens = await generateTokenPair(user.id, session.id, user.role);
  await rateLimiter.recordSuccessfulAttempt(loginIdentifier, ip, req.headers['user-agent'], user.id);
  const userWithoutPassword = { ...user, password: undefined };
  return { userWithoutPassword, ...tokens };
};

/**
 * تجديد access token
 */
export const refreshToken = async (refreshToken) => {
  try {
    return await refreshAccessToken(refreshToken);
  } catch (error) {
    logger.error('Auth refresh token error', { message: (error?.message || error) });
    throw new Error(FALIURE_REFERESH_TOKEN);
  }
};

/**
 * التحقق من صحة refresh token
 */

export const verifyToken = async (token) => {
  try {
    const decoded = verifyAccessToken(token);

    if (decoded.type !== "access") return false;

    const session = await prisma.session.findFirst({
      where: {
        id: decoded.sid,
        userId: decoded.id,
        revokedAt: null
      }
    });

    if (!session) return false;

    return decoded;
  } catch (error) {
    logger.warn('Invalid access token', { message: error?.message });
    return false;
  }
};


/**
 * تسجيل خروج المستخدم
 */
// export const logoutUser = async (userId, sessionId, refreshToken) => {
export const logoutUser = async (userId) => {
  try {
    // إلغاء جميع الجلسات
    await SessionModel.revokeAllSessions(userId);

    // مسح معرف الجلسة الحالية
    await UserModel.updateById(userId, { currentSessionId: null, fcmToken: null });

    // إلغاء جميع refresh tokens
    await revokeAllUserRefreshTokens(userId);

    return { success: SUCCESS_REQUEST, message: SUCCESS_LOGOUT };
  } catch (error) {
    logger.error('Logout error', { message: (error?.message || error), stack: error?.stack, userId });
    throw new Error(FAILURE_LOGOUT);
  }
};

/**
 * تسجيل خروج من جميع الأجهزة
 */
export const logoutAllDevices = async (userId) => {
  try {
    // إلغاء جميع الجلسات
    await SessionModel.revokeAllSessions(userId);

    // مسح معرف الجلسة الحالية
    await UserModel.updateById(userId, { currentSessionId: null });

    // إلغاء جميع refresh tokens
    await revokeAllUserRefreshTokens(userId);

    return { success: true, message: "تم تسجيل الخروج من جميع الأجهزة" };
  } catch (error) {
    logger.error('Logout all devices error', { message: (error?.message || error), stack: error?.stack, userId });
    throw new Error("فشل في تسجيل الخروج من جميع الأجهزة");
  }
};


/**
 * Request password reset - Send OTP
 * @param {string} phone - User's phone number
 * @param {object} req - Request object for IP and user agent
 * @returns {Promise<{success: boolean, message: string, expiresIn: number}>}
 */
export const requestPasswordReset = async (phone, req) => {
  try {
    // Check if user exists
    const user = await UserModel.findByPhone(phone);
    if (!user) {
      throw new Error(USER_NOT_FOUND);
    }

    // Check if user is active
    if (!user.is_active) {
      throw new Error(IN_ACTIVE_ACCOUNT);
    }

    // Check rate limiting - prevent spam (max 3 requests per 15 minutes)
    const recentOTP = await PasswordResetModel.findLatestOTP(phone);
    if (recentOTP) {
      const timeSinceLastRequest = Date.now() - new Date(recentOTP.created_at).getTime();
      const minTimeBetweenRequests = 2 * 60 * 1000; // 2 minutes

      if (timeSinceLastRequest < minTimeBetweenRequests) {
        const waitTime = Math.ceil((minTimeBetweenRequests - timeSinceLastRequest) / 1000);
        throw new Error(`يرجى الانتظار ${waitTime} ثانية قبل طلب رمز جديد`);
      }
    }

    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    // OTP expires in 10 minutes
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Save OTP to database
    await PasswordResetModel.createPasswordReset({
      phone,
      otp,
      expiresAt,
      ip: getRealIP(req),
      userAgent: req.headers['user-agent']
    });

    // TODO: Send OTP via SMS (integrate with SMS provider)
    // For now, we'll log it (REMOVE IN PRODUCTION!)
    logger.info('Password reset OTP generated', { phone, otp, expiresAt });

    // In production, you should send SMS here
    // await sendSMS(phone, `رمز إعادة تعيين كلمة المرور: ${otp}`);

    return {
      success: true,
      message: 'تم إرسال رمز التحقق إلى رقم هاتفك',
      expiresIn: 600 // 10 minutes in seconds
    };
  } catch (error) {
    logger.error('Request password reset error', { message: error?.message, stack: error?.stack, phone });
    throw error;
  }
};

/**
 * Verify OTP code
 * @param {string} phone - User's phone number
 * @param {string} otp - OTP code
 * @returns {Promise<{success: boolean, message: string, resetToken: string}>}
 */
export const verifyOTP = async (phone, otp) => {
  try {
    // Find active OTP
    const otpRecord = await PasswordResetModel.findActiveOTP(phone, otp);

    if (!otpRecord) {
      throw new Error('رمز التحقق غير صحيح أو منتهي الصلاحية');
    }

    // Check max attempts (prevent brute force)
    if (otpRecord.attempts >= 5) {
      throw new Error('تم تجاوز الحد الأقصى لمحاولات التحقق');
    }

    // Check if OTP is expired
    if (new Date() > new Date(otpRecord.expiresAt)) {
      throw new Error('رمز التحقق منتهي الصلاحية');
    }

    // Mark OTP as used
    await PasswordResetModel.markOTPAsUsed(otpRecord.id);

    // Generate a temporary reset token (valid for 15 minutes)
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Store reset token in memory or cache (for simplicity, we'll use the OTP record)
    // In production, you might want to use Redis or similar

    logger.info('OTP verified successfully', { phone });

    return {
      success: true,
      message: 'تم التحقق من الرمز بنجاح',
      resetToken: `${phone}:${resetToken}:${Date.now() + 15 * 60 * 1000}` // phone:token:expiry
    };
  } catch (error) {
    // Increment attempts if OTP exists
    const otpRecord = await PasswordResetModel.findLatestOTP(phone);
    if (otpRecord && !otpRecord.isUsed) {
      await PasswordResetModel.incrementAttempts(otpRecord.id);
    }

    logger.error('Verify OTP error', { message: error?.message, stack: error?.stack, phone });
    throw error;
  }
};

/**
 * Reset password with verified token
 * @param {string} resetToken - Reset token from verifyOTP
 * @param {string} newPassword - New password
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const resetPassword = async (resetToken, newPassword) => {
  try {
    // Parse reset token
    const [phone, token, expiry] = resetToken.split(':');

    if (!phone || !token || !expiry) {
      throw new Error('رمز إعادة التعيين غير صالح');
    }

    // Check if token is expired
    if (Date.now() > parseInt(expiry)) {
      throw new Error('رمز إعادة التعيين منتهي الصلاحية');
    }

    // Find user
    const user = await UserModel.findByPhone(phone);
    if (!user) {
      throw new Error(USER_NOT_FOUND);
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    await UserModel.updateById(user.id, { password: hashedPassword });

    // Delete all OTPs for this phone
    await PasswordResetModel.deleteOTPsByPhone(phone);

    // Revoke all user sessions (force re-login)
    await SessionModel.revokeAllSessions(user.id);
    await revokeAllUserRefreshTokens(user.id);

    logger.info('Password reset successfully', { userId: user.id, phone });

    return {
      success: true,
      message: 'تم تغيير كلمة المرور بنجاح'
    };
  } catch (error) {
    logger.error('Reset password error', { message: error?.message, stack: error?.stack });
    throw error;
  }
};
