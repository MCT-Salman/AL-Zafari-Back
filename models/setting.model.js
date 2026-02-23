// models/setting.model.js
import prisma from "../prisma/client.js";

/**
 * إنشاء إعداد جديد
 */
export const create = async (data) => {
  return prisma.setting.create({
    data,
  });
};

/**
 * البحث عن إعداد حسب المعرف
 */
export const findById = async (id) => {
  return prisma.setting.findUnique({
    where: { id },
  });
};

/**
 * البحث عن إعداد حسب المفتاح
 */
export const findByKey = async (key) => {
  return prisma.setting.findUnique({
    where: { key },
  });
};

/**
 * جلب جميع الإعدادات
 */
export const findAll = async ({ where = {} }) => {
  return prisma.setting.findMany({
    where,
    orderBy: { key: "asc" },
  });
};

/**
 * عد جميع الإعدادات
 */
export const count = async (where = {}) => {
  return prisma.setting.count({ where });
};

/**
 * تحديث إعداد حسب المعرف
 */
export const updateById = async (id, data, userId) => {
  let updatedSetting;
  await prisma.$transaction(async (tx) => {
    const setting = await tx.setting.findUnique({
      where: { id },
    });
    if (data.key === "exchange" && data.value) {
      updatedSetting = await tx.setting.update({
        where: { id },
        data: {
          key: data.key,
          value: data.value,
        },
      });
      const oldRate = setting.value;
      const newRate = data.value;

      await prisma.exchangeRateLog.create({
        data: {
          oldRate,
          newRate,
          changedBy: userId,
        },
      });

    }
  });
  return updatedSetting;
};

/**
 * تحديث إعداد حسب المفتاح
 */
export const updateByKey = async (key, data, userId) => {
  let updatedSetting;
  await prisma.$transaction(async (tx) => {
    const setting = await tx.setting.findUnique({
      where: { key },
    });
    if (key === "exchange" && data.value) {
      updatedSetting = await tx.setting.update({
        where: { key },
        data: {
          key: data.key,
          value: data.value,
        },
      });
      const oldRate = setting.value;
      const newRate = data.value;

      await prisma.exchangeRateLog.create({
        data: {
          oldRate,
          newRate,
          changedBy: userId,
        },
      });

    }
  });
  return updatedSetting;
};

/**
 * حذف إعداد نهائيًا
 */
export const deleteById = async (id) => {
  return prisma.setting.delete({
    where: { id },
  });
};

/**
 * حذف إعداد حسب المفتاح
 */
export const deleteByKey = async (key) => {
  return prisma.setting.delete({
    where: { key },
  });
};

/**
 * إنشاء أو تحديث إعداد (upsert)
 */
export const upsert = async (key, data) => {
  return prisma.setting.upsert({
    where: { key },
    update: data,
    create: { key, ...data },
  });
};
