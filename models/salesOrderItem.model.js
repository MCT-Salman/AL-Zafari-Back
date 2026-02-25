// models/salesOrderItem.model.js
import prisma from "../prisma/client.js";

/**
 * إنشاء عنصر أمر إنتاج جديد
 */
export const create = async (data) => {
  return prisma.salesOrderItem.create({
    data,
    include: {
      salesOrder: true,
    },
  });
};

/**
 * إنشاء عدة عناصر أمر إنتاج
 */
export const createMany = async (data) => {
  return prisma.salesOrderItem.createMany({
    data,
  });
};

/**
 * البحث عن عنصر أمر إنتاج حسب المعرف
 */
export const findById = async (sales_order_item_id) => {
  return prisma.salesOrderItem.findUnique({
    where: { sales_order_item_id },
    include: {
      salesOrder: {
        select: {
          sales_order_id: true,
          status: true,
        },
      },
    },
  });
};

/**
 * جلب جميع عناصر أمر إنتاج معين
 */
export const findBysalesOrderId = async (sales_order_id) => {
  return prisma.salesOrderItem.findMany({
    where: { sales_order_id },
    include: {
      salesOrder: {
        select: {
          sales_order_id: true,
          status: true,
        },
      },
    },
  });
};

/**
 * تحديث عنصر أمر إنتاج حسب المعرف
 */
export const updateById = async (sales_order_item_id, data) => {
  return prisma.salesOrderItem.update({
    where: { sales_order_item_id },
    data,
    include: {
      salesOrder: true,
    },
  });
};

/**
 * حذف عنصر أمر إنتاج نهائيًا
 */
export const deleteById = async (sales_order_item_id) => {
  return prisma.salesOrderItem.delete({
    where: { sales_order_item_id },
  });
};

/**
 * حذف جميع عناصر أمر إنتاج معين
 */
export const deleteBysalesOrderId = async (sales_order_id) => {
  return prisma.salesOrderItem.deleteMany({
    where: { sales_order_id },
  });
};

/**
 * عد عناصر أمر إنتاج معين
 */
export const countBysalesOrderId = async (sales_order_id) => {
  return prisma.salesOrderItem.count({
    where: { sales_order_id },
  });
};
