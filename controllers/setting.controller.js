// controllers/setting.controller.js
import {
  getAllSettings as getAllSettingsService,
  getSettingById as getSettingByIdService,
  getSettingByKey as getSettingByKeyService,
  createSetting as createSettingService,
  updateSetting as updateSettingService,
  updateSettingByKey as updateSettingByKeyService,
  deleteSetting as deleteSettingService,
  upsertSetting as upsertSettingService,
} from "../services/setting.service.js";
import { SUCCESS_REQUEST } from "../validators/messagesResponse.js";
import logger from "../utils/logger.js";

export const getAllSettings = async (req, res, next) => {
  try {
    const filters = {
      search: req.query.search,
    };

    const result = await getAllSettingsService(filters);

    res.json({
      success: SUCCESS_REQUEST,
      message: "تم جلب الإعدادات بنجاح",
      data: result.settings,
      total: result.total,
    });
  } catch (error) {
    logger.error("Get all settings controller error", {
      message: error?.message,
    });
    return next(error);
  }
};

export const getSettingById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const setting = await getSettingByIdService(parseInt(id));

    res.json({
      success: SUCCESS_REQUEST,
      message: "تم جلب الإعداد بنجاح",
      data: setting,
    });
  } catch (error) {
    logger.error("Get setting by id controller error", {
      message: error?.message,
    });
    return next(error);
  }
};

export const getSettingByKey = async (req, res, next) => {
  try {
    const { key } = req.params;
    const setting = await getSettingByKeyService(key);

    res.json({
      success: SUCCESS_REQUEST,
      message: "تم جلب الإعداد بنجاح",
      data: setting,
    });
  } catch (error) {
    logger.error("Get setting by key controller error", {
      message: error?.message,
    });
    return next(error);
  }
};

export const createSetting = async (req, res, next) => {
  try {
    const data = req.body;
    const setting = await createSettingService(data);

    res.status(201).json({
      success: SUCCESS_REQUEST,
      message: "تم إنشاء الإعداد بنجاح",
      data: setting,
    });
  } catch (error) {
    logger.error("Create setting controller error", {
      message: error?.message,
    });
    return next(error);
  }
};

export const updateSetting = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const setting = await updateSettingService(parseInt(id), data);

    res.json({
      success: SUCCESS_REQUEST,
      message: "تم تحديث الإعداد بنجاح",
      data: setting,
    });
  } catch (error) {
    logger.error("Update setting controller error", {
      message: error?.message,
    });
    return next(error);
  }
};

export const updateSettingByKey = async (req, res, next) => {
  try {
    const { key } = req.params;
    const data = req.body;
    const setting = await updateSettingByKeyService(key, data);

    res.json({
      success: SUCCESS_REQUEST,
      message: "تم تحديث الإعداد بنجاح",
      data: setting,
    });
  } catch (error) {
    logger.error("Update setting by key controller error", {
      message: error?.message,
    });
    return next(error);
  }
};

export const deleteSetting = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await deleteSettingService(parseInt(id));

    res.json({
      success: SUCCESS_REQUEST,
      message: result.message,
      data: {},
    });
  } catch (error) {
    logger.error("Delete setting controller error", {
      message: error?.message,
    });
    return next(error);
  }
};

export const upsertSetting = async (req, res, next) => {
  try {
    const { key } = req.params;
    const data = req.body;
    const setting = await upsertSettingService(key, data);

    res.json({
      success: SUCCESS_REQUEST,
      message: "تم حفظ الإعداد بنجاح",
      data: setting,
    });
  } catch (error) {
    logger.error("Upsert setting controller error", {
      message: error?.message,
    });
    return next(error);
  }
};

