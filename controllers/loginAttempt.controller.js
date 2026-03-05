import * as LoginAttemptService from "../services/loginAttempt.service.js";
import logger from "../utils/logger.js";
import { SUCCESS_REQUEST, FAILURE_REQUEST } from "../validators/messagesResponse.js";
import { SUCCESS_STATUS_CODE, BAD_REQUEST_STATUS_CODE } from "../validators/statusCode.js";

/**
 * جلب جميع محاولات تسجيل الدخول مع فلترة
 */
export const getAllLoginAttempts = async (req, res) => {
  try {
    // التحقق من الصلاحيات - فقط admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: FAILURE_REQUEST,
        message: "غير مصرح لك بالوصول إلى محاولات تسجيل الدخول",
        data: {}
      });
    }

    const filters = {
      userId: req.query.userId,
      identifier: req.query.identifier,
      success: req.query.success,
      ip: req.query.ip,
      startDate: req.query.startDate,
      endDate: req.query.endDate,
      skip: req.query.skip,
      take: req.query.take,
    };

    const result = await LoginAttemptService.getAllLoginAttempts(filters);

    res.status(SUCCESS_STATUS_CODE).json({
      success: SUCCESS_REQUEST,
      message: "تم جلب محاولات تسجيل الدخول بنجاح",
      data: result
    });
  } catch (error) {
    logger.error('LoginAttempt controller error', { 
      message: error?.message, 
      stack: error?.stack, 
      url: req.originalUrl, 
      method: req.method, 
      userId: req.user?.id 
    });

    res.status(error.statusCode || BAD_REQUEST_STATUS_CODE).json({
      success: FAILURE_REQUEST,
      message: error.message || "حدث خطأ أثناء جلب محاولات تسجيل الدخول",
      data: {}
    });
  }
};

/**
 * جلب محاولات تسجيل الدخول حسب المستخدم
 */
export const getLoginAttemptsByUserId = async (req, res) => {
  try {
    // التحقق من الصلاحيات
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: FAILURE_REQUEST,
        message: "غير مصرح لك بالوصول إلى محاولات تسجيل الدخول",
        data: {}
      });
    }

    const { userId } = req.params;
    const filters = {
      skip: req.query.skip,
      take: req.query.take,
    };

    const result = await LoginAttemptService.getLoginAttemptsByUserId(parseInt(userId), filters);

    res.status(SUCCESS_STATUS_CODE).json({
      success: SUCCESS_REQUEST,
      message: "تم جلب محاولات تسجيل الدخول بنجاح",
      data: result
    });
  } catch (error) {
    logger.error('LoginAttempt controller error', { 
      message: error?.message, 
      stack: error?.stack, 
      url: req.originalUrl, 
      method: req.method, 
      userId: req.user?.id 
    });

    res.status(error.statusCode || BAD_REQUEST_STATUS_CODE).json({
      success: FAILURE_REQUEST,
      message: error.message || "حدث خطأ أثناء جلب محاولات تسجيل الدخول",
      data: {}
    });
  }
};

/**
 * جلب محاولات تسجيل الدخول الفاشلة
 */
export const getFailedLoginAttempts = async (req, res) => {
  try {
    // التحقق من الصلاحيات
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: FAILURE_REQUEST,
        message: "غير مصرح لك بالوصول إلى محاولات تسجيل الدخول",
        data: {}
      });
    }

    const filters = {
      skip: req.query.skip,
      take: req.query.take,
    };

    const result = await LoginAttemptService.getFailedLoginAttempts(filters);

    res.status(SUCCESS_STATUS_CODE).json({
      success: SUCCESS_REQUEST,
      message: "تم جلب محاولات تسجيل الدخول الفاشلة بنجاح",
      data: result
    });
  } catch (error) {
    logger.error('LoginAttempt controller error', { 
      message: error?.message, 
      stack: error?.stack, 
      url: req.originalUrl, 
      method: req.method, 
      userId: req.user?.id 
    });

    res.status(error.statusCode || BAD_REQUEST_STATUS_CODE).json({
      success: FAILURE_REQUEST,
      message: error.message || "حدث خطأ أثناء جلب محاولات تسجيل الدخول الفاشلة",
      data: {}
    });
  }
};

/**
 * جلب إحصائيات محاولات تسجيل الدخول
 */
export const getLoginAttemptsStats = async (req, res) => {
  try {
    // التحقق من الصلاحيات
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: FAILURE_REQUEST,
        message: "غير مصرح لك بالوصول إلى إحصائيات تسجيل الدخول",
        data: {}
      });
    }

    const filters = {
      startDate: req.query.startDate,
      endDate: req.query.endDate,
    };

    const result = await LoginAttemptService.getLoginAttemptsStats(filters);

    res.status(SUCCESS_STATUS_CODE).json({
      success: SUCCESS_REQUEST,
      message: "تم جلب إحصائيات محاولات تسجيل الدخول بنجاح",
      data: result
    });
  } catch (error) {
    logger.error('LoginAttempt controller error', { 
      message: error?.message, 
      stack: error?.stack, 
      url: req.originalUrl, 
      method: req.method, 
      userId: req.user?.id 
    });

    res.status(error.statusCode || BAD_REQUEST_STATUS_CODE).json({
      success: FAILURE_REQUEST,
      message: error.message || "حدث خطأ أثناء جلب إحصائيات محاولات تسجيل الدخول",
      data: {}
    });
  }
};

