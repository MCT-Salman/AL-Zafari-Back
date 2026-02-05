// services/constantValue.service.js
import { ConstantValueModel, ConstantTypeModel } from "../models/index.js";
import logger from "../utils/logger.js";

/**
 * جلب جميع القيم الثابتة مع pagination
 */
export const getAllConstantValues = async (filters = {}) => {
  const where = {};

  // Filter by constant_type_id
  if (filters.constant_type_id) {
    where.constant_type_id = parseInt(filters.constant_type_id);
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
  // Check if constant type exists
  const constantType = await ConstantTypeModel.findById(data.constant_type_id);
  if (!constantType) {
    const error = new Error("النوع الثابت غير موجود");
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
  await getConstantValueById(constant_value_id);

  // If updating constant_type_id, check if it exists
  if (data.constant_type_id) {
    const constantType = await ConstantTypeModel.findById(data.constant_type_id);
    if (!constantType) {
      const error = new Error("النوع الثابت غير موجود");
      error.statusCode = 404;
      throw error;
    }
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
 */
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

