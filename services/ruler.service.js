// services/ruler.service.js
import { RulerModel, MaterialModel, ColorModel } from "../models/index.js";
import logger from "../utils/logger.js";
import { logCreate, logUpdate, logDelete } from "../utils/activityLogger.js";
/**
 * جلب جميع المساطر مع pagination
 */
export const getAllRulers = async (filters = {}) => {
  const where = {};

  // Filter by material_id
  if (filters.material_id) {
    where.material_id = parseInt(filters.material_id);
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
 * جلب مساطر حسب المادة
 */
export const getRulersByMaterialId = async (material_id) => {
  // Check if material exists
  const material = await MaterialModel.findById(material_id);
  if (!material) {
    const error = new Error("المادة غير موجودة");
    error.statusCode = 404;
    throw error;
  }
  const rulers = await RulerModel.findByMaterialId(material_id);
  return rulers;
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
export const createRuler = async (data , req = null) => {
  // Check if material exists
  const material = await MaterialModel.findById(data.material_id);
  if (!material) {
    const error = new Error("المادة غير موجودة");
    error.statusCode = 404;
    throw error;
  }
  // Check if ruler_name already exists
  const existingRuler = await RulerModel.findByNameAndMaterialId(data.ruler_name, data.material_id);
  if (existingRuler) {
    const error = new Error("اسم المسطرة موجود بالفعل ل هذه المادة");
    error.statusCode = 400;
    throw error;
  }

  const ruler = await RulerModel.create(data);

  logger.info('Ruler created', { ruler_id: ruler.ruler_id });
  // تسجيل النشاط
  if (req) {
    await logCreate(req, "ruler", ruler.ruler_id, ruler, `Ruler-${ruler.ruler_id}`);
  }
  return ruler;
};

/**
 * تحديث مسطرة
 */
export const updateRuler = async (ruler_id, data , req = null) => {
  // Check if exists
  await getRulerById(ruler_id);
  const newRulerName = data.ruler_name ?? existingRuler.ruler_name;
  const newMaterialId = data.material_id
    ? parseInt(data.material_id)
    : existingRuler.material_id;

  // If updating material_id, check if it exists
  if (data.material_id) {
    const material = await MaterialModel.findById(data.material_id);
    if (!material) {
      const error = new Error("المادة غير موجودة");
      error.statusCode = 404;
      throw error;
    }
  }

  const rulerWithSameName = await RulerModel.findByNameAndMaterialId(
    newRulerName,
    newMaterialId
  );
  if (rulerWithSameName && rulerWithSameName.ruler_id !== ruler_id) {
    const error = new Error("اسم المسطرة موجود بالفعل ل هذه المادة");
    error.statusCode = 400;
    throw error;
  }

  const updatedRuler = await RulerModel.updateById(ruler_id, data);

  logger.info('Ruler updated', { ruler_id });
  // تسجيل النشاط
  if (req) {
    await logUpdate(req, "ruler", ruler_id, existingRuler, updatedRuler, `Ruler-${updatedRuler.ruler_id}`);
  }
  return updatedRuler;
};

/**
 * حذف مسطرة
 */
export const deleteRuler = async (ruler_id , req = null) => {
  // Check if exists
  await getRulerById(ruler_id);

  await RulerModel.deleteById(ruler_id);

  logger.info('Ruler deleted', { ruler_id });
  // تسجيل النشاط
  if (req) {
    await logDelete(req, "ruler", ruler_id, existingRuler, `Ruler-${ruler_id}`);
  }
  return { message: "تم حذف المسطرة بنجاح" };
};


