// services/constantType.service.js
import { ConstantTypeModel } from "../models/index.js";
import logger from "../utils/logger.js";
import { logCreate, logUpdate, logDelete } from "../utils/activityLogger.js";

/**
 * جلب جميع الأنواع الثابتة مع pagination
 */
export const getAllConstantTypes = async (filters = {}) => {
  const where = {};

  // Filter by type
  if (filters.type) {
    where.type = filters.type;
  }

  // Search by name
  if (filters.search) {
    where.constants_Type_name = {
      contains: filters.search,
    };
  }

  const [constantTypes, total] = await Promise.all([
    ConstantTypeModel.findAll({ where }),
    ConstantTypeModel.count(where),
  ]);

  return {
    constantTypes,
    total
  };
};

/**
 * جلب نوع ثابت حسب المعرف
 */
export const getConstantTypeById = async (constant_type_id) => {
  const constantType = await ConstantTypeModel.findById(constant_type_id);

  if (!constantType) {
    const error = new Error("النوع الثابت غير موجود");
    error.statusCode = 404;
    throw error;
  }

  return constantType;
};

/**
 * إنشاء نوع ثابت جديد
 */
export const createConstantType = async (data, req = null) => {
  const constantType = await ConstantTypeModel.create(data);

  logger.info('Constant type created', { constant_type_id: constantType.constant_type_id });
  // تسجيل النشاط
  if (req) {
    await logCreate(req, "constant_type", constantType.constant_type_id, constantType, `Constant type-${constantType.constant_type_id}`);
  }
  return constantType;
};

/**
 * تحديث نوع ثابت
 */
export const updateConstantType = async (constant_type_id, data, req = null) => {
  // Check if exists
  const existingConstantType = await getConstantTypeById(constant_type_id);

  const updatedConstantType = await ConstantTypeModel.updateById(constant_type_id, data);

  logger.info('Constant type updated', { constant_type_id });
  // تسجيل النشاط
  if (req) {
    await logUpdate(req, "constant_type", constant_type_id, existingConstantType, updatedConstantType, `Constant type-${constant_type_id}`);
  }
  return updatedConstantType;
};

/**
 * حذف نوع ثابت
 */
export const deleteConstantType = async (constant_type_id, req = null) => {
  // Check if exists
  const existingConstantType = await getConstantTypeById(constant_type_id);

  await ConstantTypeModel.deleteById(constant_type_id);

  logger.info('Constant type deleted', { constant_type_id });
  // تسجيل النشاط
  if (req) {
    await logDelete(req, "constant_type", constant_type_id, existingConstantType, `Constant type-${constant_type_id}`);
  }
  return { message: "تم حذف النوع الثابت بنجاح" };
};

/**
 * جلب أنواع ثابتة حسب النوع
 */
export const getConstantTypesByType = async (type) => {
  const constantTypes = await ConstantTypeModel.findByType(type);
  return constantTypes;
};

