// models/color.model.js
import prisma from "../prisma/client.js";

/**
 * إنشاء لون جديد
 */
export const create = async (data) => {
  return prisma.color.create({
    data,
  });
};

/**
 * البحث عن لون حسب المعرف
 */
export const findById = async (color_id) => {
  return prisma.color.findUnique({
    where: { color_id },
    include: {
      material: true,
      prices: true,
      rulers: true,
    },
  });
};

/**
 * جلب جميع الألوان مع pagination
 */
export const findAll = async ({ skip = 0, take = 10, where = {} }) => {
  return prisma.color.findMany({
    where,
    skip,
    take,
    include: {
      material: true,
      prices: true,
    },
    orderBy: { color_id: 'desc' },
  });
};

/**
 * عد جميع الألوان
 */
export const count = async (where = {}) => {
  return prisma.color.count({ where });
};

/**
 * تحديث لون حسب المعرف
 */
export const updateById = async (color_id, data) => {
  return prisma.color.update({
    where: { color_id },
    data,
  });
};

/**
 * حذف لون نهائيًا
 */
export const deleteById = async (color_id) => {
  return prisma.color.delete({
    where: { color_id },
  });
};

/**
 * البحث عن لون حسب الكود
 */
export const findByCode = async (color_code) => {
  return prisma.color.findUnique({
    where: { color_code },
    include: {
      material: true,
    },
  });
};

/**
 * البحث عن ألوان حسب المادة
 */
export const findByMaterialId = async (material_id) => {
  return prisma.color.findMany({
    where: { material_id },
    include: {
      prices: true,
    },
  });
};
