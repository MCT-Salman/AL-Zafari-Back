import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
  getAllProductionOrders,
  getProductionOrderById,
  createProductionOrder,
  updateProductionOrder,
  deleteProductionOrder,
  getProductionOrderItemById,
  createProductionOrderItem,
  updateProductionOrderItemStatus,
  updateProductionOrderItem,
  deleteProductionOrderItem,
  getProductionOrderItemsByType,
  getAllProductionOrderItemsByType,


} from '../controllers/productionOrder.controller.js';

import {
  createProductionOrderRules,
  updateProductionOrderRules,
  productionOrderIdParamRules,
  getProductionOrdersQueryRules,
  productionOrderItemIdParamRules,
  createProductionOrderItemRules,
  productionOrderTypeParamRules,
  updatestatusProductionOrderRules

} from '../validators/productionOrder.validators.js';

const router = Router();

// Apply authentication to all routes
router.use(requireAuth);

// GET routes - accessible by all production-related roles
//router.get("/", requireRole(["admin", "production_manager", "sales", "accountant"]), validate(getProductionOrdersQueryRules), getAllProductionOrders);
router.get("/:id", requireRole(["admin", "production_manager", "accountant"]), validate(productionOrderIdParamRules), getProductionOrderById);
//router.post("/", requireRole(["admin", "sales"]), validate(createProductionOrderRules), createProductionOrder);
router.put("/:id", requireRole(["admin", "production_manager"]), validate([...productionOrderIdParamRules, ...updateProductionOrderRules]), updateProductionOrder);
router.delete("/:id", requireRole(["admin", "production_manager"]), validate(productionOrderIdParamRules), deleteProductionOrder);


/**
 * Production Order Item Routes
 */
router.get("/", requireRole(["admin", "production_manager", "Warehouse_Keeper", "Warehouse_Products", "Dissection_Technician", "Cutting_Technician", "Gluing_Technician", "accountant"]), validate(getProductionOrdersQueryRules), getAllProductionOrders);
router.get("/:id/items", requireRole(["admin", "production_manager", "Warehouse_Keeper", "warehouse_products", "Dissection_Technician", "Cutting_Technician", "Gluing_Technician"]), validate(productionOrderIdParamRules), getProductionOrderItemsByType);
router.get("/type/:type", requireRole(["admin", "production_manager", "Warehouse_Keeper", "Warehouse_products", "Dissection_Technician", "Cutting_Technician", "Gluing_Technician"]), validate(productionOrderTypeParamRules), getAllProductionOrderItemsByType);
router.post("/", requireRole(["admin", "production_manager"]), validate(createProductionOrderRules), createProductionOrder);
router.get("/item/:id", requireRole(["admin", "production_manager", "Warehouse_Keeper", "Warehouse_Products", "Dissection_Technician", "Cutting_Technician", "Gluing_Technician",]), validate(productionOrderItemIdParamRules), getProductionOrderItemById);
router.post("/:id/items", requireRole(["admin", "production_manager"]), validate([...productionOrderIdParamRules, ...createProductionOrderItemRules]), createProductionOrderItem);
router.patch("/item/:id", requireRole(["admin", "production_manager", "Warehouse_Keeper", "Warehouse_products", "Dissection_Technician", "Cutting_Technician", "Gluing_Technician"]), validate([...productionOrderItemIdParamRules, ...updatestatusProductionOrderRules]), updateProductionOrderItemStatus);
router.put("/item/:id", requireRole(["admin", "production_manager"]), validate([...productionOrderItemIdParamRules, ...updateProductionOrderRules]), updateProductionOrderItem);
router.delete("/item/:id", requireRole(["admin", "production_manager"]), validate(productionOrderItemIdParamRules), deleteProductionOrderItem);

export default router;
