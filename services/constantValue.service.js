// services/constantValue.service.js
import { ConstantValueModel, MaterialModel } from "../models/index.js";
import logger from "../utils/logger.js";
import { logCreate, logUpdate, logDelete } from "../utils/activityLogger.js";

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
export const createConstantValue = async (data , req = null) => {

  const materialId = parseInt(data.material_id);

  const material = await MaterialModel.findById(materialId);
  if (!material) {
    const error = new Error("المادة غير موجودة");
    error.statusCode = 404;
    throw error;
  }

  const existing = await prisma.constantValue.findFirst({
    where: {
      material_id: materialId,
      type: data.type,
      value: data.value
    }
  });

  if (existing) {
    const error = new Error("القيمة موجودة بالفعل لهذه المادة");
    error.statusCode = 400;
    throw error;
  }

  const result = await prisma.$transaction(async (tx) => {

    // إذا كانت Default → إلغاء أي Default سابق
    if (data.isDefault === true) {
      await tx.constantValue.updateMany({
        where: {
          material_id: materialId,
          type: data.type
        },
        data: { isDefault: false }
      });
    }

    // إنشاء السجل
    const created = await tx.constantValue.create({
      data: {
        ...data,
        material_id: materialId
      }
    });

    return created;
  });

  logger.info('Constant value created', {
    constant_value_id: result.constant_value_id
  });
  // تسجيل النشاط
  if (req) {
    await logCreate(req, "constant_value", result.constant_value_id, result, `Constant value-${result.constant_value_id}`);
  }
  return result;
};

/**
 * تحديث قيمة ثابتة
 */
export const updateConstantValue = async (constant_value_id, data , req = null) => {

  const constantValue = await getConstantValueById(constant_value_id);

  const newValue = data.value ?? constantValue.value;
  const newMaterialId = data.material_id
    ? parseInt(data.material_id)
    : constantValue.material_id;

  if (data.material_id) {
    const material = await MaterialModel.findById(newMaterialId);
    if (!material) {
      const error = new Error("المادة غير موجودة");
      error.statusCode = 404;
      throw error;
    }
  }

  const existing = await prisma.constantValue.findFirst({
    where: {
      material_id: newMaterialId,
      type: constantValue.type,
      value: newValue,
      NOT: { constant_value_id }
    }
  });

  if (existing) {
    const error = new Error("القيمة موجودة بالفعل لهذه المادة");
    error.statusCode = 400;
    throw error;
  }

  const result = await prisma.$transaction(async (tx) => {

    // إذا سيتم تعيينها Default
    if (data.isDefault === true) {
      await tx.constantValue.updateMany({
        where: {
          material_id: newMaterialId,
          type: constantValue.type
        },
        data: { isDefault: false }
      });
    }

    // تحديث السجل نفسه
    const updated = await tx.constantValue.update({
      where: { constant_value_id },
      data: {
        ...data,
        material_id: newMaterialId
      }
    });

    return updated;
  });

  logger.info('Constant value updated', { constant_value_id });
  // تسجيل النشاط
  if (req) {
    await logUpdate(req, "constant_value", constant_value_id, constantValue, result, `Constant value-${constant_value_id}`);
  }
  return result;
};

/**
 * حذف قيمة ثابتة
 */
export const deleteConstantValue = async (constant_value_id , req = null) => {
  // Check if exists
  const existingConstantValue = await getConstantValueById(constant_value_id);

  await ConstantValueModel.deleteById(constant_value_id);

  logger.info('Constant value deleted', { constant_value_id });
  // تسجيل النشاط
  if (req) {
    await logDelete(req, "constant_value", constant_value_id, existingConstantValue, `Constant value-${constant_value_id}`);
  }
  return { message: "تم حذف القيمة الثابتة بنجاح" };
};

export const getConstantValuesByMaterialId = async (material_id, filters = {}) => {
  const material = await MaterialModel.findById(material_id);
  if (!material) {
    const error = new Error("المادة غير موجودة");
    error.statusCode = 404;
    throw error;
  }
  const constantValues = await ConstantValueModel.findByMaterialId(material_id, filters);
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

