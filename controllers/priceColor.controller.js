// controllers/priceColor.controller.js
import {
  getAllPriceColors as getAllPriceColorsService,
  getPriceColorById as getPriceColorByIdService,
  createPriceColor as createPriceColorService,
  updatePriceColor as updatePriceColorService,
  deletePriceColor as deletePriceColorService,
} from "../services/priceColor.service.js";
import { SUCCESS_REQUEST } from "../validators/messagesResponse.js";
import logger from "../utils/logger.js";

export const getAllPriceColors = async (req, res, next) => {
  try {
    const filters = {
      color_id: req.query.color_id,
      constant_value_id: req.query.constant_value_id,
      price_color_By: req.query.price_color_By,
    };

    const result = await getAllPriceColorsService(filters);

    res.json({
      success: SUCCESS_REQUEST,
      message: "تم جلب أسعار الألوان بنجاح",
      data: result.priceColors,
      total: result.total,
    });
  } catch (error) {
    logger.error('Get all price colors controller error', { message: error?.message });
    return next(error);
  }
};

export const getPriceColorById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const priceColor = await getPriceColorByIdService(parseInt(id));

    res.json({
      success: SUCCESS_REQUEST,
      message: "تم جلب سعر اللون بنجاح",
      data: priceColor,
    });
  } catch (error) {
    logger.error('Get price color by id controller error', { message: error?.message });
    return next(error);
  }
};

export const createPriceColor = async (req, res, next) => {
  try {
    const data = req.body;
    const priceColor = await createPriceColorService(data);

    res.status(201).json({
      success: SUCCESS_REQUEST,
      message: "تم إنشاء سعر اللون بنجاح",
      data: priceColor,
    });
  } catch (error) {
    logger.error('Create price color controller error', { message: error?.message });
    return next(error);
  }
};

export const updatePriceColor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const priceColor = await updatePriceColorService(parseInt(id), data);

    res.json({
      success: SUCCESS_REQUEST,
      message: "تم تحديث سعر اللون بنجاح",
      data: priceColor,
    });
  } catch (error) {
    logger.error('Update price color controller error', { message: error?.message });
    return next(error);
  }
};

export const deletePriceColor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await deletePriceColorService(parseInt(id));

    res.json({
      success: SUCCESS_REQUEST,
      message: result.message,
      data: {},
    });
  } catch (error) {
    logger.error('Delete price color controller error', { message: error?.message });
    return next(error);
  }
};

