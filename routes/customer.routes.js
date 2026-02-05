import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "../controllers/customer.controller.js";

import {
  createCustomerRules,
  updateCustomerRules,
  customerIdParamRules,
  getCustomersQueryRules,
} from "../validators/customer.validators.js";

const router = Router();

// Apply authentication to all routes
router.use(requireAuth);

// GET routes - accessible by all authenticated users
router.get("/", validate(getCustomersQueryRules), getAllCustomers);
router.get("/:id", validate(customerIdParamRules), getCustomerById);

// POST, PUT, DELETE routes - admin and sales only
router.post(
  "/",
  requireRole(["admin", "sales"]),
  validate(createCustomerRules),
  createCustomer
);
router.put(
  "/:id",
  requireRole(["admin", "sales"]),
  validate([...customerIdParamRules, ...updateCustomerRules]),
  updateCustomer
);
router.delete(
  "/:id",
  requireRole(["admin"]),
  validate(customerIdParamRules),
  deleteCustomer
);

export default router;

