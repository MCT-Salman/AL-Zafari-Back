// services/constantValue.service.js
import { ConstantValueModel, MaterialModel } from "../models/index.js";
import logger from "../utils/logger.js";

/**
 * جلب جميع القيم الثابتة مع pagination
 */
export const getAllConstantValues = async (filters = {}) => {
  const where = {};

  // Filter by constant_type_name
  if (filters.type) {
    where.type = filters.type;
  }

  // Filter by isDefault
  if (filters.isDefault !== undefined) {
    where.isDefault = filters.isDefault === 'true';
  }

  // Search by value or label
  if (filters.search) {
    where.OR = [
      { value: { contains: filters.search } },
      { label: { contains: filters.search } },
    ];
  }

  const [constantValues, total] = await Promise.all([
    ConstantValueModel.findAll({ where }),
    ConstantValueModel.count(where),
  ]);

  return {
    constantValues,
    total
  };
};

/**
 * جلب قيمة ثابتة حسب المعرف
 */
export const getConstantValueById = async (constant_value_id) => {
  const constantValue = await ConstantValueModel.findById(constant_value_id);

  if (!constantValue) {
    const error = new Error("القيمة الثابتة غير موجودة");
    error.statusCode = 404;
    throw error;
  }

  return constantValue;
};

/**
 * إنشاء قيمة ثابتة جديدة
 */
export const createConstantValue = async (data) => {
  // Check if material exists
  const material = await MaterialModel.findById(data.material_id);
  if (!material) {
    const error = new Error("المادة غير موجودة");
    error.statusCode = 404;
    throw error;
  }

  const constantValue = await ConstantValueModel.create(data);

  logger.info('Constant value created', { constant_value_id: constantValue.constant_value_id });

  return constantValue;
};

/**
 * تحديث قيمة ثابتة
 */
export const updateConstantValue = async (constant_value_id, data) => {
  // Check if exists
  const constantValue = await getConstantValueById(constant_value_id);
  if (!constantValue) {
    const error = new Error("القيمة الثابتة غير موجودة");
    error.statusCode = 404;
    throw error;
  }

  const updatedConstantValue = await ConstantValueModel.updateById(constant_value_id, data);

  logger.info('Constant value updated', { constant_value_id });

  return updatedConstantValue;
};

/**
 * حذف قيمة ثابتة
 */
export const deleteConstantValue = async (constant_value_id) => {
  // Check if exists
  await getConstantValueById(constant_value_id);

  await ConstantValueModel.deleteById(constant_value_id);

  logger.info('Constant value deleted', { constant_value_id });

  return { message: "تم حذف القيمة الثابتة بنجاح" };
};

/**
 * جلب قيم ثابتة حسب نوع الثابت
 *//*
export const getConstantValuesByTypeId = async (constant_type_id) => {
  const constantType = await ConstantTypeModel.findById(constant_type_id);
  if (!constantType) {
    const error = new Error("النوع الثابت غير موجود");
    error.statusCode = 404;
    throw error;
  }
  const constantValues = await ConstantValueModel.findByTypeId(constant_type_id);
  if (!constantValues) {
    const error = new Error("لا توجد قيم ثابتة لهذا النوع");
    error.statusCode = 404;
    throw error;
  }
  return constantValues;
};
*/

export const getConstantValuesByMaterialId = async (material_id , filters = {}) => {
  const material = await MaterialModel.findById(material_id);
  if (!material) {
    const error = new Error("المادة غير موجودة");
    error.statusCode = 404;
    throw error;
  }
  const constantValues = await ConstantValueModel.findByMaterialId(material_id , filters);
  if (!constantValues) {
    const error = new Error("لا توجد قيم ثابتة لهذه المادة");
    error.statusCode = 404;
    throw error;
  }
  return constantValues;
}
export const getConstantValuesByType = async (constant_type) => {
  console.log(constant_type);
  const constantValues = await ConstantValueModel.findByType(constant_type);
  if (!constantValues) {
    const error = new Error("لا توجد قيم ثابتة لهذا النوع");
    error.statusCode = 404;
    throw error;
  }
  return constantValues;
}

