import {
  createProductionProcess,
  updateProductionProcess,
  getProductionProcessById,
  getAllProductionProcesses,
  deleteProductionProcess,
} from "../services/productionProcess.service.js";

import { SUCCESS_REQUEST } from "../validators/messagesResponse.js";
import logger from "../utils/logger.js";

/**
 * GET /production-process
 */
export const getProcesses = async (req, res, next) => {
  try {
    const data = await getAllProductionProcesses(req.query, req.user.role);

    res.json({
      success: SUCCESS_REQUEST,
      message: "تم جلب عمليات الإنتاج بنجاح",
      data,
    });
  } catch (error) {
    logger.error("Get production processes controller error", { error });
    next(error);
  }
};

/**
 * GET /production-process/:id
 */
export const getProcessById = async (req, res, next) => {
  try {
    const process = await getProductionProcessById(
      parseInt(req.params.id),
      req.user.role
    );

    res.json({
      success: SUCCESS_REQUEST,
      message: "تم جلب عملية الإنتاج بنجاح",
      data: process,
    });
  } catch (error) {
    logger.error("Get production process by id controller error", { error });
    next(error);
  }
};

/**
 * POST /production-process
 */
export const createProcess = async (req, res, next) => {
  try {
    const process = await createProductionProcess(
      req.body,
      req.user.id,
      req.user.role
    );

    res.status(201).json({
      success: SUCCESS_REQUEST,
      message: "تم إنشاء عملية الإنتاج بنجاح",
      data: process,
    });
  } catch (error) {
    logger.error("Create production process controller error", { error });
    next(error);
  }
};

/**
 * PUT /production-process/:id
 */
export const updateProcess = async (req, res, next) => {
  try {
    const process = await updateProductionProcess(
      parseInt(req.params.id),
      req.body,
      req.user.role
    );

    res.json({
      success: SUCCESS_REQUEST,
      message: "تم تحديث عملية الإنتاج بنجاح",
      data: process,
    });
  } catch (error) {
    logger.error("Update production process controller error", { error });
    next(error);
  }
};

/**
 * DELETE /production-process/:id
 */
export const deleteProcess = async (req, res, next) => {
  try {
    const result = await deleteProductionProcess(
      parseInt(req.params.id),
      req.user.role
    );

    res.json({
      success: SUCCESS_REQUEST,
      message: result.message,
      data: {},
    });
  } catch (error) {
    logger.error("Delete production process controller error", { error });
    next(error);
  }
};