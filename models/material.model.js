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
      height: true,
      width: true,
      thickness: true,
      colors: true,
      batches: true,
      rulers: true,
    },
  });
};

/**
 * جلب جميع المواد مع pagination
 */
export const findAll = async ({ skip = 0, take = 10, where = {} }) => {
  return prisma.material.findMany({
    where,
    skip,
    take,
    include: {
      height: true,
      width: true,
      thickness: true,
      colors: true,
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
      height: true,
      width: true,
      thickness: true,
      colors: true,
    },
  });
};
