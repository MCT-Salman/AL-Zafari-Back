// models/slite.model.js
import prisma from "../prisma/client.js";

/**
 * إنشاء عملية تشريح جديدة
 */
export const create = async (data) => {
  return prisma.slite.create({
    data,
    include: {
      item: {
        include: {
          productionOrder: {
            include: {
              color: true,
              batch: true,
            },
          },
        },
      },
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
      item: {
        include: {
          productionOrder: {
            include: {
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
          },
        },
      },
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
      item: {
        include: {
          productionOrder: {
            include: {
              color: true,
              batch: true,
            },
          },
        },
      },
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
 * البحث عن عمليات تشريح حسب production_order_item_id
 */
export const findByProductionOrderItemId = async (production_order_item_id) => {
  return prisma.slite.findMany({
    where: { production_order_item_id },
    include: {
      item: true,
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
 * البحث عن عملية تشريح حسب الباركود
 */
export const findByBarcode = async (barcode) => {
  return prisma.slite.findUnique({
    where: { barcode },
    include: {
      item: true,
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
 * البحث عن عمليات تشريح حسب الوجهة
 */
export const findByDestination = async (destination) => {
  return prisma.slite.findMany({
    where: { destination },
    include: {
      item: true,
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
      item: {
        include: {
          productionOrder: {
            include: {
              color: true,
              batch: true,
            },
          },
        },
      },
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

/**
 * حذف جميع عمليات التشريح لعنصر طلب إنتاج معين
 */
export const deleteByProductionOrderItemId = async (production_order_item_id) => {
  return prisma.slite.deleteMany({
    where: { production_order_item_id },
  });
};
