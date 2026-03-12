// validators/invoice.validators.js
import { body, param, query } from "express-validator";

/**
 * قواعد التحقق من إنشاء فاتورة
 */
export const createInvoiceRules = [
  body("order_id")
    .optional()
    .isInt({ min: 1 })
    .withMessage("معرف الطلب يجب أن يكون رقماً صحيحاً"),
  body("customer_id")
    .optional()
    .isInt({ min: 1 })
    .withMessage("معرف العميل يجب أن يكون رقماً صحيحاً"),
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
  body("items")
    .notEmpty()
    .withMessage("عناصر الفاتورة مطلوبة")
    .isArray()
    .withMessage("عناصر الفاتورة يجب أن تكون مصفوفة"),
  body("items.*.type_item")
    .optional()
    .isIn(["Presser", "Machine"])
    .withMessage("نوع العنصر غير صالح"),
  body("items.*.color_id")
    .notEmpty()
    .withMessage("معرف اللون مطلوب")
    .isInt({ min: 1 })
    .withMessage("معرف اللون يجب أن يكون رقماً صحيحاً"),
  body("items.*.batch_id")
    .optional()
    .isInt({ min: 1 })
    .withMessage("معرف الطبخة يجب أن يكون رقماً صحيحاً"),
  body("items.*.thickness")
    .optional()
    .isDecimal()
    .withMessage("السماكة الثابتة يجب أن تكون رقماً عشريام"),
  body("items.*.width")
    .optional()
    .isDecimal()
    .withMessage("العرض الثابت يجب أن يكون رقماً عشريام"),
  body("items.*.length")
    .optional()
    .isDecimal()
    .withMessage("الطول يجب أن يكون رقماً عشريام"),
  body("items.*.quantity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("الكمية يجب أن تكون رقماً صحيحاً"),
  body("items.*.unit_price")
    .notEmpty()
    .withMessage("السعر مطلوب")
    .isDecimal()
    .withMessage("سعر الوحدة يجب أن يكون رقماً عشريام"),
];

/**
 * قواعد التحقق من تحديث فاتورة
 */
export const updateInvoiceRules = [
  body("order_id")
    .optional()
    .isInt({ min: 1 })
    .withMessage("معرف الطلب يجب أن يكون رقماً صحيحاً"),
  body("customer_id")
    .optional()
    .isInt({ min: 1 })
    .withMessage("معرف العميل يجب أن يكون رقماً صحيحاً"),
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

  body("items")
    .optional()
    .isArray()
    .withMessage("عناصر الفاتورة يجب أن تكون مصفوفة"),
  body("items.*.type_item")
    .optional()
    .isIn(["Presser", "Machine"])
    .withMessage("نوع العنصر غير صالح"),
  body("items.*.color_id")
    .optional()
    .isInt({ min: 1 })
    .withMessage("معرف اللون يجب أن يكون رقماً صحيحاً"),
  body("items.*.batch_id")
    .optional()
    .isInt({ min: 1 })
    .withMessage("معرف الطبخة يجب أن يكون رقماً صحيحاً"),
  body("items.*.thickness")
    .optional()
    .isDecimal()
    .withMessage("السماكة الثابتة يجب أن تكون رقماً عشريام"),
  body("items.*.width")
    .optional()
    .isDecimal()
    .withMessage("العرض الثابت يجب أن يكون رقماً عشريام"),
  body("items.*.length")
    .optional()
    .isDecimal()
    .withMessage("الطول يجب أن يكون رقماً عشريام"),
  body("items.*.quantity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("الكمية يجب أن تكون رقماً صحيحاً"),
  body("items.*.unit_price")
    .optional()
    .isDecimal()
    .withMessage("سعر الوحدة يجب أن يكون رقماً عشريام"),
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

export const customerIdParamRules = [
  param("id")
    .notEmpty()
    .withMessage("معرف العميل مطلوب")
    .isInt({ min: 1 })
    .withMessage("معرف العميل يجب أن يكون رقماً صحيحاً"),
];

export const orderIdParamRules = [
  param("id")
    .notEmpty()
    .withMessage("معرف الطلب مطلوب")
    .isInt({ min: 1 })
    .withMessage("معرف الطلب يجب أن يكون رقماً صحيحاً"),
];

export const allInvoicesarrayRules = [
  body("ids")
    .notEmpty()
    .withMessage("معرفات الفواتير مطلوبة")
    .isArray()
    .withMessage("معرفات الفواتير يجب أن تكون مصفوفة")
    .custom((value) => {
      if (value.length === 0) {
        throw new Error("معرفات الفواتير يجب أن تحتوي على عنصر واحد على الأقل");
      }
      return true;
    }),
];

export const getPriceMaterialRules = [
  body("color_id")
    .notEmpty()
    .withMessage("معرف اللون مطلوب")
    .isInt({ min: 1 })
    .withMessage("معرف اللون يجب أن يكون رقماً صحيحاً"),
  body("type_item")
    .optional()
    .isIn(["Presser", "Machine"])
    .withMessage("نوع العنصر غير صالح"),
  body("width")
    .optional()
    .isDecimal()
    .withMessage("العرض يجب أن يكون رقماً عشريام"),
  body("length")
    .optional()
    .isDecimal()
    .withMessage("الطول يجب أن يكون رقماً عشريام"),
  body("quantity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("الكمية يجب أن تكون رقماً صحيحاً"),
];
/**
 * قواعد التحقق من فلاتر جلب الفواتير
 */
export const getInvoicesQueryRules = [
  query("customer_id")
    .optional()
    .isInt({ min: 1 })
    .withMessage("معرف العميل يجب أن يكون رقماً صحيحاً"),

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

