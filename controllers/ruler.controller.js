// controllers/ruler.controller.js
import {
  getAllRulers as getAllRulersService,
  getRulersByMaterialId as getRulersByMaterialIdService,
  getRulerById as getRulerByIdService,
  createRuler as createRulerService,
  updateRuler as updateRulerService,
  deleteRuler as deleteRulerService,
} from "../services/ruler.service.js";
import { SUCCESS_REQUEST } from "../validators/messagesResponse.js";
import logger from "../utils/logger.js";

export const getAllRulers = async (req, res, next) => {
  try {
    const filters = {
      material_id: req.query.material_id
    };

    const result = await getAllRulersService(filters);

    res.json({
      success: SUCCESS_REQUEST,
      message: "تم جلب المساطر بنجاح",
      data: result.rulers,
      total: result.total,
    });
  } catch (error) {
    logger.error('Get all rulers controller error', { message: error?.message });
    return next(error);
  }
};

export const getRulersByMaterialId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const rulers = await getRulersByMaterialIdService(parseInt(id));

    res.json({
      success: SUCCESS_REQUEST,
      message: "تم جلب المساطر بنجاح",
      data: rulers,
    });
  } catch (error) {
    logger.error('Get rulers by material id controller error', { message: error?.message });
    return next(error);
  }
};

export const getRulerById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const ruler = await getRulerByIdService(parseInt(id));

    res.json({
      success: SUCCESS_REQUEST,
      message: "تم جلب المسطرة بنجاح",
      data: ruler,
    });
  } catch (error) {
    logger.error('Get ruler by id controller error', { message: error?.message });
    return next(error);
  }
};

export const createRuler = async (req, res, next) => {
  try {
    const data = req.body;
    const ruler = await createRulerService(data, req);

    res.status(201).json({
      success: SUCCESS_REQUEST,
      message: "تم إنشاء المسطرة بنجاح",
      data: ruler,
    });
  } catch (error) {
    logger.error('Create ruler controller error', { message: error?.message });
    return next(error);
  }
};

export const updateRuler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const ruler = await updateRulerService(parseInt(id), data, req);

    res.json({
      success: SUCCESS_REQUEST,
      message: "تم تحديث المسطرة بنجاح",
      data: ruler,
    });
  } catch (error) {
    logger.error('Update ruler controller error', { message: error?.message });
    return next(error);
  }
};

export const deleteRuler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await deleteRulerService(parseInt(id), req);

    res.json({
      success: SUCCESS_REQUEST,
      message: result.message,
      data: {},
    });
  } catch (error) {
    logger.error('Delete ruler controller error', { message: error?.message });
    return next(error);
  }
};

