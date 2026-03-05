// models/warehouseMovement.model.js
import prisma from "../prisma/client.js";

/**
 * إنشاء حركة مخزن جديدة
 */
export const create = async (data) => {
  return prisma.warehouseMovement.create({
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
 * البحث عن حركة مخزن حسب المعرف
 */
export const findById = async (movement_id) => {
  return prisma.warehouseMovement.findUnique({
    where: { movement_id },
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
 * جلب جميع حركات المخزن
 */
export const findAll = async ({ where = {} }) => {
  return prisma.warehouseMovement.findMany({
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
      user: {
        select: {
          id: true,
          username: true,
          full_name: true,
        },
      },
    },
    orderBy: { created_at: "desc" },
  });
};

/**
 * البحث عن حركات مخزن حسب production_order_item_id
 */
export const findByProductionOrderItemId = async (production_order_item_id) => {
  return prisma.warehouseMovement.findMany({
    where: { production_order_item_id },
    include: {
      item: true,
      color: true,
      batch: true,
      user: {
        select: {
          id: true,
          username: true,
          full_name: true,
        },
      },
    },
    orderBy: { created_at: "desc" },
  });
};

/**
 * البحث عن حركات مخزن حسب اللون
 */
export const findByColorId = async (color_id) => {
  return prisma.warehouseMovement.findMany({
    where: { color_id },
    include: {
      item: true,
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
      user: {
        select: {
          id: true,
          username: true,
          full_name: true,
        },
      },
    },
    orderBy: { created_at: "desc" },
  });
};

/**
 * البحث عن حركات مخزن حسب الدفعة
 */
export const findByBatchId = async (batch_id) => {
  return prisma.warehouseMovement.findMany({
    where: { batch_id },
    include: {
      item: true,
      color: true,
      batch: true,
      user: {
        select: {
          id: true,
          username: true,
          full_name: true,
        },
      },
    },
    orderBy: { created_at: "desc" },
  });
};

/**
 * البحث عن حركات مخزن حسب الوجهة
 */
export const findByDestination = async (destination) => {
  return prisma.warehouseMovement.findMany({
    where: { destination },
    include: {
      item: true,
      color: true,
      batch: true,
      user: {
        select: {
          id: true,
          username: true,
          full_name: true,
        },
      },
    },
    orderBy: { created_at: "desc" },
  });
};

/**
 * عد جميع حركات المخزن
 */
export const count = async (where = {}) => {
  return prisma.warehouseMovement.count({ where });
};

/**
 * تحديث حركة مخزن حسب المعرف
 */
export const updateById = async (movement_id, data) => {
  return prisma.warehouseMovement.update({
    where: { movement_id },
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
 * حذف حركة مخزن نهائيًا
 */
export const deleteById = async (movement_id) => {
  return prisma.warehouseMovement.delete({
    where: { movement_id },
  });
};

/**
 * حذف جميع حركات المخزن لعنصر طلب إنتاج معين
 */
export const deleteByProductionOrderItemId = async (production_order_item_id) => {
  return prisma.warehouseMovement.deleteMany({
    where: { production_order_item_id },
  });
};
