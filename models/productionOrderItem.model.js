// models/productionOrderItem.model.js
import prisma from "../prisma/client.js";

/**
 * إنشاء عنصر أمر إنتاج جديد
 */
export const create = async (data) => {
  return prisma.productionOrderItem.create({
    data,
    include: {
      productionOrder: {
        select: {
          production_order_id: true,
          status: true,
        },
      },
      processes: true,
      slites: true,
      warehouseMovements: true,
    },
  });
};

/**
 * إنشاء عدة عناصر أمر إنتاج
 */
export const createMany = async (data) => {
  return prisma.productionOrderItem.createMany({
    data,
  });
};

/**
 * البحث عن عنصر أمر إنتاج حسب المعرف
 */
export const findById = async (production_order_item_id) => {
  return prisma.productionOrderItem.findUnique({
    where: { production_order_item_id },
    include: {
      productionOrder: {
        select: {
          production_order_id: true,
          status: true,
        },
      },
      processes: true,
      slites: true,
      warehouseMovements: true,
    },
  });
};

/**
 * جلب جميع عناصر أمر إنتاج معين
 */
export const findByProductionOrderId = async (production_order_id) => {
  return prisma.productionOrderItem.findMany({
    where: { production_order_id },
    include: {
      productionOrder: {
        select: {
          production_order_id: true,
          status: true,
        },
      },
      processes: true,
      slites: true,
      warehouseMovements: true,
    },
  });
};

/**
 * تحديث عنصر أمر إنتاج حسب المعرف
 */
export const updateById = async (production_order_item_id, data) => {
  return prisma.productionOrderItem.update({
    where: { production_order_item_id },
    data,
    include: {
      productionOrder: {
        select: {
          production_order_id: true,
          status: true,
        },
      },
      processes: true,
      slites: true,
      warehouseMovements: true,
    },
  });
};

/**
 * حذف عنصر أمر إنتاج نهائيًا
 */
export const deleteById = async (production_order_item_id) => {
  return prisma.productionOrderItem.delete({
    where: { production_order_item_id },
  });
};

/**
 * حذف جميع عناصر أمر إنتاج معين
 */
export const deleteByProductionOrderId = async (production_order_id) => {
  return prisma.productionOrderItem.deleteMany({
    where: { production_order_id },
  });
};

/**
 * عد عناصر أمر إنتاج معين
 */
export const countByProductionOrderId = async (production_order_id) => {
  return prisma.productionOrderItem.count({
    where: { production_order_id },
  });
};
