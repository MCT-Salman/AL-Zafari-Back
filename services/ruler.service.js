// services/ruler.service.js
import { RulerModel, MaterialModel, ColorModel } from "../models/index.js";
import logger from "../utils/logger.js";

/**
 * جلب جميع المساطر مع pagination
 */
export const getAllRulers = async ( filters = {}) => {
  const where = {};

  // Filter by material_id
  if (filters.material_id) {
    where.material_id = parseInt(filters.material_id);
  }

  // Filter by color_id
  if (filters.color_id) {
    where.color_id = parseInt(filters.color_id);
  }

  // Filter by ruler_type
  if (filters.ruler_type) {
    where.ruler_type = filters.ruler_type;
  }

  const [rulers, total] = await Promise.all([
    RulerModel.findAll({ where }),
    RulerModel.count(where),
  ]);

  return {
    rulers,
    total
  };
};

/**
 * جلب مسطرة حسب المعرف
 */
export const getRulerById = async (ruler_id) => {
  const ruler = await RulerModel.findById(ruler_id);
  
  if (!ruler) {
    const error = new Error("المسطرة غير موجودة");
    error.statusCode = 404;
    throw error;
  }

  return ruler;
};

/**
 * إنشاء مسطرة جديدة
 */
export const createRuler = async (data) => {
  // Check if material exists
  const material = await MaterialModel.findById(data.material_id);
  if (!material) {
    const error = new Error("المادة غير موجودة");
    error.statusCode = 404;
    throw error;
  }

  // Check if color exists
  const color = await ColorModel.findById(data.color_id);
  if (!color) {
    const error = new Error("اللون غير موجود");
    error.statusCode = 404;
    throw error;
  }

  const ruler = await RulerModel.create(data);
  
  logger.info('Ruler created', { ruler_id: ruler.ruler_id });
  
  return ruler;
};

/**
 * تحديث مسطرة
 */
export const updateRuler = async (ruler_id, data) => {
  // Check if exists
  await getRulerById(ruler_id);

  // If updating material_id, check if it exists
  if (data.material_id) {
    const material = await MaterialModel.findById(data.material_id);
    if (!material) {
      const error = new Error("المادة غير موجودة");
      error.statusCode = 404;
      throw error;
    }
  }

  // If updating color_id, check if it exists
  if (data.color_id) {
    const color = await ColorModel.findById(data.color_id);
    if (!color) {
      const error = new Error("اللون غير موجود");
      error.statusCode = 404;
      throw error;
    }
  }

  const updatedRuler = await RulerModel.updateById(ruler_id, data);
  
  logger.info('Ruler updated', { ruler_id });
  
  return updatedRuler;
};

/**
 * حذف مسطرة
 */
export const deleteRuler = async (ruler_id) => {
  // Check if exists
  await getRulerById(ruler_id);

  await RulerModel.deleteById(ruler_id);
  
  logger.info('Ruler deleted', { ruler_id });
  
  return { message: "تم حذف المسطرة بنجاح" };
};

/**
 * جلب مساطر حسب المادة
 */
export const getRulersByMaterialId = async (material_id) => {
  const rulers = await RulerModel.findByMaterialId(material_id);
  return rulers;
};

/**
 * جلب مساطر حسب اللون
 */
export const getRulersByColorId = async (color_id) => {
  const rulers = await RulerModel.findByColorId(color_id);
  return rulers;
};

