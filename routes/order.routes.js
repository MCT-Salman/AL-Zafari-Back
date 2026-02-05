import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  addOrderItem,
  updateOrderItem,
  deleteOrderItem,
  updateOrderStatus,
} from "../controllers/order.controller.js";

import {
  createOrderRules,
  updateOrderRules,
  orderIdParamRules,
  getOrdersQueryRules,
  addOrderItemRules,
  updateOrderItemRules,
  orderItemIdParamRules,
  updateOrderStatusRules,
} from "../validators/order.validators.js";

const router = Router();

// Apply authentication to all routes
router.use(requireAuth);

// GET routes - accessible by all authenticated users
router.get("/", requireRole(["admin", "sales", "accountant", "cashier"]), validate(getOrdersQueryRules), getAllOrders);
router.get("/:id", requireRole(["admin", "sales", "accountant", "cashier"]), validate(orderIdParamRules), getOrderById);

// POST, PUT, DELETE routes - admin, sales, and accountant
router.post("/", requireRole(["admin", "sales", "cashier"]), validate(createOrderRules), createOrder);
router.put("/:id", requireRole(["admin", "sales", "cashier"]), validate([...orderIdParamRules, ...updateOrderRules]), updateOrder);
router.delete("/:id", requireRole(["admin", "sales"]), validate(orderIdParamRules), deleteOrder);

// Order items management routes
router.post("/:id/items", requireRole(["admin", "sales", "cashier"]), validate([...orderIdParamRules, ...addOrderItemRules]), addOrderItem);
router.put("/:id/items/:itemId", requireRole(["admin", "sales", "cashier"]), validate([...orderIdParamRules, ...orderItemIdParamRules, ...updateOrderItemRules]), updateOrderItem);
router.delete("/:id/items/:itemId", requireRole(["admin", "sales", "cashier"]), validate([...orderIdParamRules, ...orderItemIdParamRules]), deleteOrderItem);

// Order status update route
router.patch("/:id/status", requireRole(["admin", "sales", "cashier"]), validate([...orderIdParamRules, ...updateOrderStatusRules]), updateOrderStatus);

export default router;

