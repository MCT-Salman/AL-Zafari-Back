import express from "express";
import * as ActivityLogController from "../controllers/activityLog.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";

const router = express.Router();

router.get("/", requireAuth, requireRole(["admin"]), ActivityLogController.getAllActivityLogs);

router.get("/:id", requireAuth, requireRole(["admin"]), ActivityLogController.getActivityLogById);

router.get("/user/:userId", requireAuth, requireRole(["admin"]), ActivityLogController.getActivityLogsByUserId);

router.get("/module/:module", requireAuth, requireRole(["admin"]), ActivityLogController.getActivityLogsByModule);

export default router;

