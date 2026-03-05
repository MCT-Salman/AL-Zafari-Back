// services/priceColor.service.js
import { PriceColorModel, ColorModel, ConstantValueModel } from "../models/index.js";
import logger from "../utils/logger.js";
import { logCreate, logUpdate, logDelete } from "../utils/activityLogger.js";

/**
 * جلب جميع أسعار الألوان مع pagination
 */
export const getAllPriceColors = async (filters = {}) => {
  const where = {};

  // Filter by color_id
  if (filters.color_id) {
    where.color_id = parseInt(filters.color_id);
  }

  // Filter by constant_value_id
  if (filters.type_item) {
    where.type_item = parseInt(filters.type_item);
  }

  // Filter by price_color_By
  if (filters.price_color_By) {
    where.price_color_By = filters.price_color_By;
  }

  const [priceColors, total] = await Promise.all([
    PriceColorModel.findAll({ where }),
    PriceColorModel.count(where),
  ]);

  return {
    priceColors,
    total
  };
};

/**
 * جلب سعر لون حسب المعرف
 */
export const getPriceColorById = async (price_color_id) => {
  const priceColor = await PriceColorModel.findById(price_color_id);

  if (!priceColor) {
    const error = new Error("سعر اللون غير موجود");
    error.statusCode = 404;
    throw error;
  }

  return priceColor;
};

/**
 * إنشاء سعر لون جديد
 */
export const createPriceColor = async (data, req = null) => {
  // Check if color exists
  const color = await ColorModel.findById(data.color_id);
  if (!color) {
    const error = new Error("اللون غير موجود");
    error.statusCode = 404;
    throw error;
  }
  const type_item = data.type_item ? data.type_item : null;
  const existingPriceColor = await PriceColorModel.findPriceByColorAndValue(data.color_id, data.price_color_By, type_item);
  if (existingPriceColor) {
    const error = new Error("سعر اللون موجود بالفعل لنفس اللون لنفس النوع");
    error.statusCode = 400;
    throw error;
  }

  const priceColor = await PriceColorModel.create(data);

  logger.info('Price color created', { price_color_id: priceColor.price_color_id });
  // تسجيل النشاط
  if (req) {
    await logCreate(req, "price_color", priceColor.price_color_id, priceColor, `Price color-${priceColor.price_color_id}`);
  }
  return priceColor;
};

/**
 * تحديث سعر لون
 */
export const updatePriceColor = async (price_color_id, data, req = null) => {
  // Check if exists
  await getPriceColorById(price_color_id);

  // If updating color_id, check if it exists
  if (data.color_id) {
    const color = await ColorModel.findById(data.color_id);
    if (!color) {
      const error = new Error("اللون غير موجود");
      error.statusCode = 404;
      throw error;
    }
  }
  const type_item = data.type_item ? data.type_item : null;
  const existingPriceColor = await PriceColorModel.findPriceByColorAndValue(data.color_id, data.price_color_By, type_item);
  if (existingPriceColor && existingPriceColor.price_color_id !== price_color_id) {
    const error = new Error("سعر اللون موجود بالفعل لنفس اللون لنفس النوع");
    error.statusCode = 400;
    throw error;
  }

  const updatedPriceColor = await PriceColorModel.updateById(price_color_id, data);

  logger.info('Price color updated', { price_color_id });
  // تسجيل النشاط
  if (req) {
    await logUpdate(req, "price_color", price_color_id, existingPriceColor, updatedPriceColor, `Price color-${price_color_id}`);
  }
  return updatedPriceColor;
};

/**
 * حذف سعر لون
 */
export const deletePriceColor = async (price_color_id, req = null) => {
  // Check if exists
  await getPriceColorById(price_color_id);

  await PriceColorModel.deleteById(price_color_id);

  logger.info('Price color deleted', { price_color_id });
  // تسجيل النشاط
  if (req) {
    await logDelete(req, "price_color", price_color_id, existingPriceColor, `Price color-${price_color_id}`);
  }
  return { message: "تم حذف سعر اللون بنجاح" };
};

/**
 * جلب أسعار حسب اللون
 */
export const getPriceColorsByColorId = async (color_id) => {
  const priceColors = await PriceColorModel.findByColorId(color_id);
  return priceColors;
};

