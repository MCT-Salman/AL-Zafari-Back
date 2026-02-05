// models/constantType.model.js
import prisma from "../prisma/client.js";

/**
 * إنشاء نوع ثابت جديد
 */
export const create = async (data) => {
  return prisma.constantType.create({
    data,
  });
};

/**
 * البحث عن نوع ثابت حسب المعرف
 */
export const findById = async (constant_type_id) => {
  return prisma.constantType.findUnique({
    where: { constant_type_id },
    include: {
      values: true,
    },
  });
};

/**
 * جلب جميع الأنواع الثابتة مع pagination
 */
export const findAll = async ({ skip = 0, take = 10, where = {} }) => {
  return prisma.constantType.findMany({
    where,
    skip,
    take,
    include: {
      values: true,
    },
    orderBy: { constant_type_id: 'desc' },
  });
};

/**
 * عد جميع الأنواع الثابتة
 */
export const count = async (where = {}) => {
  return prisma.constantType.count({ where });
};

/**
 * تحديث نوع ثابت حسب المعرف
 */
export const updateById = async (constant_type_id, data) => {
  return prisma.constantType.update({
    where: { constant_type_id },
    data,
  });
};

/**
 * حذف نوع ثابت نهائيًا
 */
export const deleteById = async (constant_type_id) => {
  return prisma.constantType.delete({
    where: { constant_type_id },
  });
};

/**
 * البحث عن نوع ثابت حسب النوع
 */
export const findByType = async (type) => {
  return prisma.constantType.findMany({
    where: { type },
    include: {
      values: true,
    },
  });
};
