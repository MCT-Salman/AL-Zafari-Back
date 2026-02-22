// controllers/constantValue.controller.js
import {
  getAllConstantValues as getAllConstantValuesService,
  getConstantValueById as getConstantValueByIdService,
  createConstantValue as createConstantValueService,
  updateConstantValue as updateConstantValueService,
  deleteConstantValue as deleteConstantValueService,
  getConstantValuesByMaterialId as getConstantValuesByMaterialIdService,
  getConstantValuesByType as getConstantValuesByTypeService
} from "../services/constantValue.service.js";
import { SUCCESS_REQUEST } from "../validators/messagesResponse.js";
import logger from "../utils/logger.js";

export const getAllConstantValues = async (req, res, next) => {
  try {
    const filters = {
      type: req.query.type,
      isDefault: req.query.isDefault,
      search: req.query.search,
    };

    const result = await getAllConstantValuesService(filters);

    res.json({
      success: SUCCESS_REQUEST,
      message: "تم جلب القيم الثابتة بنجاح",
      data: result.constantValues,
      total: result.total,
    });
  } catch (error) {
    logger.error('Get all constant values controller error', { message: error?.message, url: req.originalUrl });
    return next(error);
  }
};

export const getConstantValuesByTypeId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const constantValues = await getConstantValuesByTypeIdService(parseInt(id));

    res.json({
      success: SUCCESS_REQUEST,
      message: "تم جلب القيم الثابتة بنجاح",
      data: constantValues,
    });
  } catch (error) {
    logger.error('Get constant values by type id controller error', { message: error?.message, params: req.params });
    return next(error);
  }
};

export const getConstantValuesByMaterialId = async (req, res, next) => {
  try {
    const { material_id } = req.params;
    const filter = {
      type: req.query.type,
    };
    const constantValues = await getConstantValuesByMaterialIdService(parseInt(material_id),filter);

    res.json({
      success: SUCCESS_REQUEST,
      message: "تم جلب القيم الثابتة بنجاح",
      data: constantValues,
    });
  } catch (error) {
    logger.error('Get constant values by material id controller error', { message: error?.message, params: req.params });
    return next(error);
  }
};
export const getConstantValuesByType = async (req, res, next) => {
  try {
    const { type } = req.params;
    const constantValues = await getConstantValuesByTypeService(type);
    res.json({
      success: SUCCESS_REQUEST,
      message: "تم جلب القيم الثابتة بنجاح",
      data: constantValues,
    });
  } catch (error) {
    logger.error('Get constant values by type controller error', { message: error?.message, params: req.params });
    return next(error);
  }
}

export const getConstantValueById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const constantValue = await getConstantValueByIdService(parseInt(id));

    res.json({
      success: SUCCESS_REQUEST,
      message: "تم جلب القيمة الثابتة بنجاح",
      data: constantValue,
    });
  } catch (error) {
    logger.error('Get constant value by id controller error', { message: error?.message, params: req.params });
    return next(error);
  }
};

export const createConstantValue = async (req, res, next) => {
  try {
    const data = req.body;
    const constantValue = await createConstantValueService(data);

    res.status(201).json({
      success: SUCCESS_REQUEST,
      message: "تم إنشاء القيمة الثابتة بنجاح",
      data: constantValue,
    });
  } catch (error) {
    logger.error('Create constant value controller error', { message: error?.message, body: req.body });
    return next(error);
  }
};

export const updateConstantValue = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const constantValue = await updateConstantValueService(parseInt(id), data);

    res.json({
      success: SUCCESS_REQUEST,
      message: "تم تحديث القيمة الثابتة بنجاح",
      data: constantValue,
    });
  } catch (error) {
    logger.error('Update constant value controller error', { message: error?.message, params: req.params, body: req.body });
    return next(error);
  }
};

export const deleteConstantValue = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await deleteConstantValueService(parseInt(id));

    res.json({
      success: SUCCESS_REQUEST,
      message: result.message,
      data: {},
    });
  } catch (error) {
    logger.error('Delete constant value controller error', { message: error?.message, params: req.params });
    return next(error);
  }
};

