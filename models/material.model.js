// models/material.model.js
import prisma from "../prisma/client.js";

/**
 * إنشاء مادة جديدة
 */
export const create = async (data) => {
  return prisma.material.create({
    data,
  });
};

/**
 * البحث عن مادة حسب المعرف
 */
export const findById = async (material_id) => {
  return prisma.material.findUnique({
    where: { material_id },
    include: {
      constant_values: true,
      batches: true,
      rulers: true,
    },
  });
};

/**
 * البحث عن مادة حسب الاسم
 */
export const findByName = async (material_name) => {
  return prisma.material.findFirst({
    where: { material_name },
  });
};

/**
 * جلب جميع المواد مع pagination
 */
export const findAll = async ({ where = {} }) => {
  return prisma.material.findMany({
    where,
    include: {
      constant_values: true,
      batches: true,
      rulers: true,
    },
    orderBy: { material_id: 'desc' },
  });
};

/**
 * عد جميع المواد
 */
export const count = async (where = {}) => {
  return prisma.material.count({ where });
};

/**
 * تحديث مادة حسب المعرف
 */
export const updateById = async (material_id, data) => {
  return prisma.material.update({
    where: { material_id },
    data,
  });
};

/**
 * حذف مادة نهائيًا
 */
export const deleteById = async (material_id) => {
  return prisma.material.delete({
    where: { material_id },
  });
};

/**
 * البحث عن مواد حسب النوع
 */
export const findByType = async (type) => {
  return prisma.material.findMany({
    where: { type },
    include: {
      constant_values: true,
      batches: true,
      rulers: true,
    },
  });
};
