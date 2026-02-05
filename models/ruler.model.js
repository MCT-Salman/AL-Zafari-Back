// models/ruler.model.js
import prisma from "../prisma/client.js";

/**
 * إنشاء مسطرة جديدة
 */
export const create = async (data) => {
  return prisma.ruler.create({
    data,
  });
};

/**
 * البحث عن مسطرة حسب المعرف
 */
export const findById = async (ruler_id) => {
  return prisma.ruler.findUnique({
    where: { ruler_id },
    include: {
      material: {
        include: {
          height: true,
          width: true,
          thickness: true,
        },
      },
      color: true,
    },
  });
};

/**
 * جلب جميع المساطر مع pagination
 */
export const findAll = async ({ skip = 0, take = 10, where = {} }) => {
  return prisma.ruler.findMany({
    where,
    skip,
    take,
    include: {
      material: {
        include: {
          height: true,
          width: true,
          thickness: true,
        },
      },
      color: true,
    },
    orderBy: { ruler_id: 'desc' },
  });
};

/**
 * عد جميع المساطر
 */
export const count = async (where = {}) => {
  return prisma.ruler.count({ where });
};

/**
 * تحديث مسطرة حسب المعرف
 */
export const updateById = async (ruler_id, data) => {
  return prisma.ruler.update({
    where: { ruler_id },
    data,
  });
};

/**
 * حذف مسطرة نهائيًا
 */
export const deleteById = async (ruler_id) => {
  return prisma.ruler.delete({
    where: { ruler_id },
  });
};

/**
 * البحث عن مساطر حسب المادة
 */
export const findByMaterialId = async (material_id) => {
  return prisma.ruler.findMany({
    where: { material_id },
    include: {
      color: true,
    },
  });
};

/**
 * البحث عن مساطر حسب اللون
 */
export const findByColorId = async (color_id) => {
  return prisma.ruler.findMany({
    where: { color_id },
    include: {
      material: true,
    },
  });
};

/**
 * البحث عن مساطر حسب النوع
 */
export const findByType = async (ruler_type) => {
  return prisma.ruler.findMany({
    where: { ruler_type },
    include: {
      material: true,
      color: true,
    },
  });
};
