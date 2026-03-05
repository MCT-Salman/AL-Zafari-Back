import prisma from "../prisma/client.js";

/**
 * إنشاء سجل مراجعة جديد
 */
export const create = async (data) => {
  return prisma.auditLog.create({
    data,
    include: {
      actor: {
        select: {
          id: true,
          username: true,
          full_name: true,
          role: true,
        },
      },
    },
  });
};

/**
 * البحث عن سجل مراجعة حسب المعرف
 */
export const findById = async (id) => {
  return prisma.auditLog.findUnique({
    where: { id },
    include: {
      actor: {
        select: {
          id: true,
          username: true,
          full_name: true,
          role: true,
        },
      },
    },
  });
};

/**
 * جلب جميع سجلات المراجعة مع فلترة
 */
export const findAll = async ({ where = {}, skip = 0, take = 50, orderBy = { created_at: 'desc' } }) => {
  return prisma.auditLog.findMany({
    where,
    skip,
    take,
    orderBy,
    include: {
      actor: {
        select: {
          id: true,
          username: true,
          full_name: true,
          role: true,
        },
      },
    },
  });
};

/**
 * عد سجلات المراجعة
 */
export const count = async (where = {}) => {
  return prisma.auditLog.count({ where });
};

/**
 * حذف سجلات المراجعة القديمة
 */
export const deleteOlderThan = async (date) => {
  return prisma.auditLog.deleteMany({
    where: {
      created_at: {
        lt: date,
      },
    },
  });
};

/**
 * جلب سجلات المراجعة حسب المستخدم
 */
export const findByActorId = async (actorId, { skip = 0, take = 50 }) => {
  return prisma.auditLog.findMany({
    where: { actorId },
    skip,
    take,
    orderBy: { created_at: 'desc' },
    include: {
      actor: {
        select: {
          id: true,
          username: true,
          full_name: true,
          role: true,
        },
      },
    },
  });
};

/**
 * جلب سجلات المراجعة حسب الإجراء
 */
export const findByAction = async (action, { skip = 0, take = 50 }) => {
  return prisma.auditLog.findMany({
    where: { action },
    skip,
    take,
    orderBy: { created_at: 'desc' },
    include: {
      actor: {
        select: {
          id: true,
          username: true,
          full_name: true,
          role: true,
        },
      },
    },
  });
};

/**
 * جلب سجلات المراجعة حسب المورد
 */
export const findByResource = async (resource, { skip = 0, take = 50 }) => {
  return prisma.auditLog.findMany({
    where: { resource },
    skip,
    take,
    orderBy: { created_at: 'desc' },
    include: {
      actor: {
        select: {
          id: true,
          username: true,
          full_name: true,
          role: true,
        },
      },
    },
  });
};
