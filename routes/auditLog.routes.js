import express from "express";
import * as AuditLogController from "../controllers/auditLog.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";

const router = express.Router();


router.get("/", requireAuth, requireRole(["admin"]), AuditLogController.getAllAuditLogs);

router.get("/:id", requireAuth, requireRole(["admin"]), AuditLogController.getAuditLogById);

router.get("/actor/:actorId", requireAuth, requireRole(["admin"]), AuditLogController.getAuditLogsByActorId);

export default router;

