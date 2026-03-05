// controllers/notification.controller.js
import * as NotificationModel from "../models/notification.model.js";
import logger from "../utils/logger.js";

/**
 * جلب جميع الإشعارات (للمدراء فقط)
 */
export const getAllNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 20, type, isRead } = req.query;

    const filters = {
      page: parseInt(page),
      limit: parseInt(limit),
    };

    if (type) filters.type = type;
    if (isRead !== undefined) filters.isRead = isRead === "true";

    const result = await NotificationModel.findAll(filters);

    res.status(200).json({
      success: true,
      message: "تم جلب الإشعارات بنجاح",
      data: result,
    });
  } catch (error) {
    logger.error("Error getting all notifications:", error);
    res.status(500).json({
      success: false,
      message: "حدث خطأ أثناء جلب الإشعارات",
      error: error.message,
    });
  }
};

/**
 * جلب إشعارات المستخدم الحالي
 */
export const getMyNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20, type, isRead } = req.query;

    const filters = {
      page: parseInt(page),
      limit: parseInt(limit),
    };

    if (type) filters.type = type;
    if (isRead !== undefined) filters.isRead = isRead === "true";

    const result = await NotificationModel.findByUserId(userId, filters);

    res.status(200).json({
      success: true,
      message: "تم جلب الإشعارات بنجاح",
      data: result,
    });
  } catch (error) {
    logger.error("Error getting user notifications:", error);
    res.status(500).json({
      success: false,
      message: "حدث خطأ أثناء جلب الإشعارات",
      error: error.message,
    });
  }
};

/**
 * جلب عدد الإشعارات غير المقروءة
 */
export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;
    const count = await NotificationModel.getUnreadCount(userId);

    res.status(200).json({
      success: true,
      message: "تم جلب عدد الإشعارات غير المقروءة بنجاح",
      data: { count },
    });
  } catch (error) {
    logger.error("Error getting unread count:", error);
    res.status(500).json({
      success: false,
      message: "حدث خطأ أثناء جلب عدد الإشعارات",
      error: error.message,
    });
  }
};

/**
 * تحديد إشعار كمقروء
 */
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // التحقق من أن الإشعار يخص المستخدم
    const notification = await NotificationModel.findById(parseInt(id));

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "الإشعار غير موجود",
      });
    }

    if (notification.userId !== userId && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "غير مصرح لك بتحديث هذا الإشعار",
      });
    }

    await NotificationModel.markAsRead(parseInt(id));

    res.status(200).json({
      success: true,
      message: "تم تحديد الإشعار كمقروء بنجاح",
    });
  } catch (error) {
    logger.error("Error marking notification as read:", error);
    res.status(500).json({
      success: false,
      message: "حدث خطأ أثناء تحديث الإشعار",
      error: error.message,
    });
  }
};

/**
 * تحديد جميع إشعارات المستخدم كمقروءة
 */
export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;

    await NotificationModel.markAllUserNotificationsAsRead(userId);

    res.status(200).json({
      success: true,
      message: "تم تحديد جميع الإشعارات كمقروءة بنجاح",
    });
  } catch (error) {
    logger.error("Error marking all notifications as read:", error);
    res.status(500).json({
      success: false,
      message: "حدث خطأ أثناء تحديث الإشعارات",
      error: error.message,
    });
  }
};

