import { body, param, query } from 'express-validator';

// Sales types mapping
const Sales_STATUSES = ['pending', 'preparing', 'canceled', 'completed'];

/**
 * قواعد التحقق من معرف أمر الإنتاج
 */
export const SalesOrderIdParamRules = [
  param('id')
    .exists({ checkFalsy: true })
    .withMessage('معرف أمر الإنتاج مطلوب')
    .isInt({ min: 1 })
    .withMessage('معرف أمر الإنتاج يجب أن يكون رقماً صحيحاً موجباً')
];

/**
 * قواعد التحقق من معرف عنصر أمر الإنتاج
 */
export const SalesOrderItemIdParamRules = [
  param('id')
    .exists({ checkFalsy: true })
    .withMessage('معرف عنصر أمر الإنتاج مطلوب')
    .isInt({ min: 1 })
    .withMessage('معرف عنصر أمر الإنتاج يجب أن يكون رقماً صحيحاً موجباً')
];

/**
 * قواعد التحقق من استعلام أوامر الإنتاج
 */
export const getSalesOrdersQueryRules = [
  query('status')
    .optional()
    .isIn(Sales_STATUSES)
    .withMessage('حالة الإنتاج غير صالحة'),
  query('search')
    .optional()
    .isString()
    .withMessage('البحث يجب أن يكون نصاً')
];

/**
 * قواعد التحقق من إنشاء أمر إنتاج جديد
 */
export const createSalesOrderRules = [
  body('status')
    .optional()
    .isIn(Sales_STATUSES)
    .withMessage('حالة الإنتاج غير صالحة'),
  body('notes')
    .optional()
    .isString()
    .withMessage('الملاحظات يجب أن تكون نصاً')
    .isLength({ max: 500 })
    .withMessage('الملاحظات يجب ألا تتجاوز 500 حرف'),
];

/**
 * قواعد التحقق من تحديث أمر إنتاج
 */
export const updateSalesOrderRules = [
  body('status')
    .optional()
    .isIn(Sales_STATUSES)
    .withMessage('حالة الإنتاج غير صالحة'),
  body('notes')
    .optional()
    .isString()
    .withMessage('الملاحظات يجب أن تكون نصاً')
    .isLength({ max: 500 })
    .withMessage('الملاحظات يجب ألا تتجاوز 500 حرف')
];

/**
 * قواعد التحقق من إنشاء عنصر أمر إنتاج
 */
export const createSalesOrderItemRules = [
  body('type_item')
    .exists({ checkFalsy: true })
    .withMessage('نوع العنصر مطلوب')
    .isIn(["Presser", "Machine"])
    .withMessage('نوع العنصر غير صالح'),
  body('color_id')
    .exists({ checkFalsy: true })
    .withMessage('معرف اللون مطلوب')
    .isInt({ min: 1 })
    .withMessage('معرف اللون يجب أن يكون رقماً صحيحاً موجباً'),
    body('batch_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('معرف الطبخة يجب أن يكون رقماً صحيحاً موجباً'),
  body('width')
    .exists({ checkFalsy: true })
    .withMessage('العرض مطلوب')
    .isDecimal()
    .withMessage('العرض الثابت يجب أن يكون رقماً عشرياً'),
  body('length')
    .exists({ checkFalsy: true })
    .withMessage('الطول مطلوب')
    .isDecimal()
    .withMessage('الطول يجب أن يكون رقماً عشرياً'),
    body('thickness')
    .exists({ checkFalsy: true })
    .withMessage('السماكة مطلوبة')
    .isDecimal()
    .withMessage('السماكة يجب أن تكون رقماً عشريام'),
  body('quantity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('الكمية يجب أن تكون رقماً صحيحاً موجباً'),
  body('status')
    .optional()
    .isIn(Sales_STATUSES)
    .withMessage('حالة الإنتاج غير صالحة'),
  body('notes')
    .optional()
    .isString()
    .withMessage('الملاحظات يجب أن تكون نصاً')
    .isLength({ max: 500 })
    .withMessage('الملاحظات يجب ألا تتجاوز 500 حرف'),
];
/**
 * قواعد التحقق من تحديث عنصر أمر إنتاج
 */
export const updateSalesOrderItemRules = [
  body('width')
    .optional()
    .isDecimal()
    .withMessage('العرض الثابت يجب أن يكون رقماً عشرياً'),
  body('length')
    .optional()
    .isDecimal()
    .withMessage('الطول يجب أن يكون رقماً عشرياً'),
  body('quantity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('الكمية يجب أن تكون رقماً صحيحاً موجباً'),
  body('status')
    .optional()
    .isIn(Sales_STATUSES)
    .withMessage('حالة الإنتاج غير صالحة'),
  body('notes')
    .optional()
    .isString()
    .withMessage('الملاحظات يجب أن تكون نصاً')
    .isLength({ max: 500 })
    .withMessage('الملاحظات يجب ألا تتجاوز 500 حرف')
];
