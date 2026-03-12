import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
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

router.get("/", validate(getSlitesQueryRules), getAllSlites);
router.get("/:id", validate(sliteIdParamRules), getSliteById);
router.post("/", validate(createSliteRules), createSlite);
router.put("/:id", validate([...sliteIdParamRules, ...updateSliteRules]), updateSlite);
router.delete("/all", validate(allSlitesarrayRules), deleteallSlite);
router.delete("/:id", validate(sliteIdParamRules), deleteSlite);

export default router;