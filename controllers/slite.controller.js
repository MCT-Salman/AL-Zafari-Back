import {
  getAllSlites as getAllSlitesService,
  getSlitesByProductionOrderItemId as getSlitesByProductionOrderItemIdService,
  getSliteById as getSliteByIdService,
  createSlite as createSliteService,
  updateSlite as updateSliteService,
  deleteSlite as deleteSliteService,
} from "../services/slite.service.js";
import { SUCCESS_REQUEST } from "../validators/messagesResponse.js";
import logger from "../utils/logger.js";

/**
 * GET /slites
 */
export const getAllSlites = async (req, res, next) => {
  try {
    const data = await getAllSlitesService(req.query);

    res.json({
      success: SUCCESS_REQUEST,
      message: "تم جلب عمليات التشريح بنجاح",
      data,
    });
  } catch (error) {
    logger.error("Get slites controller error", { error });
    next(error);
  }
};

export const getSlitesByProductionOrderItemId = async (req, res, next) => {
  try {
    const slites = await getSlitesByProductionOrderItemIdService(parseInt(req.params.id));

    res.json({
      success: SUCCESS_REQUEST,
      message: "تم جلب عمليات التشريح بنجاح",
      data: slites,
    });
  } catch (error) {
    logger.error("Get slites by production order item id controller error", { error });
    next(error);
  }
};

/**
 * GET /slites/:id
 */
export const getSliteById = async (req, res, next) => {
  try {
    const slite = await getSliteByIdService(parseInt(req.params.id));

    res.json({
      success: SUCCESS_REQUEST,
      message: "تم جلب عملية التشريح بنجاح",
      data: slite,
    });
  } catch (error) {
    logger.error("Get slite by id controller error", { error });
    next(error);
  }
};

/**
 * POST /slites
 */
export const createSlite = async (req, res, next) => {
  try {
    const slite = await createSliteService(req.body, req.user.id , req);

    res.status(201).json({
      success: SUCCESS_REQUEST,
      message: "تم إنشاء عملية التشريح بنجاح",
      data: slite,
    });
  } catch (error) {
    logger.error("Create slite controller error", { error });
    next(error);
  }
};

/**
 * PUT /slites/:id
 */
export const updateSlite = async (req, res, next) => {
  try {
    const slite = await updateSliteService(parseInt(req.params.id), req.body , req);

    res.json({
      success: SUCCESS_REQUEST,
      message: "تم تحديث عملية التشريح بنجاح",
      data: slite,
    });
  } catch (error) {
    logger.error("Update slite controller error", { error });
    next(error);
  }
};

/**
 * DELETE /slites/:id
 */
export const deleteSlite = async (req, res, next) => {
  try {
    const result = await deleteSliteService(parseInt(req.params.id) , req);

    res.json({
      success: SUCCESS_REQUEST,
      message: result.message,
      data: null,
    });
  } catch (error) {
    logger.error("Delete slite controller error", { error });
    next(error);
  }
};