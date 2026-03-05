import * as AuditLogService from "../services/auditLog.service.js";
import logger from "../utils/logger.js";
import { SUCCESS_REQUEST, FAILURE_REQUEST } from "../validators/messagesResponse.js";
import { SUCCESS_STATUS_CODE, BAD_REQUEST_STATUS_CODE } from "../validators/statusCode.js";

/**
 * جلب جميع سجلات المراجعة مع فلترة
 */
export const getAllAuditLogs = async (req, res) => {
  try {
    // التحقق من الصلاحيات - فقط admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: FAILURE_REQUEST,
        message: "غير مصرح لك بالوصول إلى سجلات المراجعة",
        data: {}
      });
    }

    const filters = {
      actorId: req.query.actorId,
      action: req.query.action,
      resource: req.query.resource,
      startDate: req.query.startDate,
      endDate: req.query.endDate,
      skip: req.query.skip,
      take: req.query.take,
    };

    const result = await AuditLogService.getAllAuditLogs(filters);

    res.status(SUCCESS_STATUS_CODE).json({
      success: SUCCESS_REQUEST,
      message: "تم جلب سجلات المراجعة بنجاح",
      data: result
    });
  } catch (error) {
    logger.error('AuditLog controller error', { 
      message: error?.message, 
      stack: error?.stack, 
      url: req.originalUrl, 
      method: req.method, 
      userId: req.user?.id 
    });

    res.status(error.statusCode || BAD_REQUEST_STATUS_CODE).json({
      success: FAILURE_REQUEST,
      message: error.message || "حدث خطأ أثناء جلب سجلات المراجعة",
      data: {}
    });
  }
};

/**
 * جلب سجل مراجعة واحد
 */
export const getAuditLogById = async (req, res) => {
  try {
    // التحقق من الصلاحيات
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: FAILURE_REQUEST,
        message: "غير مصرح لك بالوصول إلى سجلات المراجعة",
        data: {}
      });
    }

    const { id } = req.params;
    const log = await AuditLogService.getAuditLogById(parseInt(id));

    res.status(SUCCESS_STATUS_CODE).json({
      success: SUCCESS_REQUEST,
      message: "تم جلب سجل المراجعة بنجاح",
      data: log
    });
  } catch (error) {
    logger.error('AuditLog controller error', { 
      message: error?.message, 
      stack: error?.stack, 
      url: req.originalUrl, 
      method: req.method, 
      userId: req.user?.id 
    });

    res.status(error.statusCode || BAD_REQUEST_STATUS_CODE).json({
      success: FAILURE_REQUEST,
      message: error.message || "حدث خطأ أثناء جلب سجل المراجعة",
      data: {}
    });
  }
};

/**
 * جلب سجلات المراجعة حسب المستخدم
 */
export const getAuditLogsByActorId = async (req, res) => {
  try {
    // التحقق من الصلاحيات
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: FAILURE_REQUEST,
        message: "غير مصرح لك بالوصول إلى سجلات المراجعة",
        data: {}
      });
    }

    const { actorId } = req.params;
    const filters = {
      skip: req.query.skip,
      take: req.query.take,
    };

    const result = await AuditLogService.getAuditLogsByActorId(parseInt(actorId), filters);

    res.status(SUCCESS_STATUS_CODE).json({
      success: SUCCESS_REQUEST,
      message: "تم جلب سجلات المراجعة بنجاح",
      data: result
    });
  } catch (error) {
    logger.error('AuditLog controller error', { 
      message: error?.message, 
      stack: error?.stack, 
      url: req.originalUrl, 
      method: req.method, 
      userId: req.user?.id 
    });

    res.status(error.statusCode || BAD_REQUEST_STATUS_CODE).json({
      success: FAILURE_REQUEST,
      message: error.message || "حدث خطأ أثناء جلب سجلات المراجعة",
      data: {}
    });
  }
};

