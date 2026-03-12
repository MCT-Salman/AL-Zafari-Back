// models/productionProcess.model.js
import prisma from "../prisma/client.js";

/**
 * إنشاء عملية إنتاج جديدة
 */
export const create = async (data) => {
  return prisma.productionProcess.create({
    data,
    include: {
      user: {
        select: {
          id: true,
          username: true,
          full_name: true,
        },
      },
      color: {
        include: {
          ruler: {
            include: {
              material: true,
            },
          },
        },
      },
      batch: true,
    },
  });
};

/**
 * البحث عن عملية إنتاج حسب المعرف
 */
export const findById = async (process_id) => {
  return prisma.productionProcess.findUnique({
    where: { process_id },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          full_name: true,
        },
      },
      color: {
        include: {
          ruler: {
            include: {
              material: true,
            },
          },
        },
      },
      batch: true,
    },
  });
};

/**
 * جلب جميع عمليات الإنتاج
 */
export const findAll = async ({ where = {} }) => {
  return prisma.productionProcess.findMany({
    where,
    include: {
      user: {
        select: {
          id: true,
          username: true,
          full_name: true,
        },
      },
      color: {
        include: {
          ruler: {
            include: {
              material: true,
            },
          },
        },
      },
      batch: true,
    },
    orderBy: { created_at: "desc" },
  });
};

/**
 * البحث عن عمليات إنتاج حسب color_id
 */
export const findByColorId = async (color_id) => {
  return prisma.productionProcess.findMany({
    where: { color_id },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          full_name: true,
        },
      },
      color: {
        include: {
          ruler: {
            include: {
              material: true,
            },
          },
        },
      },
      batch: true,
    },
    orderBy: { created_at: "desc" },
  });
};

/**
 * البحث عن عمليات إنتاج حسب batch_id
 */
export const findByBatchId = async (batch_id) => {
  return prisma.productionProcess.findMany({
    where: { batch_id },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          full_name: true,
        },
      },
      color: {
        include: {
          ruler: {
            include: {
              material: true,
            },
          },
        },
      },
      batch: true,
    },
    orderBy: { created_at: "desc" },
  });
};

/**
 * عد جميع عمليات الإنتاج
 */
export const count = async (where = {}) => {
  return prisma.productionProcess.count({ where });
};

/**
 * تحديث عملية إنتاج حسب المعرف
 */
export const updateById = async (process_id, data) => {
  return prisma.productionProcess.update({
    where: { process_id },
    data,
    include: {
      user: {
        select: {
          id: true,
          username: true,
          full_name: true,
        },
      },
      color: {
        include: {
          ruler: {
            include: {
              material: true,
            },
          },
        },
      },
      batch: true,
    },
  });
};

/**
 * حذف عملية إنتاج نهائيًا
 */
export const deleteById = async (process_id) => {
  return prisma.productionProcess.delete({
    where: { process_id },
  });
};
