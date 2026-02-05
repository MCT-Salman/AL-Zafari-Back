// models/batch.model.js
import prisma from "../prisma/client.js";

/**
 * إنشاء طبخة جديدة
 */
export const create = async (data) => {
  return prisma.batch.create({
    data,
  });
};

/**
 * البحث عن طبخة حسب المعرف
 */
export const findById = async (batch_id) => {
  return prisma.batch.findUnique({
    where: { batch_id },
    include: {
      material: {
        include: {
          height: true,
          width: true,
          thickness: true,
        },
      },
    },
  });
};

/**
 * جلب جميع الطبخات مع pagination
 */
export const findAll = async ({ skip = 0, take = 10, where = {} }) => {
  return prisma.batch.findMany({
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
    },
    orderBy: { batch_id: 'desc' },
  });
};

/**
 * عد جميع الطبخات
 */
export const count = async (where = {}) => {
  return prisma.batch.count({ where });
};

/**
 * تحديث طبخة حسب المعرف
 */
export const updateById = async (batch_id, data) => {
  return prisma.batch.update({
    where: { batch_id },
    data,
  });
};

/**
 * حذف طبخة نهائيًا
 */
export const deleteById = async (batch_id) => {
  return prisma.batch.delete({
    where: { batch_id },
  });
};

/**
 * البحث عن طبخات حسب المادة
 */
export const findByMaterialId = async (material_id) => {
  return prisma.batch.findMany({
    where: { material_id },
    orderBy: { entry_date: 'desc' },
  });
};

/**
 * البحث عن طبخة حسب رقم الطبخة
 */
export const findByBatchNumber = async (batch_number) => {
  return prisma.batch.findFirst({
    where: { batch_number },
    include: {
      material: true,
    },
  });
};
