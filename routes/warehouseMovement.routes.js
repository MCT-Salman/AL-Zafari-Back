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

router.get("/", requireRole(["admin", "production_manager", "accountant", "Warehouse_Keeper", "Warehouse_products"]), validate(getWarehouseMovementsQueryRules), getAllWarehouseMovements);
router.get("/:id", requireRole(["admin", "production_manager", "accountant", "Warehouse_Keeper", "Warehouse_products"]), validate(warehouseMovementIdParamRules), getWarehouseMovementById);
router.post("/", requireRole(["admin", "production_manager", "Warehouse_Keeper" , "Warehouse_products"]), validate(createWarehouseMovementRules), createWarehouseMovement);
router.put("/:id", requireRole(["admin", "production_manager", "Warehouse_Keeper" , "Warehouse_products"]), validate([...warehouseMovementIdParamRules, ...updateWarehouseMovementRules]), updateWarehouseMovement);
router.delete("/all", requireRole(["admin", "production_manager"]), validate(allWarehouseMovementsarrayRules), deleteallWarehouseMovement);
router.delete("/:id", requireRole(["admin", "production_manager" , "Warehouse_Keeper" , "Warehouse_products"]), validate(warehouseMovementIdParamRules), deleteWarehouseMovement);

export default router;

