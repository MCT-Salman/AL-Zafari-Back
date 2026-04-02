// routes/dashboard.routes.js
import express from "express";
import * as dashboardController from "../controllers/dashboard.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";

const router = express.Router();

/**
 * حماية جميع المسارات - يجب أن يكون المستخدم مدير أو مدير إنتاج
 */
router.use(requireAuth);
router.use(requireRole(["admin", "accountant"]));

/**
 * GET /api/dashboard/stats
 * إحصائيات شاملة للمدير
 */
router.get("/stats", dashboardController.getManagerStats);

/**
 * GET /api/dashboard/sales-stats
 * إحصائيات المبيعات (Sales Dashboard)
 */
router.get("/sales-stats", requireRole(["admin", "sales"]), dashboardController.getSalesDashboardStats);

export default router;

