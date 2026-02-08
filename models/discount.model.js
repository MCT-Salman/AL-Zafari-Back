import prisma from "../prisma/client.js";

/**
 * إنشاء خصم جديد
 */
export const create = async (data) => {
  return prisma.discount.create({
    data,
  });
};

/**
 * البحث عن خصم حسب المعرف
 */
export const findById = async (id) => {
  return prisma.discount.findUnique({
    where: { id },
  });
};

/**
 * جلب جميع الخصومات مع pagination
 */
export const findAll = async ({ skip = 0, take = 10, where = {} }) => {
  return prisma.discount.findMany({
    where,
    skip,
    take,
    orderBy: { id: 'desc' },
  });
};

/**
 * عد جميع الخصومات
 */
export const count = async (where = {}) => {
  return prisma.discount.count({ where });
};

/**
 * تحديث خصم حسب المعرف
 */
export const updateById = async (id, data) => {
  return prisma.discount.update({
    where: { id },
    data,
  });
};

/**
 * حذف خصم نهائيًا
 */
export const deleteById = async (id) => {
  return prisma.discount.delete({
    where: { id },
  });
};
