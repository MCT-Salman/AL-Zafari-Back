import express from "express";
import {
  getPriceMaterial,
  getAllInvoices,
  getInvoiceById,
  getInvoicesByCustomerId,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  addPayment,
  deleteallInvoice
}  from "../controllers/invoice.controller.js";
import {
  getPriceMaterialRules,
  getInvoicesQueryRules,
  createInvoiceRules,
  updateInvoiceRules,
  invoiceIdParamRules,
  addPaymentRules,
  customerIdParamRules,
  orderIdParamRules,
  allInvoicesarrayRules
} from "../validators/invoice.validators.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";

const router = express.Router();

// جميع الـ routes تتطلب authentication
router.use(requireAuth);

// GET routes - accessible by all authenticated users
router.post("/price-material", requireRole(["admin", "accountant", "sales", "cashier", "branch_cashier"]),validate(getPriceMaterialRules), getPriceMaterial);
router.get("/", requireRole(["admin", "accountant", "sales", "cashier", "branch_cashier"]),validate( getInvoicesQueryRules), getAllInvoices);
router.get("/:id", requireRole(["admin", "accountant", "sales", "cashier", "branch_cashier"]), validate(invoiceIdParamRules), getInvoiceById);
router.get("/customer/:id", requireRole(["admin", "accountant", "sales", "cashier", "branch_cashier"]), validate(customerIdParamRules), getInvoicesByCustomerId);
router.post("/", requireRole(["admin", "cashier", "branch_cashier", "accountant"]), validate(createInvoiceRules), createInvoice);
router.put("/:id", requireRole(["admin", "cashier", "branch_cashier", "accountant"]), validate([...invoiceIdParamRules, ...updateInvoiceRules ]),  updateInvoice);
router.delete("/all", requireRole(["admin", "cashier", "branch_cashier", "accountant"]), validate(allInvoicesarrayRules), deleteallInvoice);
router.delete("/:id", requireRole(["admin", "cashier", "branch_cashier", "accountant"]), validate(invoiceIdParamRules), deleteInvoice);
router.post("/:id/payment", requireRole(["admin", "cashier", "branch_cashier", "accountant"]), validate([...invoiceIdParamRules, ...addPaymentRules ]), addPayment);

export default router;

