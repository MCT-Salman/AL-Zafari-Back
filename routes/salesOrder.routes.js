import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
  getAllSalesOrders,
  getSalesOrderById,
  createSalesOrder,
  updateSalesOrder,
  deleteSalesOrder,
  getSalesOrderItemById,
  createSalesOrderItem,
  updateSalesOrderItemStatus,
  updateSalesOrderItem,
  deleteSalesOrderItem,
  deleteallSalesOrder

} from '../controllers/salesOrder.controller.js';

import {
  createSalesOrderRules,
  updateSalesOrderRules,
  SalesOrderIdParamRules,
  getSalesOrdersQueryRules,
  SalesOrderItemIdParamRules,
  createSalesOrderItemRules,
  updateSalesOrderItemRules,
  allSalesOrdersarrayRules

} from '../validators/salesOrder.validators.js';

const router = Router();

// Apply authentication to all routes
router.use(requireAuth);

// GET routes - accessible by all Sales-related roles
router.get("/", requireRole(["admin", "production_manager", "cashier", "sales", "accountant"]), validate(getSalesOrdersQueryRules), getAllSalesOrders);
router.get("/:id", requireRole(["admin", "production_manager", "cashier", "sales", "accountant"]), validate(SalesOrderIdParamRules), getSalesOrderById);
router.post("/", requireRole(["admin", "cashier", "sales"]), validate(createSalesOrderRules), createSalesOrder);
router.put("/:id", requireRole(["admin", "cashier", "sales"]), validate([...SalesOrderIdParamRules, ...updateSalesOrderRules]), updateSalesOrder);
router.delete("/all", requireRole(["admin", "cashier", "sales"]), validate(allSalesOrdersarrayRules), deleteallSalesOrder);
router.delete("/:id", requireRole(["admin", "cashier", "sales"]), validate(SalesOrderIdParamRules), deleteSalesOrder);


/**
 * Sales Order Item Routes
 */
router.get("/item/:id", requireRole(["admin", "production_manager", "cashier", "sales", "accountant"]), validate(SalesOrderItemIdParamRules), getSalesOrderItemById);
router.post("/:id/items", requireRole(["admin", "cashier", "sales", "accountant"]), validate([...SalesOrderIdParamRules, ...createSalesOrderItemRules]), createSalesOrderItem);
router.patch("/item/:id", requireRole(["admin", "production_manager", "cashier", "sales", "accountant"]), validate(SalesOrderItemIdParamRules), updateSalesOrderItemStatus);
router.put("/item/:id", requireRole(["admin", "cashier", "sales", "accountant"]), validate([...SalesOrderItemIdParamRules, ...updateSalesOrderItemRules]), updateSalesOrderItem);
router.delete("/item/:id", requireRole(["admin", "cashier", "sales", "accountant"]), validate(SalesOrderItemIdParamRules), deleteSalesOrderItem);

export default router;
