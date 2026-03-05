import { AuditLogModel } from "../models/index.js";
import logger from "../utils/logger.js";

/**
 * تسجيل مراجعة جديدة
 */
export const logAudit = async ({
  actorId,
  action,
  resource = null,
  meta = null,
}) => {
  try {
    const auditData = {
      actorId: actorId || null,
      action,
      resource,
      meta: meta ? JSON.parse(JSON.stringify(meta)) : null,
    };

    return await AuditLogModel.create(auditData);
  } catch (error) {
    logger.error("Error logging audit", { error: error?.message, stack: error?.stack });
    // لا نرمي خطأ لأن فشل التسجيل لا يجب أن يوقف العملية الأساسية
    return null;
  }
};

/**
 * جلب جميع سجلات المراجعة مع فلترة
 */
export const getAllAuditLogs = async (filters = {}) => {
  const where = {};
  const skip = filters.skip ? parseInt(filters.skip) : 0;
  const take = filters.take ? parseInt(filters.take) : 50;

  // Filter by actorId
  if (filters.actorId) {
    where.actorId = parseInt(filters.actorId);
  }

  // Filter by action
  if (filters.action) {
    where.action = {
      contains: filters.action,
    };
  }

  // Filter by resource
  if (filters.resource) {
    where.resource = {
      contains: filters.resource,
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

  const [logs, total] = await Promise.all([
    AuditLogModel.findAll({ where, skip, take }),
    AuditLogModel.count(where),
  ]);

  return {
    logs,
    total,
    skip,
    take,
  };
};

/**
 * جلب سجل مراجعة واحد
 */
export const getAuditLogById = async (id) => {
  const log = await AuditLogModel.findById(id);
  if (!log) {
    const error = new Error("سجل المراجعة غير موجود");
    error.statusCode = 404;
    throw error;
  }
  return log;
};

/**
 * جلب سجلات المراجعة حسب المستخدم
 */
export const getAuditLogsByActorId = async (actorId, filters = {}) => {
  const skip = filters.skip ? parseInt(filters.skip) : 0;
  const take = filters.take ? parseInt(filters.take) : 50;

  const logs = await AuditLogModel.findByActorId(actorId, { skip, take });
  const total = await AuditLogModel.count({ actorId });

  return {
    logs,
    total,
    skip,
    take,
  };
};

/**
 * جلب سجلات المراجعة حسب الإجراء
 */
export const getAuditLogsByAction = async (action, filters = {}) => {
  const skip = filters.skip ? parseInt(filters.skip) : 0;
  const take = filters.take ? parseInt(filters.take) : 50;

  const logs = await AuditLogModel.findByAction(action, { skip, take });
  const total = await AuditLogModel.count({ action });

  return {
    logs,
    total,
    skip,
    take,
  };
};

/**
 * جلب سجلات المراجعة حسب المورد
 */
export const getAuditLogsByResource = async (resource, filters = {}) => {
  const skip = filters.skip ? parseInt(filters.skip) : 0;
  const take = filters.take ? parseInt(filters.take) : 50;

  const logs = await AuditLogModel.findByResource(resource, { skip, take });
  const total = await AuditLogModel.count({ resource });

  return {
    logs,
    total,
    skip,
    take,
  };
};

/**
 * حذف سجلات المراجعة القديمة (أكثر من X أيام)
 */
export const cleanOldAuditLogs = async (daysToKeep = 365) => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

  const result = await AuditLogModel.deleteOlderThan(cutoffDate);
  logger.info("Old audit logs cleaned", { deletedCount: result.count, cutoffDate });
  return result;
};

