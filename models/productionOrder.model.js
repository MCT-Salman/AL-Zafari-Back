// models/productionOrder.model.js
import prisma from "../prisma/client.js";

/**
 * إنشاء أمر إنتاج جديد
 */
export const create = async (data) => {
  return prisma.productionOrder.create({
    data,
    include: {
      user: {
        select: {
          id: true,
          username: true,
          full_name: true,
        },
      },
      items: {
        include: {
          ruler: {
            include: {
              material: true,
              color: true,
            },
          },
          batch: true,
        },
      },
    },
  });
};

/**
 * البحث عن أمر إنتاج حسب المعرف
 */
export const findById = async (production_order_id) => {
  return prisma.productionOrder.findUnique({
    where: { production_order_id },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          full_name: true,
        },
      },
      constant_type_value: true,
      ruler: {
        include: {
          material: true,
          color: true,
        },
      },
      batch: true,
    },
  });
};

export const findByIdWithItems = async (production_order_id) => {
  return prisma.productionOrder.findUnique({
    where: { production_order_id },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          full_name: true,
        },
      },
      constant_type_value: true,
      ruler: {
        include: {
          material: true,
          color: true,
        },
      },
      batch: true,
      items: true,
    },
  });
};
/**
 * جلب جميع أوامر الإنتاج مع pagination
 */
export const findAll = async ({ where = {} }) => {
  return prisma.productionOrder.findMany({
    where,
    include: {
      user: {
        select: {
          id: true,
          username: true,
          full_name: true,
        },
      },
      constant_type_value: true,
      ruler: {
        select: {
          ruler_id: true,
          ruler_type: true,
          material: { select: { material_id: true, material_name: true } },
          color: { select: { color_id: true, color_name: true } },
        },
      },
      batch: true,
      items: true,
    },
    orderBy: { created_at: "desc" },
  });
};

/**
 * عد جميع أوامر الإنتاج
 */
export const count = async (where = {}) => {
  return prisma.productionOrder.count({ where });
};

/**
 * تحديث أمر إنتاج حسب المعرف
 */
export const updateById = async (production_order_id, data) => {
  return prisma.productionOrder.update({
    where: { production_order_id },
    data,
    include: {
      user: {
        select: {
          id: true,
          username: true,
          full_name: true,
        },
      },
      constant_type_value: true,
      ruler: {
        select: {
          ruler_id: true,
          ruler_type: true,
          material: { select: { material_id: true, material_name: true } },
          color: { select: { color_id: true, color_name: true } },
        },
      },
      batch: true,

    },
  });
};

/**
 * حذف أمر إنتاج نهائيًا
 */
export const deleteById = async (production_order_id) => {
  return prisma.productionOrder.delete({
    where: { production_order_id },
  });
};
