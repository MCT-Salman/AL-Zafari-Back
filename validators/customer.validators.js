// validators/customer.validators.js
import { body, param, query } from "express-validator";

/**
 * Validation rules for creating a customer
 */
export const createCustomerRules = [
  body("name")
    .exists({ checkFalsy: true })
    .withMessage("اسم العميل مطلوب")
    .isString()
    .withMessage("اسم العميل يجب أن يكون نصاً")
    .isLength({ min: 2, max: 100 })
    .withMessage("اسم العميل يجب أن يكون بين 2 و 100 حرف"),
  body("phone")
    .exists({ checkFalsy: true })
    .withMessage("رقم الهاتف مطلوب")
    .isString()
    .withMessage("رقم الهاتف يجب أن يكون نصاً"),
  body("customer_type")
    .exists({ checkFalsy: true })
    .withMessage("نوع العميل مطلوب")
    .isIn(["Branch", "agent", "customer"])
    .withMessage("نوع العميل يجب أن يكون Branch أو agent أو customer"),
  body("city")
    .exists({ checkFalsy: true })
    .withMessage("المدينة مطلوبة")
    .isString()
    .withMessage("المدينة يجب أن تكون نصاً")
    .isLength({ min: 2, max: 100 })
    .withMessage("المدينة يجب أن تكون بين 2 و 100 حرف"),
  body("address")
    .exists({ checkFalsy: true })
    .withMessage("العنوان مطلوب")
    .isString()
    .withMessage("العنوان يجب أن يكون نصاً")
    .isLength({ min: 5, max: 255 })
    .withMessage("العنوان يجب أن يكون بين 5 و 255 حرف"),
  body("is_active")
    .optional()
    .isBoolean()
    .withMessage("حالة التفعيل يجب أن تكون true أو false"),
  body("fcmToken").optional().isString().withMessage("fcmToken يجب أن يكون نصاً"),
  body("notes")
    .optional()
    .isString()
    .withMessage("الملاحظات يجب أن تكون نصاً")
    .isLength({ max: 500 })
    .withMessage("الملاحظات يجب ألا تتجاوز 500 حرف"),
];

/**
 * Validation rules for updating a customer
 */
export const updateCustomerRules = [
  body("name")
    .optional()
    .isString()
    .withMessage("اسم العميل يجب أن يكون نصاً")
    .isLength({ min: 2, max: 100 })
    .withMessage("اسم العميل يجب أن يكون بين 2 و 100 حرف"),
  body("phone")
    .optional()
    .isString()
    .withMessage("رقم الهاتف يجب أن يكون نصاً"),
  body("customer_type")
    .optional()
    .isIn(["Branch", "agent", "customer"])
    .withMessage("نوع العميل يجب أن يكون Branch أو agent أو customer"),
  body("city")
    .optional()
    .isString()
    .withMessage("المدينة يجب أن تكون نصاً")
    .isLength({ min: 2, max: 100 })
    .withMessage("المدينة يجب أن تكون بين 2 و 100 حرف"),
  body("address")
    .optional()
    .isString()
    .withMessage("العنوان يجب أن يكون نصاً")
    .isLength({ min: 5, max: 255 })
    .withMessage("العنوان يجب أن يكون بين 5 و 255 حرف"),
  body("is_active")
    .optional()
    .isBoolean()
    .withMessage("حالة التفعيل يجب أن تكون true أو false"),
  body("fcmToken").optional().isString().withMessage("fcmToken يجب أن يكون نصاً"),
  body("notes")
    .optional()
    .isString()
    .withMessage("الملاحظات يجب أن تكون نصاً")
    .isLength({ max: 500 })
    .withMessage("الملاحظات يجب ألا تتجاوز 500 حرف"),
];

/**
 * Validation rules for customer ID parameter
 */
export const customerIdParamRules = [
  param("id")
    .exists()
    .withMessage("معرف العميل مطلوب")
    .isInt({ min: 1 })
    .withMessage("معرف العميل يجب أن يكون رقماً صحيحاً موجباً"),
];

/**
 * Validation rules for getting customers with filters
 */
export const getCustomersQueryRules = [
  query("customer_type")
    .optional()
    .isIn(["Branch", "agent", "customer"])
    .withMessage("نوع العميل يجب أن يكون Branch أو agent أو customer"),
  query("city").optional().isString().withMessage("المدينة يجب أن تكون نصاً"),
  query("is_active")
    .optional()
    .isIn(["true", "false"])
    .withMessage("حالة التفعيل يجب أن تكون true أو false"),
  query("search").optional().isString().withMessage("نص البحث يجب أن يكون نصاً"),
];

