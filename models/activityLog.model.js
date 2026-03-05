import prisma from "../prisma/client.js";

/**
 * إنشاء سجل نشاط جديد
 */
export const create = async (data) => {
  return prisma.activityLog.create({
    data,
    include: {
      user: {
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
 * البحث عن سجل نشاط حسب المعرف
 */
export const findById = async (id) => {
  return prisma.activityLog.findUnique({
    where: { id },
    include: {
      user: {
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
 * جلب جميع سجلات النشاط مع فلترة
 */
export const findAll = async ({ where = {}, skip = 0, take = 50, orderBy = { createdAt: 'desc' } }) => {
  return prisma.activityLog.findMany({
    where,
    skip,
    take,
    orderBy,
    include: {
      user: {
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
 * عد سجلات النشاط
 */
export const count = async (where = {}) => {
  return prisma.activityLog.count({ where });
};

/**
 * حذف سجلات النشاط القديمة
 */
export const deleteOlderThan = async (date) => {
  return prisma.activityLog.deleteMany({
    where: {
      createdAt: {
        lt: date,
      },
    },
  });
};

/**
 * جلب سجلات النشاط حسب المستخدم
 */
export const findByUserId = async (userId, { skip = 0, take = 50 }) => {
  return prisma.activityLog.findMany({
    where: { userId },
    skip,
    take,
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
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
 * جلب سجلات النشاط حسب الوحدة
 */
export const findByModule = async (module, { skip = 0, take = 50 }) => {
  return prisma.activityLog.findMany({
    where: { module },
    skip,
    take,
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
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
 * جلب سجلات النشاط حسب الإجراء
 */
export const findByAction = async (action, { skip = 0, take = 50 }) => {
  return prisma.activityLog.findMany({
    where: { action },
    skip,
    take,
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
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
