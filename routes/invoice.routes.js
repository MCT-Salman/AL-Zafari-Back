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
} from "../validators/invoice.validators.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";

const router = express.Router();

// جميع الـ routes تتطلب authentication
router.use(requireAuth);

// GET routes - accessible by all authenticated users
router.post("/price-material", requireRole(["admin", "accountant", "sales", "cashier"]),validate(getPriceMaterialRules), getPriceMaterial);
router.get("/", requireRole(["admin", "accountant", "sales", "cashier"]),validate( getInvoicesQueryRules), getAllInvoices);
router.get("/:id", requireRole(["admin", "accountant", "sales", "cashier"]), validate(invoiceIdParamRules), getInvoiceById);
router.get("/customer/:id", requireRole(["admin", "accountant", "sales", "cashier"]), validate(customerIdParamRules), getInvoicesByCustomerId);
router.post("/", requireRole(["admin", "sales", "accountant"]), validate(createInvoiceRules), createInvoice);
router.put("/:id", requireRole(["admin", "sales", "accountant"]), validate([...invoiceIdParamRules, ...updateInvoiceRules ]),  updateInvoice);
router.delete("/:id", requireRole(["admin", "sales", "accountant"]), validate(invoiceIdParamRules), deleteInvoice);
router.post("/:id/payment", requireRole(["admin", "sales", "accountant"]), validate([...invoiceIdParamRules, ...addPaymentRules ]), addPayment);

export default router;

