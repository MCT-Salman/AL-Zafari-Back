// services/material.service.js
import { MaterialModel } from "../models/index.js";
import logger from "../utils/logger.js";
import { logCreate, logUpdate, logDelete } from "../utils/activityLogger.js";
/**
 * جلب جميع المواد مع pagination
 */
export const getAllMaterials = async (filters = {}) => {
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
export const createMaterial = async (data , req = null) => {
  // Check if material_name already exists
  const existingMaterial = await MaterialModel.findByName(data.material_name);
  if (existingMaterial) {
    const error = new Error("اسم المادة موجود بالفعل");
    error.statusCode = 400;
    throw error;
  }
  const material = await MaterialModel.create(data);

  logger.info('Material created', { material_id: material.material_id });
  // تسجيل النشاط
  if (req) {
    await logCreate(req, "material", material.material_id, material, `Material-${material.material_id}`);
  }
  return material;
};

/**
 * تحديث مادة
 */
export const updateMaterial = async (material_id, data, req = null) => {
  // Check if exists
  await getMaterialById(material_id);
  const newMaterialName = data.material_name ?? existingMaterial.material_name;
  const materialWithSameName = await MaterialModel.findByName(newMaterialName);
  if (materialWithSameName && materialWithSameName.material_id !== material_id) {
    const error = new Error("اسم المادة موجود بالفعل");
    error.statusCode = 400;
    throw error;
  }

  const updatedMaterial = await MaterialModel.updateById(material_id, data);

  logger.info('Material updated', { material_id });
  // تسجيل النشاط
  if (req) {
    await logUpdate(req, "material", material_id, existingMaterial, updatedMaterial, `Material-${updatedMaterial.material_id}`);
  }
  return updatedMaterial;
};

/**
 * حذف مادة
 */
export const deleteMaterial = async (material_id, req = null) => {
  // Check if exists
  await getMaterialById(material_id);

  await MaterialModel.deleteById(material_id);

  logger.info('Material deleted', { material_id });
  // تسجيل النشاط
  if (req) {
    await logDelete(req, "material", material_id, existingMaterial, `Material-${material_id}`);
  }
  return { message: "تم حذف المادة بنجاح" };
};

/**
 * جلب مواد حسب النوع
 */
export const getMaterialsByType = async (type) => {
  const materials = await MaterialModel.findByType(type);
  return materials;
};

