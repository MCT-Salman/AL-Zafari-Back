// routes/notification.routes.js
import express from "express";
import * as notificationController from "../controllers/notification.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";

const router = express.Router();

// جميع المسارات تتطلب مصادقة
router.use(requireAuth);
router.get("/", requireRole(["admin"]), notificationController.getAllNotifications);
router.get("/my", requireRole(["admin", "cashier", "branch_cashier", "sales", "production_manager", "accountant", "Warehouse_Keeper", "Warehouse_Products", "Dissection_Technician", "Cutting_Technician", "Gluing_Technician"]), notificationController.getMyNotifications);
router.get("/unread-count", requireRole(["admin", "cashier", "branch_cashier", "sales", "production_manager", "accountant", "Warehouse_Keeper", "Warehouse_Products", "Dissection_Technician", "Cutting_Technician", "Gluing_Technician"]), notificationController.getUnreadCount);
router.put("/:id/read", requireRole(["admin", "cashier", "branch_cashier", "sales", "production_manager", "accountant", "Warehouse_Keeper", "Warehouse_Products", "Dissection_Technician", "Cutting_Technician", "Gluing_Technician"]), notificationController.markAsRead);
router.put("/mark-all-read", requireRole(["admin", "cashier", "branch_cashier", "sales", "production_manager", "accountant", "Warehouse_Keeper", "Warehouse_Products", "Dissection_Technician", "Cutting_Technician", "Gluing_Technician"]), notificationController.markAllAsRead);

export default router;

