// controllers/material.controller.js
import {
  getAllMaterials as getAllMaterialsService,
  getMaterialById as getMaterialByIdService,
  createMaterial as createMaterialService,
  updateMaterial as updateMaterialService,
  deleteMaterial as deleteMaterialService,
} from "../services/material.service.js";
import { SUCCESS_REQUEST } from "../validators/messagesResponse.js";
import logger from "../utils/logger.js";

export const getAllMaterials = async (req, res, next) => {
  try {
    const filters = {
      type: req.query.type,
      search: req.query.search,
    };

    const result = await getAllMaterialsService(filters);

    res.json({
      success: SUCCESS_REQUEST,
      message: "تم جلب المواد بنجاح",
      data: result.materials,
      total: result.total,
    });
  } catch (error) {
    logger.error('Get all materials controller error', { message: error?.message });
    return next(error);
  }
};

export const getMaterialById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const material = await getMaterialByIdService(parseInt(id));

    res.json({
      success: SUCCESS_REQUEST,
      message: "تم جلب المادة بنجاح",
      data: material,
    });
  } catch (error) {
    logger.error('Get material by id controller error', { message: error?.message });
    return next(error);
  }
};

export const createMaterial = async (req, res, next) => {
  try {
    const data = req.body;
    const material = await createMaterialService(data);

    res.status(201).json({
      success: SUCCESS_REQUEST,
      message: "تم إنشاء المادة بنجاح",
      data: material,
    });
  } catch (error) {
    logger.error('Create material controller error', { message: error?.message });
    return next(error);
  }
};

export const updateMaterial = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const material = await updateMaterialService(parseInt(id), data);

    res.json({
      success: SUCCESS_REQUEST,
      message: "تم تحديث المادة بنجاح",
      data: material,
    });
  } catch (error) {
    logger.error('Update material controller error', { message: error?.message });
    return next(error);
  }
};

export const deleteMaterial = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await deleteMaterialService(parseInt(id));

    res.json({
      success: SUCCESS_REQUEST,
      message: result.message,
      data: {},
    });
  } catch (error) {
    logger.error('Delete material controller error', { message: error?.message });
    return next(error);
  }
};

