// services/setting.service.js
import { SettingModel, DiscountModel, MaterialModel } from "../models/index.js";
import logger from "../utils/logger.js";
import { logCreate, logUpdate, logDelete } from "../utils/activityLogger.js";

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
export const createSetting = async (data, req = null) => {
  // Check if key already exists
  const existingSetting = await SettingModel.findByKey(data.key);
  if (existingSetting) {
    const error = new Error("المفتاح موجود بالفعل");
    error.statusCode = 400;
    throw error;
  }

  const setting = await SettingModel.create(data);

  logger.info("Setting created", { setting_id: setting.id, key: setting.key });
  // تسجيل النشاط
  if (req) {
    await logCreate(req, "setting", setting.id, setting, `Setting-${setting.key}`);
  }
  return setting;
};

/**
 * تحديث إعداد
 */
export const updateSetting = async (id, data, userId, req = null) => {
  // Check if exists
  const existingSetting = await getSettingById(id);

  // If updating key, check if it's unique
  if (data.key) {
    const settingWithSameKey = await SettingModel.findByKey(data.key);
    if (settingWithSameKey && settingWithSameKey.id !== id) {
      const error = new Error("المفتاح موجود بالفعل");
      error.statusCode = 400;
      throw error;
    }
  }

  const updatedSetting = await SettingModel.updateById(id, data, userId);

  logger.info("Setting updated", { setting_id: id });
  // تسجيل النشاط
  if (req) {
    await logUpdate(req, "setting", id, existingSetting, updatedSetting, `Setting-${updatedSetting.key}`);
  }
  return updatedSetting;
};

/**
 * تحديث إعداد حسب المفتاح
 */
export const updateSettingByKey = async (key, data, userId, req = null) => {
  // Check if exists
  const existingSetting = await getSettingByKey(key);

  const updatedSetting = await SettingModel.updateByKey(key, data, userId);

  logger.info("Setting updated by key", { key });
  // تسجيل النشاط
  if (req) {
    await logUpdate(req, "setting", updatedSetting.id, existingSetting, updatedSetting, `Setting-${updatedSetting.key}`);
  }
  return updatedSetting;
};

/**
 * حذف إعداد
 */
export const deleteSetting = async (id, req = null) => {
  // Check if exists
  const existingSetting = await getSettingById(id);

  await SettingModel.deleteById(id);

  logger.info("Setting deleted", { setting_id: id });
  // تسجيل النشاط
  if (req) {
    await logDelete(req, "setting", id, existingSetting, `Setting-${existingSetting.key}`);
  }
  return { message: "تم حذف الإعداد بنجاح" };
};

/**
 * إنشاء أو تحديث إعداد (upsert)
 */
export const upsertSetting = async (key, data, req = null) => {
  const setting = await SettingModel.upsert(key, data);

  logger.info("Setting upserted", { key });
  // تسجيل النشاط
  if (req) {
    await logUpdate(req, "setting", setting.id, setting, `Setting-${setting.key}`);
  }
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

export const createDiscount = async (data, req = null) => {
  // Check if material exists
  const material_id = parseInt(data.material_id);
  const material = await MaterialModel.findById(material_id);
  if (!material) {
    const error = new Error("المادة غير موجودة");
    error.statusCode = 404;
    throw error;
  }
  const quantity = Number(data.quantity);
  const existingdiscount = await DiscountModel.findByMaterialIdAndQuantity(material_id, quantity);
  if (existingdiscount) {
    const error = new Error(" الخصم موجود بالفعل لنفس المادة والكمية");
    error.statusCode = 400;
    throw error;
  }


  const discount = await DiscountModel.create(data);
  logger.info("Discount created", { discount_id: discount.discount_id });
  // تسجيل النشاط
  if (req) {
    await logCreate(req, "discount", discount.discount_id, discount, `Discount-${discount.discount_id}`);
  }
  return discount;
};

export const updateDiscount = async (id, data, req = null) => {
  const material_id = parseInt(data.material_id);
  // Check if discount exists
  const existingDiscount1 = await DiscountModel.findById(id);
  if (!existingDiscount1) {
    const error = new Error("الخصم غير موجود");
    error.statusCode = 404;
    throw error;
  }
  // Check if material exists
  const material = await MaterialModel.findById(material_id);
  if (!material) {
    const error = new Error("المادة غير موجودة");
    error.statusCode = 404;
    throw error;
  }
  const quantity = Number(data.quantity);
  const existingDiscount =
    await DiscountModel.findByMaterialIdAndQuantity(
      material_id,
      quantity
    );

  if (existingDiscount && existingDiscount.id !== id) {
    const error = new Error("الخصم موجود بالفعل لنفس المادة والكمية");
    error.statusCode = 400;
    throw error;
  }

  const discount = await DiscountModel.updateById(id, data);
  logger.info("Discount updated", { discount_id: id });
  // تسجيل النشاط
  if (req) {
    await logUpdate(req, "discount", id, existingDiscount, discount, `Discount-${discount.discount_id}`);
  }
  return discount;
};

export const deleteDiscount = async (id, req = null) => {
  const existingDiscount = await DiscountModel.findById(id);
  const deleted = await DiscountModel.deleteById(id);
  logger.info("Discount deleted", { discount_id: id });
  // تسجيل النشاط
  if (req) {
    await logDelete(req, "discount", id, existingDiscount, `Discount-${existingDiscount.discount_id}`);
  }
  return { message: "تم حذف الخصم بنجاح" };
};

export const getExchangeRateLog = async () => {
  const log = await prisma.exchangeRateLog.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return log;
};

export const getDiscountsByMaterialId = async (material_id) => {
  const discounts = await DiscountModel.findByMaterialId(parseInt(material_id));
  return discounts;
};
