// services/notification.service.js
import * as NotificationModel from "../models/notification.model.js";
import logger from "../utils/logger.js";

/**
 * إرسال إشعار لمستخدم واحد
 */
export const sendNotificationToUser = async (userId, notificationData, io) => {
  try {
    // حفظ الإشعار في قاعدة البيانات
    const notification = await NotificationModel.create({
      userId,
      title: notificationData.title,
      body: notificationData.body,
      type: notificationData.type || "GENERAL",
      data: notificationData.data || null,
      link: notificationData.link || null,
      imageUrl: notificationData.imageUrl || null,
    });

    // إرسال الإشعار عبر Socket.IO
    if (io) {
      io.to(`user:${userId}`).emit("notification", notification);
    }

    logger.info(`Notification sent to user ${userId}:`, notification.title);
    return notification;
  } catch (error) {
    logger.error("Error sending notification to user:", error);
    throw error;
  }
};

/**
 * إرسال إشعار لمستخدمين متعددين
 */
export const sendNotificationToUsers = async (userIds, notificationData, io) => {
  try {
    const notifications = userIds.map((userId) => ({
      userId,
      title: notificationData.title,
      body: notificationData.body,
      type: notificationData.type || "GENERAL",
      data: notificationData.data ? JSON.stringify(notificationData.data) : null,
      link: notificationData.link || null,
      imageUrl: notificationData.imageUrl || null,
    }));

    // حفظ الإشعارات في قاعدة البيانات
    await NotificationModel.createMany(notifications);

    // إرسال الإشعارات عبر Socket.IO
    if (io) {
      userIds.forEach((userId) => {
        io.to(`user:${userId}`).emit("notification", {
          ...notificationData,
          userId,
        });
      });
    }

    logger.info(`Notifications sent to ${userIds.length} users`);
    return { count: userIds.length };
  } catch (error) {
    logger.error("Error sending notifications to users:", error);
    throw error;
  }
};

/**
 * إرسال إشعار حسب الصلاحية
 */
export const sendNotificationByRole = async (roles, notificationData, io) => {
  try {
    const { UserModel } = await import("../models/index.js");
    
    // جلب جميع المستخدمين بالصلاحيات المحددة
    const users = await UserModel.findAll({
      where: {
        role: {
          in: roles,
        },
      },
    });

    const userIds = users.map((user) => user.id);

    if (userIds.length === 0) {
      logger.warn(`No users found with roles: ${roles.join(", ")}`);
      return { count: 0 };
    }

    // إرسال الإشعارات
    await sendNotificationToUsers(userIds, notificationData, io);

    // إرسال عبر Socket.IO للصلاحيات
    if (io) {
      roles.forEach((role) => {
        io.to(`role:${role}`).emit("notification", notificationData);
      });
    }

    logger.info(`Notifications sent to roles: ${roles.join(", ")}`);
    return { count: userIds.length };
  } catch (error) {
    logger.error("Error sending notifications by role:", error);
    throw error;
  }
};

/**
 * إرسال إشعار broadcast لجميع المستخدمين
 */
export const sendBroadcastNotification = async (notificationData, io) => {
  try {
    const { UserModel } = await import("../models/index.js");
    
    // جلب جميع المستخدمين
    const users = await UserModel.findAll({});
    const userIds = users.map((user) => user.id);

    // إرسال الإشعارات
    await sendNotificationToUsers(userIds, notificationData, io);

    // إرسال broadcast عبر Socket.IO
    if (io) {
      io.emit("notification", notificationData);
    }

    logger.info(`Broadcast notification sent to ${userIds.length} users`);
    return { count: userIds.length };
  } catch (error) {
    logger.error("Error sending broadcast notification:", error);
    throw error;
  }
};

/**
 * جلب إشعارات مستخدم
 */
export const getUserNotifications = async (userId, filters = {}) => {
  try {
    return await NotificationModel.findByUserId(userId, filters);
  } catch (error) {
    logger.error("Error getting user notifications:", error);
    throw error;
  }
};

