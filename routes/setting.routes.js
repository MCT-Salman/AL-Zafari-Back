import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  getAllSettings,
  getSettingById,
  getSettingByKey,
  createSetting,
  updateSetting,
  updateSettingByKey,
  deleteSetting,
  upsertSetting,
} from "../controllers/setting.controller.js";

import {
  createSettingRules,
  updateSettingRules,
  upsertSettingRules,
  settingIdParamRules,
  settingKeyParamRules,
  getSettingsQueryRules,
} from "../validators/setting.validators.js";

const router = Router();

// Apply authentication to all routes
router.use(requireAuth);

// GET routes - accessible by all authenticated users
router.get("/", validate(getSettingsQueryRules), getAllSettings);
router.get("/id/:id", validate(settingIdParamRules), getSettingById);
router.get("/key/:key", validate(settingKeyParamRules), getSettingByKey);

// POST, PUT, DELETE routes - admin only
router.post(
  "/",
  requireRole(["admin"]),
  validate(createSettingRules),
  createSetting
);
router.put(
  "/id/:id",
  requireRole(["admin"]),
  validate([...settingIdParamRules, ...updateSettingRules]),
  updateSetting
);
router.put(
  "/key/:key",
  requireRole(["admin"]),
  validate([...settingKeyParamRules, ...updateSettingRules]),
  updateSettingByKey
);
router.delete(
  "/id/:id",
  requireRole(["admin"]),
  validate(settingIdParamRules),
  deleteSetting
);

// Upsert route - admin only
router.post(
  "/upsert/:key",
  requireRole(["admin"]),
  validate([...settingKeyParamRules, ...upsertSettingRules]),
  upsertSetting
);

export default router;

