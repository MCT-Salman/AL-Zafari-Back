// routes/dashboard.routes.js
import express from "express";
import * as dashboardController from "../controllers/dashboard.controller.js";
import { materialIdParamRules } from '../validators/material.validators.js';
import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
const router = express.Router();

/**
 * حماية جميع المسارات - يجب أن يكون المستخدم مدير أو مدير إنتاج
 */
router.use(requireAuth);

router.get("/stats", requireRole(["admin", "accountant"]), dashboardController.getManagerStats);

router.get("/stats/material/:id", requireRole(["admin", "accountant"]), validate(materialIdParamRules), dashboardController.getColorByMaterial);

router.get("/sales-stats", requireRole(["admin", "sales"]), dashboardController.getSalesDashboardStats);

router.get("/production-stats", requireRole(["admin", "production_manager"]), dashboardController.getProductionDashboardStats);

router.get("/cashier-stats", requireRole(["admin", "cashier", "branch_cashier"]), dashboardController.getCashierDashboardStats);

export default router;

