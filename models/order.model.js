// models/order.model.js
import prisma from "../prisma/client.js";

/**
 * إنشاء طلب جديد
 */
export const create = async (data) => {
  return prisma.order.create({
    data,
    include: {
      customer: true,
      sales: {
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
 * البحث عن طلب حسب المعرف
 */
export const findById = async (order_id) => {
  return prisma.order.findUnique({
    where: { order_id },
    include: {
      customer: true,
      sales: {
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
      invoices: true,
    },
  });
};

/**
 * جلب جميع الطلبات مع pagination
 */
export const findAll = async ({ skip = 0, take = 10, where = {} }) => {
  return prisma.order.findMany({
    where,
    skip,
    take,
    include: {
      customer: true,
      sales: {
        select: {
          id: true,
          username: true,
          full_name: true,
        },
      },
      items: true,
    },
    orderBy: { created_at: "desc" },
  });
};

/**
 * عد جميع الطلبات
 */
export const count = async (where = {}) => {
  return prisma.order.count({ where });
};

/**
 * تحديث طلب حسب المعرف
 */
export const updateById = async (order_id, data) => {
  return prisma.order.update({
    where: { order_id },
    data,
    include: {
      customer: true,
      sales: {
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
 * حذف طلب نهائيًا
 */
export const deleteById = async (order_id) => {
  return prisma.order.delete({
    where: { order_id },
  });
};

/**
 * البحث عن طلبات حسب العميل
 */
export const findByCustomerId = async (customer_id) => {
  return prisma.order.findMany({
    where: { customer_id },
    include: {
      sales: {
        select: {
          id: true,
          username: true,
          full_name: true,
        },
      },
      items: true,
    },
    orderBy: { created_at: "desc" },
  });
};

/**
 * البحث عن طلبات حسب الحالة
 */
export const findByStatus = async (status) => {
  return prisma.order.findMany({
    where: { status },
    include: {
      customer: true,
      sales: {
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
