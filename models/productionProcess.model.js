// models/productionProcess.model.js
import prisma from "../prisma/client.js";

/**
 * إنشاء عملية إنتاج جديدة
 */
export const create = async (data) => {
  return prisma.productionProcess.create({
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
    },
    orderBy: { created_at: "desc" },
  });
};

/**
 * البحث عن عمليات إنتاج حسب production_order_item_id
 */
export const findByProductionOrderItemId = async (production_order_item_id) => {
  return prisma.productionProcess.findMany({
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
    },
    orderBy: { created_at: "desc" },
  });
};

/**
 * البحث عن عملية إنتاج حسب الباركود
 */
export const findByBarcode = async (barcode) => {
  return prisma.productionProcess.findUnique({
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
    },
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

/**
 * حذف جميع عمليات الإنتاج لعنصر طلب إنتاج معين
 */
export const deleteByProductionOrderItemId = async (production_order_item_id) => {
  return prisma.productionProcess.deleteMany({
    where: { production_order_item_id },
  });
};
