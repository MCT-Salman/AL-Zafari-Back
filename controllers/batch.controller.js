// controllers/batch.controller.js
import {
  getAllBatches as getAllBatchesService,
  getBatchById as getBatchByIdService,
  createBatch as createBatchService,
  updateBatch as updateBatchService,
  deleteBatch as deleteBatchService,
} from "../services/batch.service.js";
import { SUCCESS_REQUEST } from "../validators/messagesResponse.js";
import logger from "../utils/logger.js";

export const getAllBatches = async (req, res, next) => {
  try {
    const filters = {
      material_id: req.query.material_id,
      search: req.query.search,
    };

    const result = await getAllBatchesService(filters);

    res.json({
      success: SUCCESS_REQUEST,
      message: "تم جلب الطبخات بنجاح",
      data: result.batches,
      total: result.total,
    });
  } catch (error) {
    logger.error('Get all batches controller error', { message: error?.message });
    return next(error);
  }
};

export const getBatchById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const batch = await getBatchByIdService(parseInt(id));

    res.json({
      success: SUCCESS_REQUEST,
      message: "تم جلب الطبخة بنجاح",
      data: batch,
    });
  } catch (error) {
    logger.error('Get batch by id controller error', { message: error?.message });
    return next(error);
  }
};

export const createBatch = async (req, res, next) => {
  try {
    const data = req.body;
    const batch = await createBatchService(data);

    res.status(201).json({
      success: SUCCESS_REQUEST,
      message: "تم إنشاء الطبخة بنجاح",
      data: batch,
    });
  } catch (error) {
    logger.error('Create batch controller error', { message: error?.message });
    return next(error);
  }
};

export const updateBatch = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const batch = await updateBatchService(parseInt(id), data);

    res.json({
      success: SUCCESS_REQUEST,
      message: "تم تحديث الطبخة بنجاح",
      data: batch,
    });
  } catch (error) {
    logger.error('Update batch controller error', { message: error?.message });
    return next(error);
  }
};

export const deleteBatch = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await deleteBatchService(parseInt(id));

    res.json({
      success: SUCCESS_REQUEST,
      message: result.message,
      data: {},
    });
  } catch (error) {
    logger.error('Delete batch controller error', { message: error?.message });
    return next(error);
  }
};

