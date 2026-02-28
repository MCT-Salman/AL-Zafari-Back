// services/batch.service.js
import { BatchModel, MaterialModel } from "../models/index.js";
import logger from "../utils/logger.js";

/**
 * جلب جميع الطبخات مع pagination
 */
export const getAllBatches = async (filters = {}) => {
  const where = {};

  // Filter by material_id
  if (filters.material_id) {
    where.material_id = parseInt(filters.material_id);
  }

  // Search by batch_number
  if (filters.search) {
    where.batch_number = {
      contains: filters.search,
    };
  }

  const [batches, total] = await Promise.all([
    BatchModel.findAll({ where }),
    BatchModel.count(where),
  ]);

  return {
    batches,
    total
  };
};

/**
 * جلب طبخة حسب المعرف
 */
export const getBatchById = async (batch_id) => {
  const batch = await BatchModel.findById(batch_id);

  if (!batch) {
    const error = new Error("الطبخة غير موجودة");
    error.statusCode = 404;
    throw error;
  }

  return batch;
};

/**
 * إنشاء طبخة جديدة
 */
export const createBatch = async (data) => {
  // Check if material exists
  const material = await MaterialModel.findById(data.material_id);
  if (!material) {
    const error = new Error("المادة غير موجودة");
    error.statusCode = 404;
    throw error;
  }

  // Check if batch_number already exists
  const existingBatch = await BatchModel.findByBatchNumberAndMaterialId(data.batch_number, parseInt(data.material_id));
  if (existingBatch) {
    const error = new Error("رقم الطبخة موجود بالفعل ل هذه المادة");
    error.statusCode = 400;
    throw error;
  }

  const batch = await BatchModel.create(data);

  logger.info('Batch created', { batch_id: batch.batch_id });

  return batch;
};

/**
 * تحديث طبخة
 */
export const updateBatch = async (batch_id, data) => {
  // Check if exists
  const existingBatch = await getBatchById(batch_id);

  const newBatchNumber = data.batch_number ?? existingBatch.batch_number;
  const newMaterialId = data.material_id
    ? parseInt(data.material_id)
    : existingBatch.material_id;

  // If updating material_id, check if it exists
  if (data.material_id) {
    const material = await MaterialModel.findById(data.material_id);
    if (!material) {
      const error = new Error("المادة غير موجودة");
      error.statusCode = 404;
      throw error;
    }
  }

  const batchWithSameNumber = await BatchModel.findByBatchNumberAndMaterialId(
    newBatchNumber,
    newMaterialId
  );

  if (batchWithSameNumber && batchWithSameNumber.batch_id !== batch_id) {
    const error = new Error("رقم الطبخة موجود بالفعل ل هذه المادة");
    error.statusCode = 400;
    throw error;
  }

  const updatedBatch = await BatchModel.updateById(batch_id, data);

  logger.info('Batch updated', { batch_id });

  return updatedBatch;
};

/**
 * حذف طبخة
 */
export const deleteBatch = async (batch_id) => {
  // Check if exists
  await getBatchById(batch_id);

  await BatchModel.deleteById(batch_id);

  logger.info('Batch deleted', { batch_id });

  return { message: "تم حذف الطبخة بنجاح" };
};

/**
 * جلب الطبخات حسب المادة
 */
export const getBatchesByMaterialId = async (material_id) => {
  const batches = await BatchModel.findByMaterialId(material_id);
  return batches;
};

