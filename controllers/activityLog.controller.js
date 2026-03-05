import * as ActivityLogService from "../services/activityLog.service.js";
import logger from "../utils/logger.js";
import { SUCCESS_REQUEST, FAILURE_REQUEST } from "../validators/messagesResponse.js";
import { SUCCESS_STATUS_CODE, BAD_REQUEST_STATUS_CODE } from "../validators/statusCode.js";

/**
 * جلب جميع سجلات النشاط مع فلترة
 */
export const getAllActivityLogs = async (req, res) => {
  try {
    // التحقق من الصلاحيات - فقط admin و warehouse_manager
    if (!['admin', 'warehouse_manager'].includes(req.user.role)) {
      return res.status(403).json({
        success: FAILURE_REQUEST,
        message: "غير مصرح لك بالوصول إلى سجلات النشاط",
        data: {}
      });
    }

    const filters = {
      userId: req.query.userId,
      action: req.query.action,
      module: req.query.module,
      entityId: req.query.entityId,
      startDate: req.query.startDate,
      endDate: req.query.endDate,
      skip: req.query.skip,
      take: req.query.take,
    };

    const result = await ActivityLogService.getAllActivityLogs(filters);

    res.status(SUCCESS_STATUS_CODE).json({
      success: SUCCESS_REQUEST,
      message: "تم جلب سجلات النشاط بنجاح",
      data: result
    });
  } catch (error) {
    logger.error('ActivityLog controller error', { 
      message: error?.message, 
      stack: error?.stack, 
      url: req.originalUrl, 
      method: req.method, 
      userId: req.user?.id 
    });

    res.status(error.statusCode || BAD_REQUEST_STATUS_CODE).json({
      success: FAILURE_REQUEST,
      message: error.message || "حدث خطأ أثناء جلب سجلات النشاط",
      data: {}
    });
  }
};

/**
 * جلب سجل نشاط واحد
 */
export const getActivityLogById = async (req, res) => {
  try {
    // التحقق من الصلاحيات
    if (!['admin', 'warehouse_manager'].includes(req.user.role)) {
      return res.status(403).json({
        success: FAILURE_REQUEST,
        message: "غير مصرح لك بالوصول إلى سجلات النشاط",
        data: {}
      });
    }

    const { id } = req.params;
    const log = await ActivityLogService.getActivityLogById(parseInt(id));

    res.status(SUCCESS_STATUS_CODE).json({
      success: SUCCESS_REQUEST,
      message: "تم جلب سجل النشاط بنجاح",
      data: log
    });
  } catch (error) {
    logger.error('ActivityLog controller error', { 
      message: error?.message, 
      stack: error?.stack, 
      url: req.originalUrl, 
      method: req.method, 
      userId: req.user?.id 
    });

    res.status(error.statusCode || BAD_REQUEST_STATUS_CODE).json({
      success: FAILURE_REQUEST,
      message: error.message || "حدث خطأ أثناء جلب سجل النشاط",
      data: {}
    });
  }
};

/**
 * جلب سجلات النشاط حسب المستخدم
 */
export const getActivityLogsByUserId = async (req, res) => {
  try {
    // التحقق من الصلاحيات
    if (!['admin', 'warehouse_manager'].includes(req.user.role)) {
      return res.status(403).json({
        success: FAILURE_REQUEST,
        message: "غير مصرح لك بالوصول إلى سجلات النشاط",
        data: {}
      });
    }

    const { userId } = req.params;
    const filters = {
      skip: req.query.skip,
      take: req.query.take,
    };

    const result = await ActivityLogService.getActivityLogsByUserId(parseInt(userId), filters);

    res.status(SUCCESS_STATUS_CODE).json({
      success: SUCCESS_REQUEST,
      message: "تم جلب سجلات النشاط بنجاح",
      data: result
    });
  } catch (error) {
    logger.error('ActivityLog controller error', { 
      message: error?.message, 
      stack: error?.stack, 
      url: req.originalUrl, 
      method: req.method, 
      userId: req.user?.id 
    });

    res.status(error.statusCode || BAD_REQUEST_STATUS_CODE).json({
      success: FAILURE_REQUEST,
      message: error.message || "حدث خطأ أثناء جلب سجلات النشاط",
      data: {}
    });
  }
};

/**
 * جلب سجلات النشاط حسب الوحدة
 */
export const getActivityLogsByModule = async (req, res) => {
  try {
    // التحقق من الصلاحيات
    if (!['admin', 'warehouse_manager'].includes(req.user.role)) {
      return res.status(403).json({
        success: FAILURE_REQUEST,
        message: "غير مصرح لك بالوصول إلى سجلات النشاط",
        data: {}
      });
    }

    const { module } = req.params;
    const filters = {
      skip: req.query.skip,
      take: req.query.take,
    };

    const result = await ActivityLogService.getActivityLogsByModule(module, filters);

    res.status(SUCCESS_STATUS_CODE).json({
      success: SUCCESS_REQUEST,
      message: "تم جلب سجلات النشاط بنجاح",
      data: result
    });
  } catch (error) {
    logger.error('ActivityLog controller error', { 
      message: error?.message, 
      stack: error?.stack, 
      url: req.originalUrl, 
      method: req.method, 
      userId: req.user?.id 
    });

    res.status(error.statusCode || BAD_REQUEST_STATUS_CODE).json({
      success: FAILURE_REQUEST,
      message: error.message || "حدث خطأ أثناء جلب سجلات النشاط",
      data: {}
    });
  }
};

