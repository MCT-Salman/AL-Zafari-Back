// models/invoice.model.js
import prisma from "../prisma/client.js";

/**
 * إنشاء فاتورة جديدة
 */
export const create = async (data) => {
  return prisma.invoice.create({
    data,
    include: {
      order: {
        include: {
          items: true,
        },
      },
      customer: true,
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
 * البحث عن فاتورة حسب المعرف
 */
export const findById = async (invoice_id) => {
  return prisma.invoice.findUnique({
    where: { invoice_id },
    include: {
      order: {
        include: {
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
      },
      customer: true,
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
 * جلب جميع الفواتير مع pagination
 */
export const findAll = async ({ skip = 0, take = 10, where = {} }) => {
  return prisma.invoice.findMany({
    where,
    skip,
    take,
    include: {
      order: true,
      customer: true,
      user: {
        select: {
          id: true,
          username: true,
          full_name: true,
        },
      },
    },
    orderBy: { issued_at: "desc" },
  });
};

/**
 * عد جميع الفواتير
 */
export const count = async (where = {}) => {
  return prisma.invoice.count({ where });
};

/**
 * تحديث فاتورة حسب المعرف
 */
export const updateById = async (invoice_id, data) => {
  return prisma.invoice.update({
    where: { invoice_id },
    data,
    include: {
      order: {
        include: {
          items: true,
        },
      },
      customer: true,
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
 * حذف فاتورة نهائيًا
 */
export const deleteById = async (invoice_id) => {
  return prisma.invoice.delete({
    where: { invoice_id },
  });
};

/**
 * البحث عن فواتير حسب الطلب
 */
export const findByOrderId = async (order_id) => {
  return prisma.invoice.findMany({
    where: { order_id },
    include: {
      customer: true,
      user: {
        select: {
          id: true,
          username: true,
          full_name: true,
        },
      },
    },
    orderBy: { issued_at: "desc" },
  });
};

/**
 * البحث عن فواتير حسب العميل
 */
export const findByCustomerId = async (customer_id) => {
  return prisma.invoice.findMany({
    where: { customer_id },
    include: {
      order: true,
      user: {
        select: {
          id: true,
          username: true,
          full_name: true,
        },
      },
    },
    orderBy: { issued_at: "desc" },
  });
};
