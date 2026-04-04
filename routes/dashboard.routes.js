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

router.get("/stats", requireRole(["admin", "accountant"]), dashboardController.getManagerStats);

router.get("/sales-stats", requireRole(["admin", "cashier", "branch_cashier"]), dashboardController.getSalesDashboardStats);

router.get("/production-stats", requireRole(["admin", "production_manager"]), dashboardController.getProductionDashboardStats);

router.get("/cashier-stats", requireRole(["admin", "sales"]), dashboardController.getCashierDashboardStats);

export default router;

