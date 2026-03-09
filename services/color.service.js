// services/color.service.js
import { ColorModel, RulerModel } from "../models/index.js";
import logger from "../utils/logger.js";
import { deleteFile } from "../utils/deleteFile.js";
import { logCreate, logUpdate, logDelete } from "../utils/activityLogger.js";

/**
 * جلب جميع الألوان 
 */
export const getAllColors = async (filters = {}) => {
  const where = {};

  // Filter by material_id
  if (filters.ruler_id) {
    where.ruler_id = parseInt(filters.ruler_id);
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

export const getColorsByRulerId = async (ruler_id) => {
  // Check if ruler exists
  const ruler = await RulerModel.findById(ruler_id);
  if (!ruler) {
    const error = new Error("المسطرة غير موجودة");
    error.statusCode = 404;
    throw error;
  }

  const colors = await ColorModel.findByRulerId(ruler_id);
  return colors;
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
export const createColor = async (data, req = null) => {
  // Check if ruler exists
  const ruler = await RulerModel.findById(parseInt(data.ruler_id));
  if (!ruler) {
    deleteFile(data.imageUrl);
    const error = new Error("المسطرة غير موجودة");
    error.statusCode = 404;
    throw error;
  }

  const colorWithSameName = await ColorModel.findByNameAndRulerId(data.color_name, parseInt(data.ruler_id));
  if (colorWithSameName) {
    deleteFile(data.imageUrl);
    const error = new Error("اسم اللون موجود بالفعل لهذه المسطرة");
    error.statusCode = 400;
    throw error;
  }

  // Check if color_code already exists
  const existingColor = await ColorModel.findByCodeAndRulerId(data.color_code, parseInt(data.ruler_id));
  if (existingColor) {
    deleteFile(data.imageUrl);
    const error = new Error("كود اللون موجود بالفعل ل هذه المسطرة");
    error.statusCode = 400;
    throw error;
  }
  data.ruler_id = parseInt(data.ruler_id);
  const color = await ColorModel.create(data);

  logger.info('Color created', { color_id: color.color_id });
  // تسجيل النشاط
  if (req) {
    await logCreate(req, "color", color.color_id, color, `Color-${color.color_id}`);
  }
  return color;
};

/**
 * تحديث لون
 */
export const updateColor = async (color_id, data, req = null) => {
  // Check if exists
  const existingColor = await getColorById(color_id);

  const newColorName = data.color_name ?? existingColor.color_name;
  const newColorCode = data.color_code ?? existingColor.color_code;
  const newRulerId = data.ruler_id
    ? parseInt(data.ruler_id)
    : existingColor.ruler_id;

  // If updating material_id, check if it exists
  if (data.ruler_id) {
    const ruler = await RulerModel.findById(parseInt(data.ruler_id));
    if (!ruler) {
      deleteFile(data.imageUrl);
      const error = new Error("المسطرة غير موجودة");
      error.statusCode = 404;
      throw error;
    }
  }

  const colorWithSameName = await ColorModel.findByNameAndRulerId(
    newColorName,
    newRulerId
  );
  if (colorWithSameName && colorWithSameName.color_id !== color_id) {
    deleteFile(data.imageUrl);
    const error = new Error("اسم اللون موجود بالفعل لهذه المسطرة");
    error.statusCode = 400;
    throw error;
  }

  const colorWithSameCode = await ColorModel.findByCodeAndRulerId(
    newColorCode,
    newRulerId
  );

  if (colorWithSameCode && colorWithSameCode.color_id !== color_id) {
    deleteFile(data.imageUrl);
    const error = new Error("كود اللون موجود بالفعل لهذه المسطرة");
    error.statusCode = 400;
    throw error;
  }
  if (data.ruler_id) {
    data.ruler_id = parseInt(data.ruler_id);
  }

  const updatedColor = await ColorModel.updateById(color_id, data);

  logger.info('Color updated', { color_id });
  // تسجيل النشاط
  if (req) {
    await logUpdate(req, "color", color_id, existingColor, updatedColor, `Color-${updatedColor.color_id}`);
  }
  return updatedColor;
};

/**
 * حذف لون
 */
export const deleteColor = async (color_id, req = null) => {
  // Check if exists
  const existingColor = await getColorById(color_id);

  await ColorModel.deleteById(color_id);

  logger.info('Color deleted', { color_id });
  // تسجيل النشاط
  if (req) {
    await logDelete(req, "color", color_id, existingColor, `Color-${color_id}`);
  }
  return { message: "تم حذف اللون بنجاح" };
};


