// models/orderItem.model.js
import prisma from "../prisma/client.js";

/**
 * إنشاء عنصر طلب جديد
 */
export const create = async (data) => {
  return prisma.orderItem.create({
    data,
    include: {
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

/**
 * إنشاء عدة عناصر طلب
 */
export const createMany = async (data) => {
  return prisma.orderItem.createMany({
    data,
  });
};

/**
 * البحث عن عنصر طلب حسب المعرف
 */
export const findById = async (order_item_id) => {
  return prisma.orderItem.findUnique({
    where: { order_item_id },
    include: {
      order: {
        include: {
          customer: true,
        },
      },
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

/**
 * جلب جميع عناصر الطلب
 */
export const findAll = async ({ skip = 0, take = 10, where = {} }) => {
  return prisma.orderItem.findMany({
    where,
    skip,
    take,
    include: {
      order: true,
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

/**
 * عد جميع عناصر الطلب
 */
export const count = async (where = {}) => {
  return prisma.orderItem.count({ where });
};

/**
 * تحديث عنصر طلب حسب المعرف
 */
export const updateById = async (order_item_id, data) => {
  return prisma.orderItem.update({
    where: { order_item_id },
    data,
    include: {
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

/**
 * حذف عنصر طلب نهائيًا
 */
export const deleteById = async (order_item_id) => {
  return prisma.orderItem.delete({
    where: { order_item_id },
  });
};

/**
 * حذف جميع عناصر طلب معين
 */
export const deleteByOrderId = async (order_id) => {
  return prisma.orderItem.deleteMany({
    where: { order_id },
  });
};

/**
 * البحث عن عناصر طلب حسب الطلب
 */
export const findByOrderId = async (order_id) => {
  return prisma.orderItem.findMany({
    where: { order_id },
    include: {
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
