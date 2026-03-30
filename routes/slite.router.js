import { Router } from "express";
import { requireAuth , requireRole } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  getAllSlites,
  getSliteById,
  createSlite,
  updateSlite,
  deleteSlite,
  deleteallSlite
} from "../controllers/slite.controller.js";

import {
  createSliteRules,
  updateSliteRules,
  sliteIdParamRules,
  getSlitesQueryRules,
  allSlitesarrayRules
} from "../validators/slite.validators.js";

const router = Router();

router.use(requireAuth);

router.get("/", requireRole(["admin", "production_manager", "accountant", "Dissection_Technician"]), validate(getSlitesQueryRules), getAllSlites);
router.get("/:id", requireRole(["admin", "production_manager", "accountant", "Dissection_Technician"]), validate(sliteIdParamRules), getSliteById);
router.post("/", requireRole(["admin", "production_manager", "Dissection_Technician"]), validate(createSliteRules), createSlite);
router.put("/:id", requireRole(["admin", "production_manager", "Dissection_Technician"]), validate([...sliteIdParamRules, ...updateSliteRules]), updateSlite);
router.delete("/all", requireRole(["admin", "production_manager"]), validate(allSlitesarrayRules), deleteallSlite);
router.delete("/:id", requireRole(["admin", "production_manager", "Dissection_Technician"]), validate(sliteIdParamRules), deleteSlite);

export default router;