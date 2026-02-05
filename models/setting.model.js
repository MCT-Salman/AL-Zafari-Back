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
export const findAll = async ({ skip = 0, take = 10, where = {} }) => {
  return prisma.setting.findMany({
    where,
    skip,
    take,
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
export const updateById = async (id, data) => {
  return prisma.setting.update({
    where: { id },
    data,
  });
};

/**
 * تحديث إعداد حسب المفتاح
 */
export const updateByKey = async (key, data) => {
  return prisma.setting.update({
    where: { key },
    data,
  });
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
