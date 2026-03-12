// models/slite.model.js
import prisma from "../prisma/client.js";

/**
 * إنشاء عملية تشريح جديدة
 */
export const create = async (data) => {
  return prisma.slite.create({
    data,
    include: {
      user: {
        select: {
          id: true,
          username: true,
          full_name: true,
        },
      },
      increases: true,
    },
  });
};

/**
 * البحث عن عملية تشريح حسب المعرف
 */
export const findById = async (slite_id) => {
  return prisma.slite.findUnique({
    where: { slite_id },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          full_name: true,
        },
      },
      increases: true,
    },
  });
};

/**
 * جلب جميع عمليات التشريح
 */
export const findAll = async ({ where = {} }) => {
  return prisma.slite.findMany({
    where,
    include: {
      user: {
        select: {
          id: true,
          username: true,
          full_name: true,
        },
      },
      increases: true,
    },
    orderBy: { created_at: "desc" },
  });
};

/**
 * البحث عن عمليات تشريح حسب color_id
 */
export const findByColorId = async (color_id) => {
  return prisma.slite.findMany({
    where: { color_id },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          full_name: true,
        },
      },
      increases: true,
    },
    orderBy: { created_at: "desc" },
  });
};

/**
 * البحث عن عمليات تشريح حسب batch_id
 */
export const findByBatchId = async (batch_id) => {
  return prisma.slite.findMany({
    where: { batch_id },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          full_name: true,
        },
      },
      increases: true,
    },
    orderBy: { created_at: "desc" },
  });
};

/**
 * البحث عن عمليات تشريح حسب الوجهة
 */
export const findByDestination = async (destination) => {
  return prisma.slite.findMany({
    where: { destination },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          full_name: true,
        },
      },
      increases: true,
    },
    orderBy: { created_at: "desc" },
  });
};

/**
 * عد جميع عمليات التشريح
 */
export const count = async (where = {}) => {
  return prisma.slite.count({ where });
};

/**
 * تحديث عملية تشريح حسب المعرف
 */
export const updateById = async (slite_id, data) => {
  return prisma.slite.update({
    where: { slite_id },
    data,
    include: {
      user: {
        select: {
          id: true,
          username: true,
          full_name: true,
        },
      },
      increases: true,
    },
  });
};

/**
 * حذف عملية تشريح نهائيًا
 */
export const deleteById = async (slite_id) => {
  return prisma.slite.delete({
    where: { slite_id },
  });
};
