// services/material.service.js
import { MaterialModel } from "../models/index.js";
import logger from "../utils/logger.js";

/**
 * جلب جميع المواد مع pagination
 */
export const getAllMaterials = async ( filters = {}) => {
  const where = {};

  // Filter by type
  if (filters.type) {
    where.type = filters.type;
  }

  // Search by name
  if (filters.search) {
    where.material_name = {
      contains: filters.search,
    };
  }

  const [materials, total] = await Promise.all([
    MaterialModel.findAll({ where }),
    MaterialModel.count(where),
  ]);

  return {
    materials,
    total
  };
};

/**
 * جلب مادة حسب المعرف
 */
export const getMaterialById = async (material_id) => {
  const material = await MaterialModel.findById(material_id);
  
  if (!material) {
    const error = new Error("المادة غير موجودة");
    error.statusCode = 404;
    throw error;
  }

  return material;
};

/**
 * إنشاء مادة جديدة
 */
export const createMaterial = async (data) => {
  const material = await MaterialModel.create(data);
  
  logger.info('Material created', { material_id: material.material_id });
  
  return material;
};

/**
 * تحديث مادة
 */
export const updateMaterial = async (material_id, data) => {
  // Check if exists
  await getMaterialById(material_id);

  const updatedMaterial = await MaterialModel.updateById(material_id, data);
  
  logger.info('Material updated', { material_id });
  
  return updatedMaterial;
};

/**
 * حذف مادة
 */
export const deleteMaterial = async (material_id) => {
  // Check if exists
  await getMaterialById(material_id);

  await MaterialModel.deleteById(material_id);
  
  logger.info('Material deleted', { material_id });
  
  return { message: "تم حذف المادة بنجاح" };
};

/**
 * جلب مواد حسب النوع
 */
export const getMaterialsByType = async (type) => {
  const materials = await MaterialModel.findByType(type);
  return materials;
};

