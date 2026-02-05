// models/customer.model.js
import prisma from "../prisma/client.js";

/**
 * إنشاء عميل جديد
 */
export const create = async (data) => {
  return prisma.customer.create({
    data,
  });
};

/**
 * البحث عن عميل حسب المعرف
 */
export const findById = async (customer_id) => {
  return prisma.customer.findUnique({
    where: { customer_id },
    include: {
      orders: {
        take: 5,
        orderBy: { created_at: 'desc' },
      },
      invoices: {
        take: 5,
        orderBy: { issued_at: 'desc' },
      },
    },
  });
};

/**
 * جلب جميع العملاء مع pagination
 */
export const findAll = async ({ skip = 0, take = 10, where = {} }) => {
  return prisma.customer.findMany({
    where,
    skip,
    take,
    orderBy: { created_at: 'desc' },
  });
};

/**
 * عد جميع العملاء
 */
export const count = async (where = {}) => {
  return prisma.customer.count({ where });
};

/**
 * تحديث عميل حسب المعرف
 */
export const updateById = async (customer_id, data) => {
  return prisma.customer.update({
    where: { customer_id },
    data,
  });
};

/**
 * حذف عميل نهائيًا
 */
export const deleteById = async (customer_id) => {
  return prisma.customer.delete({
    where: { customer_id },
  });
};

/**
 * البحث عن عميل حسب رقم الهاتف
 */
export const findByPhone = async (phone) => {
  return prisma.customer.findFirst({
    where: { phone },
  });
};

/**
 * البحث عن عملاء حسب النوع
 */
export const findByType = async (customer_type) => {
  return prisma.customer.findMany({
    where: { customer_type },
    orderBy: { created_at: 'desc' },
  });
};

/**
 * البحث عن عملاء حسب المدينة
 */
export const findByCity = async (city) => {
  return prisma.customer.findMany({
    where: { city },
    orderBy: { name: 'asc' },
  });
};
