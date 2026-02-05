// services/priceColor.service.js
import { PriceColorModel, ColorModel, ConstantValueModel } from "../models/index.js";
import logger from "../utils/logger.js";

/**
 * جلب جميع أسعار الألوان مع pagination
 */
export const getAllPriceColors = async ( filters = {}) => {
  const where = {};

  // Filter by color_id
  if (filters.color_id) {
    where.color_id = parseInt(filters.color_id);
  }

  // Filter by constant_value_id
  if (filters.constant_value_id) {
    where.constant_value_id = parseInt(filters.constant_value_id);
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
export const createPriceColor = async (data) => {
  // Check if color exists
  const color = await ColorModel.findById(data.color_id);
  if (!color) {
    const error = new Error("اللون غير موجود");
    error.statusCode = 404;
    throw error;
  }

  // Check if constant value exists
  const constantValue = await ConstantValueModel.findById(data.constant_value_id);
  if (!constantValue) {
    const error = new Error("القيمة الثابتة غير موجودة");
    error.statusCode = 404;
    throw error;
  }

  const priceColor = await PriceColorModel.create(data);
  
  logger.info('Price color created', { price_color_id: priceColor.price_color_id });
  
  return priceColor;
};

/**
 * تحديث سعر لون
 */
export const updatePriceColor = async (price_color_id, data) => {
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

  // If updating constant_value_id, check if it exists
  if (data.constant_value_id) {
    const constantValue = await ConstantValueModel.findById(data.constant_value_id);
    if (!constantValue) {
      const error = new Error("القيمة الثابتة غير موجودة");
      error.statusCode = 404;
      throw error;
    }
  }

  const updatedPriceColor = await PriceColorModel.updateById(price_color_id, data);
  
  logger.info('Price color updated', { price_color_id });
  
  return updatedPriceColor;
};

/**
 * حذف سعر لون
 */
export const deletePriceColor = async (price_color_id) => {
  // Check if exists
  await getPriceColorById(price_color_id);

  await PriceColorModel.deleteById(price_color_id);
  
  logger.info('Price color deleted', { price_color_id });
  
  return { message: "تم حذف سعر اللون بنجاح" };
};

/**
 * جلب أسعار حسب اللون
 */
export const getPriceColorsByColorId = async (color_id) => {
  const priceColors = await PriceColorModel.findByColorId(color_id);
  return priceColors;
};

