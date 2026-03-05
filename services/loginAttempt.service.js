import { LoginAttemptModel } from "../models/index.js";
import logger from "../utils/logger.js";

/**
 * جلب جميع محاولات تسجيل الدخول مع فلترة
 */
export const getAllLoginAttempts = async (filters = {}) => {
  const where = {};
  const skip = filters.skip ? parseInt(filters.skip) : 0;
  const take = filters.take ? parseInt(filters.take) : 50;

  // Filter by userId
  if (filters.userId) {
    where.userId = parseInt(filters.userId);
  }

  // Filter by identifier
  if (filters.identifier) {
    where.identifier = {
      contains: filters.identifier,
    };
  }

  // Filter by success
  if (filters.success !== undefined) {
    where.success = filters.success === 'true' || filters.success === true;
  }

  // Filter by ip
  if (filters.ip) {
    where.ip = {
      contains: filters.ip,
    };
  }

  // Filter by date range
  if (filters.startDate || filters.endDate) {
    where.created_at = {};
    if (filters.startDate) {
      where.created_at.gte = new Date(filters.startDate);
    }
    if (filters.endDate) {
      where.created_at.lte = new Date(filters.endDate);
    }
  }

  const [attempts, total] = await Promise.all([
    LoginAttemptModel.findAll({ where, skip, take }),
    LoginAttemptModel.count(where),
  ]);

  return {
    attempts,
    total,
    skip,
    take,
  };
};

/**
 * جلب محاولات تسجيل الدخول حسب المستخدم
 */
export const getLoginAttemptsByUserId = async (userId, filters = {}) => {
  const skip = filters.skip ? parseInt(filters.skip) : 0;
  const take = filters.take ? parseInt(filters.take) : 50;

  const attempts = await LoginAttemptModel.findByUserId(userId, { skip, take });
  const total = await LoginAttemptModel.count({ userId });

  return {
    attempts,
    total,
    skip,
    take,
  };
};

/**
 * جلب محاولات تسجيل الدخول حسب المعرف (username/phone)
 */
export const getLoginAttemptsByIdentifier = async (identifier, filters = {}) => {
  const limit = filters.take ? parseInt(filters.take) : 50;

  const attempts = await LoginAttemptModel.getAttemptsByIdentifier(identifier, limit);
  const total = await LoginAttemptModel.count({ identifier });

  return {
    attempts,
    total,
  };
};

/**
 * جلب محاولات تسجيل الدخول الفاشلة
 */
export const getFailedLoginAttempts = async (filters = {}) => {
  const skip = filters.skip ? parseInt(filters.skip) : 0;
  const take = filters.take ? parseInt(filters.take) : 50;

  const attempts = await LoginAttemptModel.findFailedAttempts({ skip, take });
  const total = await LoginAttemptModel.count({ success: false });

  return {
    attempts,
    total,
    skip,
    take,
  };
};

/**
 * حذف محاولات تسجيل الدخول القديمة (أكثر من X أيام)
 */
export const cleanOldLoginAttempts = async (daysToKeep = 30) => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

  const result = await LoginAttemptModel.deleteOlderThan(cutoffDate);
  logger.info("Old login attempts cleaned", { deletedCount: result.count, cutoffDate });
  return result;
};

/**
 * إحصائيات محاولات تسجيل الدخول
 */
export const getLoginAttemptsStats = async (filters = {}) => {
  const where = {};

  // Filter by date range
  if (filters.startDate || filters.endDate) {
    where.created_at = {};
    if (filters.startDate) {
      where.created_at.gte = new Date(filters.startDate);
    }
    if (filters.endDate) {
      where.created_at.lte = new Date(filters.endDate);
    }
  }

  const [total, successful, failed] = await Promise.all([
    LoginAttemptModel.count(where),
    LoginAttemptModel.count({ ...where, success: true }),
    LoginAttemptModel.count({ ...where, success: false }),
  ]);

  return {
    total,
    successful,
    failed,
    successRate: total > 0 ? ((successful / total) * 100).toFixed(2) : 0,
  };
};

