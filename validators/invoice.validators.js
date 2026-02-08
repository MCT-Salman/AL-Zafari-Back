// validators/invoice.validators.js
import { body, param, query } from "express-validator";

/**
 * قواعد التحقق من إنشاء فاتورة
 */
export const createInvoiceRules = [
  body("order_id")
    .notEmpty()
    .withMessage("معرف الطلب مطلوب")
    .isInt({ min: 1 })
    .withMessage("معرف الطلب يجب أن يكون رقماً صحيحاً"),

  body("paid_amount")
    .optional()
    .isDecimal({ decimal_digits: "0,2" })
    .withMessage("المبلغ المدفوع يجب أن يكون رقماً عشرياً صحيحاً")
    .custom((value) => {
      if (Number(value) < 0) {
        throw new Error("المبلغ المدفوع لا يمكن أن يكون سالباً");
      }
      return true;
    }),

  body("notes")
    .optional()
    .isString()
    .withMessage("الملاحظات يجب أن تكون نصاً")
    .trim(),
];

/**
 * قواعد التحقق من تحديث فاتورة
 */
export const updateInvoiceRules = [
  body("paid_amount")
    .optional()
    .isDecimal({ decimal_digits: "0,2" })
    .withMessage("المبلغ المدفوع يجب أن يكون رقماً عشرياً صحيحاً")
    .custom((value) => {
      if (Number(value) < 0) {
        throw new Error("المبلغ المدفوع لا يمكن أن يكون سالباً");
      }
      return true;
    }),

  body("notes")
    .optional()
    .isString()
    .withMessage("الملاحظات يجب أن تكون نصاً")
    .trim(),
];

/**
 * قواعد التحقق من معرف الفاتورة في الـ params
 */
export const invoiceIdParamRules = [
  param("id")
    .notEmpty()
    .withMessage("معرف الفاتورة مطلوب")
    .isInt({ min: 1 })
    .withMessage("معرف الفاتورة يجب أن يكون رقماً صحيحاً"),
];

/**
 * قواعد التحقق من فلاتر جلب الفواتير
 */
export const getInvoicesQueryRules = [
  query("customer_id")
    .optional()
    .isInt({ min: 1 })
    .withMessage("معرف العميل يجب أن يكون رقماً صحيحاً"),

  query("order_id")
    .optional()
    .isInt({ min: 1 })
    .withMessage("معرف الطلب يجب أن يكون رقماً صحيحاً"),

  query("issued_by")
    .optional()
    .isInt({ min: 1 })
    .withMessage("معرف المستخدم يجب أن يكون رقماً صحيحاً"),

  query("start_date")
    .optional()
    .isISO8601()
    .withMessage("تاريخ البداية يجب أن يكون بصيغة ISO8601"),

  query("end_date")
    .optional()
    .isISO8601()
    .withMessage("تاريخ النهاية يجب أن يكون بصيغة ISO8601"),

  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("رقم الصفحة يجب أن يكون رقماً صحيحاً أكبر من 0"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("عدد العناصر يجب أن يكون بين 1 و 100"),
];

/**
 * قواعد التحقق من إضافة دفعة
 */
export const addPaymentRules = [
  body("payment_amount")
    .notEmpty()
    .withMessage("مبلغ الدفعة مطلوب")
    .isDecimal({ decimal_digits: "0,2" })
    .withMessage("مبلغ الدفعة يجب أن يكون رقماً عشرياً صحيحاً")
    .custom((value) => {
      if (Number(value) <= 0) {
        throw new Error("مبلغ الدفعة يجب أن يكون أكبر من صفر");
      }
      return true;
    }),
];

