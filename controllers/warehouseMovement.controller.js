import {
  getAllWarehouseMovements as getAllWarehouseMovementsService,
  getWarehouseMovementById as getWarehouseMovementByIdService,
  createWarehouseMovement as createWarehouseMovementService,
  updateWarehouseMovement as updateWarehouseMovementService,
  deleteWarehouseMovement as deleteWarehouseMovementService,
  deleteallWarehouseMovement as deleteallWarehouseMovementService,
} from "../services/warehouseMovement.service.js";
import { SUCCESS_REQUEST } from "../validators/messagesResponse.js";
import logger from "../utils/logger.js";

/**
 * GET /warehouse-movements
 */
export const getAllWarehouseMovements = async (req, res, next) => {
  try {
    const data = await getAllWarehouseMovementsService(req.query);

    res.json({
      success: SUCCESS_REQUEST,
      message: "تم جلب حركات المخزن بنجاح",
      data,
    });
  } catch (error) {
    logger.error("Get warehouse movements controller error", { error });
    next(error);
  }
};

/**
 * GET /warehouse-movements/:id
 */
export const getWarehouseMovementById = async (req, res, next) => {
  try {
    const movement = await getWarehouseMovementByIdService(
      parseInt(req.params.id)
    );

    res.json({
      success: SUCCESS_REQUEST,
      message: "تم جلب حركة المخزن بنجاح",
      data: movement,
    });
  } catch (error) {
    logger.error("Get warehouse movement by id controller error", { error });
    next(error);
  }
};

/**
 * POST /warehouse-movements
 */
export const createWarehouseMovement = async (req, res, next) => {
  try {
    const movement = await createWarehouseMovementService(
      req.body,
      req.user.id,
      req
    );

    res.status(201).json({
      success: SUCCESS_REQUEST,
      message: "تم إنشاء حركة المخزن بنجاح",
      data: movement,
    });
  } catch (error) {
    logger.error("Create warehouse movement controller error", { error });
    next(error);
  }
};

/**
 * PUT /warehouse-movements/:id
 */
export const updateWarehouseMovement = async (req, res, next) => {
  try {
    const movement = await updateWarehouseMovementService(
      parseInt(req.params.id),
      req.body,
      req
    );

    res.json({
      success: SUCCESS_REQUEST,
      message: "تم تحديث حركة المخزن بنجاح",
      data: movement,
    });
  } catch (error) {
    logger.error("Update warehouse movement controller error", { error });
    next(error);
  }
};


/**
 * DELETE /warehouse-movements/:id
 */
export const deleteWarehouseMovement = async (req, res, next) => {
  try {
    const result = await deleteWarehouseMovementService(
      parseInt(req.params.id),
      req
    );

    res.json({
      success: SUCCESS_REQUEST,
      message: result.message,
      data: null,
    });
  } catch (error) {
    logger.error("Delete warehouse movement controller error", { error });
    next(error);
  }
};

export const deleteallWarehouseMovement = async (req, res, next) => {
  try {
    const result = await deleteallWarehouseMovementService(req.body.ids, req);
    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    logger.error("Error in deleteallWarehouseMovement controller", { error: error.message });
    next(error);
  }
};

