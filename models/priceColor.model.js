// models/priceColor.model.js
import prisma from "../prisma/client.js";

/**
 * إنشاء سعر لون جديد
 */
export const create = async (data) => {
  return prisma.priceColor.create({
    data,
  });
};

/**
 * البحث عن سعر لون حسب المعرف
 */
export const findById = async (price_color_id) => {
  return prisma.priceColor.findUnique({
    where: { price_color_id },
    include: {
      color: {
        include: {
          material: true,
        },
      },
      constant_value: {
        include: {
          type: true,
        },
      },
    },
  });
};

/**
 * جلب جميع أسعار الألوان مع pagination
 */
export const findAll = async ({ skip = 0, take = 10, where = {} }) => {
  return prisma.priceColor.findMany({
    where,
    skip,
    take,
    include: {
      color: {
        include: {
          material: true,
        },
      },
      constant_value: {
        include: {
          type: true,
        },
      },
    },
    orderBy: { price_color_id: 'desc' },
  });
};

/**
 * عد جميع أسعار الألوان
 */
export const count = async (where = {}) => {
  return prisma.priceColor.count({ where });
};

/**
 * تحديث سعر لون حسب المعرف
 */
export const updateById = async (price_color_id, data) => {
  return prisma.priceColor.update({
    where: { price_color_id },
    data,
  });
};

/**
 * حذف سعر لون نهائيًا
 */
export const deleteById = async (price_color_id) => {
  return prisma.priceColor.delete({
    where: { price_color_id },
  });
};

/**
 * البحث عن أسعار حسب اللون
 */
export const findByColorId = async (color_id) => {
  return prisma.priceColor.findMany({
    where: { color_id },
    include: {
      constant_value: {
        include: {
          type: true,
        },
      },
    },
  });
};

/**
 * البحث عن سعر حسب اللون والقيمة الثابتة
 */
export const findByColorAndValue = async (color_id, constant_value_id) => {
  return prisma.priceColor.findFirst({
    where: {
      color_id,
      constant_value_id,
    },
    include: {
      color: true,
      constant_value: true,
    },
  });
};

export const findPriceByColorAndValue = async (ruler_id, width) => {
  return prisma.priceColor.findFirst({
    where: {
      color: {
        rulers: {
          some: {
            ruler_id,
          },
        },
      },
      price_color_By: width,
    },
  });
};
