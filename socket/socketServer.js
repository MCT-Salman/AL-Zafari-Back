// socket/socketServer.js
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import logger from "../utils/logger.js";

// تخزين المستخدمين المتصلين
const connectedUsers = new Map(); // userId -> Set of socketIds
const socketToUser = new Map(); // socketId -> userId

/**
 * إعداد Socket.IO Server
 */
export const initializeSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || "*",
      methods: ["GET", "POST"],
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  // Middleware للمصادقة
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(" ")[1];

      if (!token) {
        return next(new Error("Authentication error: No token provided"));
      }

      // التحقق من الـ token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      socket.userRole = decoded.role;
      socket.username = decoded.username;

      logger.info(`Socket authentication successful for user ${decoded.id}`);
      next();
    } catch (error) {
      logger.error("Socket authentication failed:", error);
      next(new Error("Authentication error: Invalid token"));
    }
  });

  // عند الاتصال
  io.on("connection", (socket) => {
    const userId = socket.userId;
    const userRole = socket.userRole;
    logger.info(`User ${userId} (${socket.userRole}) connected with socket ${socket.id}`);

    // إضافة المستخدم للقائمة
    if (!connectedUsers.has(userId)) {
      connectedUsers.set(userId, new Set());
    }
    connectedUsers.get(userId).add(socket.id);
    socketToUser.set(socket.id, userId);

    // الانضمام إلى غرفة المستخدم الخاصة
    socket.join(`user:${userId}`);

    // الانضمام إلى غرفة الصلاحية
    socket.join(`role:${userRole}`);

    // إرسال حالة الاتصال
    socket.emit("connected", {
      success: true,
      message: "تم الاتصال بنجاح",
      userId,
      socketId: socket.id,
    });

    // إرسال عدد الإشعارات غير المقروءة
    socket.on("get:unread:count", async () => {
      try {
        const { getUnreadCount } = await import("../models/notification.model.js");
        const count = await getUnreadCount(userId);
        socket.emit("unread:count", { count });
      } catch (error) {
        logger.error("Error getting unread count:", error);
      }
    });

    // تحديد إشعار كمقروء
    socket.on("mark:read", async (notificationId) => {
      try {
        const { markAsRead } = await import("../models/notification.model.js");
        await markAsRead(notificationId, userId);
        socket.emit("notification:read", { id: notificationId });
      } catch (error) {
        logger.error("Error marking notification as read:", error);
      }
    });

    // استقبال طلب جديد عبر السوكت
    socket.on("new:order", async (orderData) => {
      try {
        const { createOrder } = await import("../services/order.service.js");
        const { create: createNotification } = await import("../models/notification.model.js");
        const { UserModel } = await import("../models/index.js");
        
        // إنشاء طلب جديد
        const order = await createOrder(orderData, {
          user: { id: userId, role: userRole, username: socket.username }
        });
        
        // حفظ إشعار في قاعدة البيانات للمستخدم المرسل
        const senderNotification = await createNotification({
          userId: userId,
          title: "تم إنشاء طلبك بنجاح",
          body: `الطلب رقم ${order.order_number} تم إنشاؤه بنجاح`,
          type: "ORDER_NEW",
          data: {
            orderId: order.order_id,
            orderNumber: order.order_number,
            action: "created_by_self"
          },
          link: `/orders/${order.order_id}`,
          isRead: false
        });
        
        // إرسال تأكيد للمستخدم المرسل
        socket.emit("order:created", {
          success: true,
          message: "تم إنشاء الطلب بنجاح",
          order,
          notification: senderNotification
        });
        
        // جلب المستخدمين الآخرين للإشعار
        const otherUsers = await UserModel.findAll({
          where: {
            role: {
              in: ["admin", "cashier", "branch_cashier", "sales", "production_manager"]
            },
            id: {
              not: userId // لا إشعار للمرسل نفسه
            }
          }
        });
        
        // حفظ إشعارات للمستخدمين الآخرين في قاعدة البيانات
        const notifications = otherUsers.map(user => ({
          userId: user.id,
          title: "طلب جديد",
          body: `تم إنشاء طلب جديد رقم ${order.order_number} بواسطة ${socket.username}`,
          type: "ORDER_NEW",
          data: {
            orderId: order.order_id,
            orderNumber: order.order_number,
            createdBy: userId,
            creatorName: socket.username
          },
          link: `/orders/${order.order_id}`,
          isRead: false
        }));
        
        if (notifications.length > 0) {
          await createNotification({
            data: notifications
          });
        }
        
        // إشعار المستخدمين الآخرين عبر السوكت
        socket.broadcast.emit("order:notification", {
          type: "ORDER_CREATED",
          title: "طلب جديد",
          body: `تم إنشاء طلب جديد رقم ${order.order_number}`,
          data: order,
          createdBy: socket.username,
          notificationCount: notifications.length
        });
        
        // إرسال إشعارات حسب الصلاحية
        const roleNotifications = {
          "admin": "طلب جديد يحتاج موافقتك",
          "cashier": "طلب جديد للدفع",
          "branch_cashier": "طلب جديد للدفع",
          "sales": "طلب جديد للبيع",
          "production_manager": "طلب جديد للإنتاج"
        };
        
        Object.keys(roleNotifications).forEach(role => {
          socket.to(`role:${role}`).emit("role:notification", {
            type: "ORDER_NEW",
            title: "طلب جديد",
            body: roleNotifications[role],
            data: order,
            createdBy: socket.username,
            targetRole: role
          });
        });
        
        logger.info(`New order created via socket by user ${userId}:`, order.order_id);
        logger.info(`Created ${notifications.length + 1} notifications in database`);
        
      } catch (error) {
        logger.error("Error creating order via socket:", error);
        
        // حفظ إشعار الخطأ في قاعدة البيانات
        try {
          const { create: createNotification } = await import("../models/notification.model.js");
          await createNotification({
            userId: userId,
            title: "خطأ في إنشاء الطلب",
            body: error.message || "حدث خطأ غير متوقع أثناء إنشاء الطلب",
            type: "SYSTEM",
            data: {
              error: error.message,
              action: "order_creation_failed"
            },
            isRead: false
          });
        } catch (notificationError) {
          logger.error("Error creating error notification:", notificationError);
        }
        
        socket.emit("order:error", {
          success: false,
          message: error.message || "فشل في إنشاء الطلب"
        });
      }
    });

    // تحديد جميع الإشعارات كمقروءة
    socket.on("mark:all:read", async () => {
      try {
        const { markAllUserNotificationsAsRead } = await import("../models/notification.model.js");
        await markAllUserNotificationsAsRead(userId);
        socket.emit("all:notifications:read", { success: true });
      } catch (error) {
        logger.error("Error marking all notifications as read:", error);
      }
    });

    // عند قطع الاتصال
    socket.on("disconnect", () => {
      logger.info(`User ${userId} disconnected (socket ${socket.id})`);

      // إزالة المستخدم من القائمة
      if (connectedUsers.has(userId)) {
        connectedUsers.get(userId).delete(socket.id);
        if (connectedUsers.get(userId).size === 0) {
          connectedUsers.delete(userId);
        }
      }
      socketToUser.delete(socket.id);
    });

    // معالجة الأخطاء
    socket.on("error", (error) => {
      logger.error(`Socket error for user ${userId}:`, error);
    });
  });

  return io;
};

/**
 * الحصول على جميع المستخدمين المتصلين
 */
export const getConnectedUsers = () => {
  return Array.from(connectedUsers.keys());
};

/**
 * التحقق من اتصال مستخدم
 */
export const isUserConnected = (userId) => {
  return connectedUsers.has(userId);
};

/**
 * الحصول على عدد المستخدمين المتصلين
 */
export const getConnectedUsersCount = () => {
  return connectedUsers.size;
};

export { connectedUsers, socketToUser };

