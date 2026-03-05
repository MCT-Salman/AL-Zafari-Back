import express from "express";
import * as LoginAttemptController from "../controllers/loginAttempt.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", requireAuth, requireRole(["admin"]), LoginAttemptController.getAllLoginAttempts);

router.get("/stats", requireAuth, requireRole(["admin"]), LoginAttemptController.getLoginAttemptsStats);

router.get("/failed", requireAuth, requireRole(["admin"]), LoginAttemptController.getFailedLoginAttempts);

router.get("/user/:userId", requireAuth, requireRole(["admin"]), LoginAttemptController.getLoginAttemptsByUserId);

export default router;

