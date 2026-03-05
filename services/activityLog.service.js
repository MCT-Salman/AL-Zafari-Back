import { ActivityLogModel } from "../models/index.js";
import { getRealIP } from "../utils/ip.js";
import logger from "../utils/logger.js";

/**
 * تسجيل نشاط جديد
 */
export const logActivity = async ({
  userId,
  action,
  module,
  entityId = null,
  entityRef = null,
  searchQuery = null,
  oldData = null,
  newData = null,
  ip = null,
  userAgent = null,
}) => {
  try {
    const activityData = {
      userId: userId || null,
      action,
      module,
      entityId,
      entityRef,
      searchQuery,
      oldData: oldData ? JSON.parse(JSON.stringify(oldData)) : null,
      newData: newData ? JSON.parse(JSON.stringify(newData)) : null,
      ip,
      userAgent,
    };

    return await ActivityLogModel.create(activityData);
  } catch (error) {
    logger.error("Error logging activity", { error: error?.message, stack: error?.stack });
    // لا نرمي خطأ لأن فشل التسجيل لا يجب أن يوقف العملية الأساسية
    return null;
  }
};

/**
 * جلب جميع سجلات النشاط مع فلترة
 */
export const getAllActivityLogs = async (filters = {}) => {
  const where = {};
  const skip = filters.skip ? parseInt(filters.skip) : 0;
  const take = filters.take ? parseInt(filters.take) : 50;

  // Filter by userId
  if (filters.userId) {
    where.userId = parseInt(filters.userId);
  }

  // Filter by action
  if (filters.action) {
    where.action = filters.action;
  }

  // Filter by module
  if (filters.module) {
    where.module = filters.module;
  }

  // Filter by entityId
  if (filters.entityId) {
    where.entityId = parseInt(filters.entityId);
  }

  // Filter by date range
  if (filters.startDate || filters.endDate) {
    where.createdAt = {};
    if (filters.startDate) {
      where.createdAt.gte = new Date(filters.startDate);
    }
    if (filters.endDate) {
      where.createdAt.lte = new Date(filters.endDate);
    }
  }

  const [logs, total] = await Promise.all([
    ActivityLogModel.findAll({ where, skip, take }),
    ActivityLogModel.count(where),
  ]);

  return {
    logs,
    total,
    skip,
    take,
  };
};

/**
 * جلب سجل نشاط واحد
 */
export const getActivityLogById = async (id) => {
  const log = await ActivityLogModel.findById(id);
  if (!log) {
    const error = new Error("سجل النشاط غير موجود");
    error.statusCode = 404;
    throw error;
  }
  return log;
};

/**
 * جلب سجلات النشاط حسب المستخدم
 */
export const getActivityLogsByUserId = async (userId, filters = {}) => {
  const skip = filters.skip ? parseInt(filters.skip) : 0;
  const take = filters.take ? parseInt(filters.take) : 50;

  const logs = await ActivityLogModel.findByUserId(userId, { skip, take });
  const total = await ActivityLogModel.count({ userId });

  return {
    logs,
    total,
    skip,
    take,
  };
};

/**
 * جلب سجلات النشاط حسب الوحدة
 */
export const getActivityLogsByModule = async (module, filters = {}) => {
  const skip = filters.skip ? parseInt(filters.skip) : 0;
  const take = filters.take ? parseInt(filters.take) : 50;

  const logs = await ActivityLogModel.findByModule(module, { skip, take });
  const total = await ActivityLogModel.count({ module });

  return {
    logs,
    total,
    skip,
    take,
  };
};

/**
 * حذف سجلات النشاط القديمة (أكثر من X أيام)
 */
export const cleanOldActivityLogs = async (daysToKeep = 90) => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

  const result = await ActivityLogModel.deleteOlderThan(cutoffDate);
  logger.info("Old activity logs cleaned", { deletedCount: result.count, cutoffDate });
  return result;
};

