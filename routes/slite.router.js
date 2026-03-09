import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  getAllSlites,
  getSlitesByProductionOrderItemId,
  getSliteById,
  createSlite,
  updateSlite,
  deleteSlite,
} from "../controllers/slite.controller.js";

import {
  createSliteRules,
  updateSliteRules,
  sliteIdParamRules,
  getSlitesQueryRules,
  productionOrderItemIdParamRules
} from "../validators/slite.validators.js";

const router = Router();

router.use(requireAuth);

// GET /slite
router.get("/", validate(getSlitesQueryRules), getAllSlites);

// GET /slite/production-order-item/:id
router.get("/production-order-item/:id", validate(productionOrderItemIdParamRules), getSlitesByProductionOrderItemId);

// GET /slite/:id
router.get("/:id", validate(sliteIdParamRules), getSliteById);

// POST /slite
router.post("/", validate(createSliteRules), createSlite);

// PUT /slite/:id
router.put("/:id", validate([...sliteIdParamRules, ...updateSliteRules]), updateSlite);

// DELETE /slite/:id
router.delete("/:id", validate(sliteIdParamRules), deleteSlite);

export default router;