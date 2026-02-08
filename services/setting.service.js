// services/setting.service.js
import { SettingModel , DiscountModel } from "../models/index.js";
import logger from "../utils/logger.js";

/**
 * جلب جميع الإعدادات
 */
export const getAllSettings = async (filters = {}) => {
  const where = {};

  // Search by key or description
  if (filters.search) {
    where.OR = [
      { key: { contains: filters.search } },
      { description: { contains: filters.search } },
    ];
  }

  const [settings, total] = await Promise.all([
    SettingModel.findAll({ where }),
    SettingModel.count(where),
  ]);

  return {
    settings,
    total,
  };
};

/**
 * جلب إعداد حسب المعرف
 */
export const getSettingById = async (id) => {
  const setting = await SettingModel.findById(id);

  if (!setting) {
    const error = new Error("الإعداد غير موجود");
    error.statusCode = 404;
    throw error;
  }

  return setting;
};

/**
 * جلب إعداد حسب المفتاح
 */
export const getSettingByKey = async (key) => {
  const setting = await SettingModel.findByKey(key);

  if (!setting) {
    const error = new Error("الإعداد غير موجود");
    error.statusCode = 404;
    throw error;
  }

  return setting;
};

/**
 * إنشاء إعداد جديد
 */
export const createSetting = async (data) => {
  // Check if key already exists
  const existingSetting = await SettingModel.findByKey(data.key);
  if (existingSetting) {
    const error = new Error("المفتاح موجود بالفعل");
    error.statusCode = 400;
    throw error;
  }

  const setting = await SettingModel.create(data);

  logger.info("Setting created", { setting_id: setting.id, key: setting.key });

  return setting;
};

/**
 * تحديث إعداد
 */
export const updateSetting = async (id, data) => {
  // Check if exists
  await getSettingById(id);

  // If updating key, check if it's unique
  if (data.key) {
    const settingWithSameKey = await SettingModel.findByKey(data.key);
    if (settingWithSameKey && settingWithSameKey.id !== id) {
      const error = new Error("المفتاح موجود بالفعل");
      error.statusCode = 400;
      throw error;
    }
  }

  const updatedSetting = await SettingModel.updateById(id, data);

  logger.info("Setting updated", { setting_id: id });

  return updatedSetting;
};

/**
 * تحديث إعداد حسب المفتاح
 */
export const updateSettingByKey = async (key, data) => {
  // Check if exists
  await getSettingByKey(key);

  const updatedSetting = await SettingModel.updateByKey(key, data);

  logger.info("Setting updated by key", { key });

  return updatedSetting;
};

/**
 * حذف إعداد
 */
export const deleteSetting = async (id) => {
  // Check if exists
  await getSettingById(id);

  await SettingModel.deleteById(id);

  logger.info("Setting deleted", { setting_id: id });

  return { message: "تم حذف الإعداد بنجاح" };
};

/**
 * إنشاء أو تحديث إعداد (upsert)
 */
export const upsertSetting = async (key, data) => {
  const setting = await SettingModel.upsert(key, data);

  logger.info("Setting upserted", { key });

  return setting;
};


// discount services 
export const getDiscounts = async (filters = {}) => {
  const where = {};

  // Search by name or description
  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search } },
      { description: { contains: filters.search } },
    ];
  }

  const [discounts, total] = await Promise.all([
    DiscountModel.findAll({ where }),
    DiscountModel.count(where),
  ]);

  return {
    discounts,
    total,
  };
};  

export const createDiscount = async (data) => {
  const discount = await DiscountModel.create(data);
  return discount;
};

export const updateDiscount = async (id, data) => {
  const discount = await DiscountModel.updateById(id, data);
  return discount;
};

export const deleteDiscount = async (id) => {
  await DiscountModel.deleteById(id);
  return { message: "تم حذف الخصم بنجاح" };
};

