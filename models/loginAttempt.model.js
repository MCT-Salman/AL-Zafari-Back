import prisma from "../prisma/client.js";

export const logAttempt = (data) => prisma.loginAttempt.create({ data });

export const getAttemptsByIdentifier = (identifier, limit = 50) =>
  prisma.loginAttempt.findMany({
    where: { identifier },
    orderBy: { created_at: "desc" },
    take: limit,
    include: {
      user: {
        select: {
          id: true,
          username: true,
          full_name: true,
        },
      },
    },
  });

/**
 * جلب جميع محاولات تسجيل الدخول مع فلترة
 */
export const findAll = async ({ where = {}, skip = 0, take = 50, orderBy = { created_at: 'desc' } }) => {
  return prisma.loginAttempt.findMany({
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
        },
      },
    },
  });
};

/**
 * عد محاولات تسجيل الدخول
 */
export const count = async (where = {}) => {
  return prisma.loginAttempt.count({ where });
};

/**
 * جلب محاولات تسجيل الدخول حسب المستخدم
 */
export const findByUserId = async (userId, { skip = 0, take = 50 }) => {
  return prisma.loginAttempt.findMany({
    where: { userId },
    skip,
    take,
    orderBy: { created_at: 'desc' },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          full_name: true,
        },
      },
    },
  });
};

/**
 * جلب محاولات تسجيل الدخول الفاشلة
 */
export const findFailedAttempts = async ({ skip = 0, take = 50 }) => {
  return prisma.loginAttempt.findMany({
    where: { success: false },
    skip,
    take,
    orderBy: { created_at: 'desc' },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          full_name: true,
        },
      },
    },
  });
};

/**
 * حذف محاولات تسجيل الدخول القديمة
 */
export const deleteOlderThan = async (date) => {
  return prisma.loginAttempt.deleteMany({
    where: {
      created_at: {
        lt: date,
      },
    },
  });
};
