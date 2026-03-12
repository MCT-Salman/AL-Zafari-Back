import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  getAllWarehouseMovements,
  getWarehouseMovementById,
  createWarehouseMovement,
  updateWarehouseMovement,
  deleteWarehouseMovement,
  deleteallWarehouseMovement
} from "../controllers/warehouseMovement.controller.js";

import {
  createWarehouseMovementRules,
  updateWarehouseMovementRules,
  warehouseMovementIdParamRules,
  getWarehouseMovementsQueryRules,
  allWarehouseMovementsarrayRules
} from "../validators/warehouseMovement.validators.js";

const router = Router();

router.use(requireAuth);

router.get("/", validate(getWarehouseMovementsQueryRules), getAllWarehouseMovements);
router.get("/:id", validate(warehouseMovementIdParamRules), getWarehouseMovementById);
router.post("/", validate(createWarehouseMovementRules), createWarehouseMovement);
router.put("/:id", validate([...warehouseMovementIdParamRules, ...updateWarehouseMovementRules]), updateWarehouseMovement);
router.delete("/all", validate(allWarehouseMovementsarrayRules), deleteallWarehouseMovement);
router.delete("/:id", validate(warehouseMovementIdParamRules), deleteWarehouseMovement);

export default router;

