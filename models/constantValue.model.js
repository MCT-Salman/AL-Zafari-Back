// models/constantValue.model.js
import prisma from "../prisma/client.js";

/**
 * إنشاء قيمة ثابتة جديدة
 */
export const create = async (data) => {
  return prisma.constantValue.create({
    data,
  });
};

/**
 * البحث عن قيمة ثابتة حسب المعرف
 */
export const findById = async (constant_value_id) => {
  return prisma.constantValue.findUnique({
    where: { constant_value_id },
    include: {
      type: true,
    },
  });
};

/**
 * جلب جميع القيم الثابتة مع pagination
 */
export const findAll = async ({ skip = 0, take = 10, where = {} }) => {
  return prisma.constantValue.findMany({
    where,
    skip,
    take,
    include: {
      type: true,
    },
    orderBy: { constant_value_id: 'desc' },
  });
};

/**
 * عد جميع القيم الثابتة
 */
export const count = async (where = {}) => {
  return prisma.constantValue.count({ where });
};

/**
 * تحديث قيمة ثابتة حسب المعرف
 */
export const updateById = async (constant_value_id, data) => {
  return prisma.constantValue.update({
    where: { constant_value_id },
    data,
  });
};

/**
 * حذف قيمة ثابتة نهائيًا
 */
export const deleteById = async (constant_value_id) => {
  return prisma.constantValue.delete({
    where: { constant_value_id },
  });
};

/**
 * البحث عن قيم ثابتة حسب نوع الثابت
 */
export const findByTypeId = async (constant_type_id) => {
  return prisma.constantValue.findMany({
    where: { constant_type_id },
    include: {
      type: true,
    },
  });
};

/**
 * البحث عن القيمة الافتراضية
 */
export const findDefault = async (constant_type_id) => {
  return prisma.constantValue.findFirst({
    where: {
      constant_type_id,
      isDefault: true,
    },
  });
};
