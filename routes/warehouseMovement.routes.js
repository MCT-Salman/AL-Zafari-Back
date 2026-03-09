import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  getAllWarehouseMovements,
  getWarehouseMovementById,
  createWarehouseMovement,
  updateWarehouseMovement,
  deleteWarehouseMovement,
  getWarehouseMovementsByProductionOrderItemId
} from "../controllers/warehouseMovement.controller.js";

import {
  createWarehouseMovementRules,
  updateWarehouseMovementRules,
  warehouseMovementIdParamRules,
  getWarehouseMovementsQueryRules,
  productionOrderItemIdParamRules,
} from "../validators/warehouseMovement.validators.js";

const router = Router();

router.use(requireAuth);

// GET /warehouse-movements
router.get("/", validate(getWarehouseMovementsQueryRules), getAllWarehouseMovements);

// GET /warehouse-movements/production-order-item/:id
router.get("/production-order-item/:id", validate(productionOrderItemIdParamRules), getWarehouseMovementsByProductionOrderItemId);

// GET /warehouse-movements/:id
router.get("/:id", validate(warehouseMovementIdParamRules), getWarehouseMovementById);

// POST /warehouse-movements
router.post("/", validate(createWarehouseMovementRules), createWarehouseMovement);

// PUT /warehouse-movements/:id
router.put("/:id", validate([...warehouseMovementIdParamRules, ...updateWarehouseMovementRules]), updateWarehouseMovement);

// DELETE /warehouse-movements/:id
router.delete("/:id", validate(warehouseMovementIdParamRules), deleteWarehouseMovement);

export default router;

