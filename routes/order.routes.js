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
} from "../controllers/order.controller.js";

import {
  createOrderRules,
  updateOrderRules,
  orderIdParamRules,
  getOrdersQueryRules,
} from "../validators/order.validators.js";

const router = Router();

// Apply authentication to all routes
router.use(requireAuth);

// GET routes - accessible by all authenticated users
router.get("/", validate(getOrdersQueryRules), getAllOrders);
router.get("/:id", validate(orderIdParamRules), getOrderById);

// POST, PUT, DELETE routes - admin, sales, and accountant
router.post("/", requireRole(["admin", "sales"]), validate(createOrderRules), createOrder);
router.put("/:id", requireRole(["admin", "sales", "accountant"]), validate([...orderIdParamRules, ...updateOrderRules]), updateOrder);
router.delete("/:id", requireRole(["admin"]), validate(orderIdParamRules), deleteOrder);

export default router;

