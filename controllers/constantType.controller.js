// controllers/constantType.controller.js
import {
  getAllConstantTypes as getAllConstantTypesService,
  getConstantTypeById as getConstantTypeByIdService,
  createConstantType as createConstantTypeService,
  updateConstantType as updateConstantTypeService,
  deleteConstantType as deleteConstantTypeService,
} from "../services/constantType.service.js";
import { SUCCESS_REQUEST } from "../validators/messagesResponse.js";
import logger from "../utils/logger.js";

/**
 * جلب جميع الأنواع الثابتة
 * GET /constant-type
 */
export const getAllConstantTypes = async (req, res, next) => {
  try {
    const filters = {
      type: req.query.type,
      search: req.query.search,
    };

    const result = await getAllConstantTypesService(filters);

    res.json({
      success: SUCCESS_REQUEST,
      message: "تم جلب الأنواع الثابتة بنجاح",
      data: result.constantTypes,
      total: result.total,
    });
  } catch (error) {
    logger.error('Get all constant types controller error', {
      message: error?.message,
      stack: error?.stack,
      url: req.originalUrl,
      method: req.method,
      ip: req.ip,
    });
    return next(error);
  }
};

/**
 * جلب نوع ثابت حسب المعرف
 * GET /constant-type/:id
 */
export const getConstantTypeById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const constantType = await getConstantTypeByIdService(parseInt(id));

    res.json({
      success: SUCCESS_REQUEST,
      message: "تم جلب النوع الثابت بنجاح",
      data: constantType,
    });
  } catch (error) {
    logger.error('Get constant type by id controller error', {
      message: error?.message,
      stack: error?.stack,
      url: req.originalUrl,
      method: req.method,
      ip: req.ip,
      params: req.params,
    });
    return next(error);
  }
};

/**
 * إنشاء نوع ثابت جديد
 * POST /constant-type
 */
export const createConstantType = async (req, res, next) => {
  try {
    const data = req.body;
    const constantType = await createConstantTypeService(data);

    res.status(201).json({
      success: SUCCESS_REQUEST,
      message: "تم إنشاء النوع الثابت بنجاح",
      data: constantType,
    });
  } catch (error) {
    logger.error('Create constant type controller error', {
      message: error?.message,
      stack: error?.stack,
      url: req.originalUrl,
      method: req.method,
      ip: req.ip,
      body: req.body,
    });
    return next(error);
  }
};

/**
 * تحديث نوع ثابت
 * PUT /constant-type/:id
 */
export const updateConstantType = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const constantType = await updateConstantTypeService(parseInt(id), data);

    res.json({
      success: SUCCESS_REQUEST,
      message: "تم تحديث النوع الثابت بنجاح",
      data: constantType,
    });
  } catch (error) {
    logger.error('Update constant type controller error', {
      message: error?.message,
      stack: error?.stack,
      url: req.originalUrl,
      method: req.method,
      ip: req.ip,
      params: req.params,
      body: req.body,
    });
    return next(error);
  }
};

/**
 * حذف نوع ثابت
 * DELETE /constant-type/:id
 */
export const deleteConstantType = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await deleteConstantTypeService(parseInt(id));

    res.json({
      success: SUCCESS_REQUEST,
      message: result.message,
      data: {},
    });
  } catch (error) {
    logger.error('Delete constant type controller error', {
      message: error?.message,
      stack: error?.stack,
      url: req.originalUrl,
      method: req.method,
      ip: req.ip,
      params: req.params,
    });
    return next(error);
  }
};

