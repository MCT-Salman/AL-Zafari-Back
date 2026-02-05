// validators/order.validators.js
import { body, param, query } from "express-validator";

/**
 * Validation rules for order items
 */
const orderItemRules = [
  body("items")
    .exists({ checkFalsy: true })
    .withMessage("عناصر الطلب مطلوبة")
    .isArray({ min: 1 })
    .withMessage("يجب إضافة عنصر واحد على الأقل"),
  body("items.*.type_item")
    .exists({ checkFalsy: true })
    .withMessage("نوع العنصر مطلوب")
    .isInt({ min: 1 })
    .withMessage("نوع العنصر يجب أن يكون رقماً صحيحاً موجباً"),
  body("items.*.ruler_id")
    .exists({ checkFalsy: true })
    .withMessage("معرف المسطرة مطلوب")
    .isInt({ min: 1 })
    .withMessage("معرف المسطرة يجب أن يكون رقماً صحيحاً موجباً"),
  body("items.*.constant_width")
    .exists({ checkFalsy: true })
    .withMessage("العرض الثابت مطلوب")
    .isDecimal()
    .withMessage("العرض الثابت يجب أن يكون رقماً عشرياً"),
  body("items.*.length")
    .exists({ checkFalsy: true })
    .withMessage("الطول مطلوب")
    .isDecimal()
    .withMessage("الطول يجب أن يكون رقماً عشرياً"),
  body("items.*.constant_thickness")
    .exists({ checkFalsy: true })
    .withMessage("السماكة الثابتة مطلوبة")
    .isDecimal()
    .withMessage("السماكة الثابتة يجب أن تكون رقماً عشرياً"),
  body("items.*.batch_id")
    .exists({ checkFalsy: true })
    .withMessage("معرف الطبخة مطلوب")
    .isInt({ min: 1 })
    .withMessage("معرف الطبخة يجب أن يكون رقماً صحيحاً موجباً"),
  body("items.*.quantity")
    .exists({ checkFalsy: true })
    .withMessage("الكمية مطلوبة")
    .isInt({ min: 1 })
    .withMessage("الكمية يجب أن تكون رقماً صحيحاً موجباً"),
  /*body("items.*.unit_price")
    .exists({ checkFalsy: true })
    .withMessage("سعر الوحدة مطلوب")
    .isDecimal()
    .withMessage("سعر الوحدة يجب أن يكون رقماً عشرياً"),*/
  body("items.*.notes")
    .optional()
    .isString()
    .withMessage("الملاحظات يجب أن تكون نصاً")
    .isLength({ max: 500 })
    .withMessage("الملاحظات يجب ألا تتجاوز 500 حرف"),
];

/**
 * Validation rules for creating an order
 */
export const createOrderRules = [
  body("customer_id")
    .exists({ checkFalsy: true })
    .withMessage("معرف العميل مطلوب")
    .isInt({ min: 1 })
    .withMessage("معرف العميل يجب أن يكون رقماً صحيحاً موجباً"),
  body("status")
    .optional()
    .isIn(["pending", "preparing", "canceled", "completed"])
    .withMessage("الحالة يجب أن تكون pending أو preparing أو canceled أو completed"),
  body("notes")
    .optional()
    .isString()
    .withMessage("الملاحظات يجب أن تكون نصاً")
    .isLength({ max: 500 })
    .withMessage("الملاحظات يجب ألا تتجاوز 500 حرف"),
  ...orderItemRules,
];

/**
 * Validation rules for updating an order
 */
export const updateOrderRules = [
  body("customer_id")
    .optional()
    .isInt({ min: 1 })
    .withMessage("معرف العميل يجب أن يكون رقماً صحيحاً موجباً"),
  body("status")
    .optional()
    .isIn(["pending", "preparing", "canceled", "completed"])
    .withMessage("الحالة يجب أن تكون pending أو preparing أو canceled أو completed"),
  body("notes")
    .optional()
    .isString()
    .withMessage("الملاحظات يجب أن تكون نصاً")
    .isLength({ max: 500 })
    .withMessage("الملاحظات يجب ألا تتجاوز 500 حرف"),
  body("items")
    .optional()
    .isArray()
    .withMessage("عناصر الطلب يجب أن تكون مصفوفة"),
];

/**
 * Validation rules for order ID parameter
 */
export const orderIdParamRules = [
  param("id")
    .exists()
    .withMessage("معرف الطلب مطلوب")
    .isInt({ min: 1 })
    .withMessage("معرف الطلب يجب أن يكون رقماً صحيحاً موجباً"),
];

/**
 * Validation rules for getting orders with filters
 */
export const getOrdersQueryRules = [
  query("customer_id")
    .optional()
    .isInt({ min: 1 })
    .withMessage("معرف العميل يجب أن يكون رقماً صحيحاً موجباً"),
  query("status")
    .optional()
    .isIn(["pending", "preparing", "canceled", "completed"])
    .withMessage("الحالة يجب أن تكون pending أو preparing أو canceled أو completed"),
  query("sales_user_id")
    .optional()
    .isInt({ min: 1 })
    .withMessage("معرف موظف المبيعات يجب أن يكون رقماً صحيحاً موجباً"),
  query("start_date")
    .optional()
    .isISO8601()
    .withMessage("تاريخ البداية يجب أن يكون تاريخاً صالحاً"),
  query("end_date")
    .optional()
    .isISO8601()
    .withMessage("تاريخ النهاية يجب أن يكون تاريخاً صالحاً"),
];

/**
 * Validation rules for adding an order item
 */
export const addOrderItemRules = [
  body("type_item")
    .exists({ checkFalsy: true })
    .withMessage("نوع العنصر مطلوب")
    .isInt({ min: 1 })
    .withMessage("نوع العنصر يجب أن يكون رقماً صحيحاً موجباً"),
  body("ruler_id")
    .exists({ checkFalsy: true })
    .withMessage("معرف المسطرة مطلوب")
    .isInt({ min: 1 })
    .withMessage("معرف المسطرة يجب أن يكون رقماً صحيحاً موجباً"),
  body("constant_width")
    .exists({ checkFalsy: true })
    .withMessage("العرض الثابت مطلوب")
    .isDecimal()
    .withMessage("العرض الثابت يجب أن يكون رقماً عشرياً"),
  body("length")
    .exists({ checkFalsy: true })
    .withMessage("الطول مطلوب")
    .isDecimal()
    .withMessage("الطول يجب أن يكون رقماً عشرياً"),
  body("constant_thickness")
    .exists({ checkFalsy: true })
    .withMessage("السماكة الثابتة مطلوبة")
    .isDecimal()
    .withMessage("السماكة الثابتة يجب أن تكون رقماً عشرياً"),
  body("batch_id")
    .exists({ checkFalsy: true })
    .withMessage("معرف الطبخة مطلوب")
    .isInt({ min: 1 })
    .withMessage("معرف الطبخة يجب أن يكون رقماً صحيحاً موجباً"),
  body("quantity")
    .exists({ checkFalsy: true })
    .withMessage("الكمية مطلوبة")
    .isInt({ min: 1 })
    .withMessage("الكمية يجب أن تكون رقماً صحيحاً موجباً"),
  body("unit_price")
    .optional()
    .isDecimal()
    .withMessage("سعر الوحدة يجب أن يكون رقماً عشرياً"),
  body("notes")
    .optional()
    .isString()
    .withMessage("الملاحظات يجب أن تكون نصاً")
    .isLength({ max: 500 })
    .withMessage("الملاحظات يجب ألا تتجاوز 500 حرف"),
];

/**
 * Validation rules for updating an order item
 */
export const updateOrderItemRules = [
  body("type_item")
    .optional()
    .isInt({ min: 1 })
    .withMessage("نوع العنصر يجب أن يكون رقماً صحيحاً موجباً"),
  body("ruler_id")
    .optional()
    .isInt({ min: 1 })
    .withMessage("معرف المسطرة يجب أن يكون رقماً صحيحاً موجباً"),
  body("constant_width")
    .optional()
    .isDecimal()
    .withMessage("العرض الثابت يجب أن يكون رقماً عشرياً"),
  body("length")
    .optional()
    .isDecimal()
    .withMessage("الطول يجب أن يكون رقماً عشرياً"),
  body("constant_thickness")
    .optional()
    .isDecimal()
    .withMessage("السماكة الثابتة يجب أن تكون رقماً عشرياً"),
  body("batch_id")
    .optional()
    .isInt({ min: 1 })
    .withMessage("معرف الطبخة يجب أن يكون رقماً صحيحاً موجباً"),
  body("quantity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("الكمية يجب أن تكون رقماً صحيحاً موجباً"),
  body("unit_price")
    .optional()
    .isDecimal()
    .withMessage("سعر الوحدة يجب أن يكون رقماً عشرياً"),
  body("notes")
    .optional()
    .isString()
    .withMessage("الملاحظات يجب أن تكون نصاً")
    .isLength({ max: 500 })
    .withMessage("الملاحظات يجب ألا تتجاوز 500 حرف"),
];

/**
 * Validation rules for order item ID parameter
 */
export const orderItemIdParamRules = [
  param("itemId")
    .exists()
    .withMessage("معرف عنصر الطلب مطلوب")
    .isInt({ min: 1 })
    .withMessage("معرف عنصر الطلب يجب أن يكون رقماً صحيحاً موجباً"),
];

/**
 * Validation rules for updating order status
 */
export const updateOrderStatusRules = [
  body("status")
    .exists({ checkFalsy: true })
    .withMessage("الحالة مطلوبة")
    .isIn(["pending", "preparing", "canceled", "completed"])
    .withMessage("الحالة يجب أن تكون pending أو preparing أو canceled أو completed"),
];

