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
      prices: true,
      ruler: true,
    },
  });
};

/**
 * جلب جميع الألوان مع pagination
 */
export const findAll = async ({ where = {} }) => {
  return prisma.color.findMany({
    where,
    include: {
      ruler: true,
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
      ruler: true,
    },
  });
};

/**
 * البحث عن ألوان حسب المادة
 */
export const findByRulerId = async ( ruler_id) => {
  return prisma.color.findMany({
    where: { ruler_id },
    include: {
      prices: true,
    },
  });
};

/**
 * البحث عن لون حسب الكود و معرف المسطرة
 */
export const findByCodeAndRulerId = async (color_code, ruler_id , color_name) => {
  return prisma.color.findFirst({
    where: { color_code, ruler_id , color_name},
  });
};
