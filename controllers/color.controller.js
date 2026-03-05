// controllers/color.controller.js
import { deleteFile } from "../utils/deleteFile.js";


import {
  getAllColors as getAllColorsService,
  getColorsByRulerId as getColorsByRulerIdService,
  getColorById as getColorByIdService,
  createColor as createColorService,
  updateColor as updateColorService,
  deleteColor as deleteColorService,
} from "../services/color.service.js";
import { SUCCESS_REQUEST } from "../validators/messagesResponse.js";
import logger from "../utils/logger.js";

export const getAllColors = async (req, res, next) => {
  try {
    const filters = {
      ruler_id: req.query.ruler_id,
      search: req.query.search,
    };

    const result = await getAllColorsService(filters);

    res.json({
      success: SUCCESS_REQUEST,
      message: "تم جلب الألوان بنجاح",
      data: result.colors,
      total: result.total,
    });
  } catch (error) {
    logger.error('Get all colors controller error', { message: error?.message });
    return next(error);
  }
};

export const getColorsByRulerId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const colors = await getColorsByRulerIdService(parseInt(id));

    res.json({
      success: SUCCESS_REQUEST,
      message: "تم جلب الألوان بنجاح",
      data: colors,
    });
  } catch (error) {
    logger.error('Get colors by ruler id controller error', { message: error?.message });
    return next(error);
  }
};

export const getColorById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const color = await getColorByIdService(parseInt(id));

    res.json({
      success: SUCCESS_REQUEST,
      message: "تم جلب اللون بنجاح",
      data: color,
    });
  } catch (error) {
    logger.error('Get color by id controller error', { message: error?.message });
    return next(error);
  }
};

export const createColor = async (req, res, next) => {
  try {
    const data = req.body;
    const imageUrl = req.file
      ? `/uploads/images/colors/${req.file.filename}`
      : undefined;
    data.imageUrl = imageUrl;
    const color = await createColorService(data, req);

    res.status(201).json({
      success: SUCCESS_REQUEST,
      message: "تم إنشاء اللون بنجاح",
      data: color,
    });
  } catch (error) {
    logger.error('Create color controller error', { message: error?.message });
    return next(error);
  }
};

export const updateColor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const oldcolor = await getColorByIdService(parseInt(id), req);
    if (req.file) {
      if (oldcolor.imageUrl) {
        deleteFile(oldcolor.imageUrl);
      }
      data.imageUrl = `/uploads/images/colors/${req.file.filename}`;
    }
    const color = await updateColorService(parseInt(id), data);

    res.json({
      success: SUCCESS_REQUEST,
      message: "تم تحديث اللون بنجاح",
      data: color,
    });
  } catch (error) {
    logger.error('Update color controller error', { message: error?.message });
    return next(error);
  }
};

export const deleteColor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await deleteColorService(parseInt(id), req);

    res.json({
      success: SUCCESS_REQUEST,
      message: result.message,
      data: {},
    });
  } catch (error) {
    logger.error('Delete color controller error', { message: error?.message });
    return next(error);
  }
};

