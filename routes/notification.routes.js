// routes/notification.routes.js
import express from "express";
import * as notificationController from "../controllers/notification.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";

const router = express.Router();

// جميع المسارات تتطلب مصادقة
router.use(requireAuth);
router.get("/", requireRole(["admin"]), notificationController.getAllNotifications);
router.get("/my", notificationController.getMyNotifications);
router.get("/unread-count", notificationController.getUnreadCount);
router.put("/:id/read", notificationController.markAsRead);
router.put("/mark-all-read", notificationController.markAllAsRead);

export default router;

