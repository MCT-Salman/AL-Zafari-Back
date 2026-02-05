// services/color.service.js
import { ColorModel, MaterialModel } from "../models/index.js";
import logger from "../utils/logger.js";

/**
 * جلب جميع الألوان مع pagination
 */
export const getAllColors = async ( filters = {}) => {
  const where = {};

  // Filter by material_id
  if (filters.material_id) {
    where.material_id = parseInt(filters.material_id);
  }

  // Search by name or code
  if (filters.search) {
    where.OR = [
      { color_name: { contains: filters.search } },
      { color_code: { contains: filters.search } },
    ];
  }

  const [colors, total] = await Promise.all([
    ColorModel.findAll({ where }),
    ColorModel.count(where),
  ]);

  return {
    colors,
    total
  };
};

/**
 * جلب لون حسب المعرف
 */
export const getColorById = async (color_id) => {
  const color = await ColorModel.findById(color_id);
  
  if (!color) {
    const error = new Error("اللون غير موجود");
    error.statusCode = 404;
    throw error;
  }

  return color;
};

/**
 * إنشاء لون جديد
 */
export const createColor = async (data) => {
  // Check if material exists
  const material = await MaterialModel.findById(data.material_id);
  if (!material) {
    const error = new Error("المادة غير موجودة");
    error.statusCode = 404;
    throw error;
  }

  // Check if color_code already exists
  const existingColor = await ColorModel.findByCode(data.color_code);
  if (existingColor) {
    const error = new Error("كود اللون موجود بالفعل");
    error.statusCode = 400;
    throw error;
  }

  const color = await ColorModel.create(data);
  
  logger.info('Color created', { color_id: color.color_id });
  
  return color;
};

/**
 * تحديث لون
 */
export const updateColor = async (color_id, data) => {
  // Check if exists
  const existingColor = await getColorById(color_id);

  // If updating material_id, check if it exists
  if (data.material_id) {
    const material = await MaterialModel.findById(data.material_id);
    if (!material) {
      const error = new Error("المادة غير موجودة");
      error.statusCode = 404;
      throw error;
    }
  }

  // If updating color_code, check if it's unique
  if (data.color_code && data.color_code !== existingColor.color_code) {
    const colorWithSameCode = await ColorModel.findByCode(data.color_code);
    if (colorWithSameCode) {
      const error = new Error("كود اللون موجود بالفعل");
      error.statusCode = 400;
      throw error;
    }
  }

  const updatedColor = await ColorModel.updateById(color_id, data);
  
  logger.info('Color updated', { color_id });
  
  return updatedColor;
};

/**
 * حذف لون
 */
export const deleteColor = async (color_id) => {
  // Check if exists
  await getColorById(color_id);

  await ColorModel.deleteById(color_id);
  
  logger.info('Color deleted', { color_id });
  
  return { message: "تم حذف اللون بنجاح" };
};

/**
 * جلب ألوان حسب المادة
 */
export const getColorsByMaterialId = async (material_id) => {
  const colors = await ColorModel.findByMaterialId(material_id);
  return colors;
};

