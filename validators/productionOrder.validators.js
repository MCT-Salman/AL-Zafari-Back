import { body, param, query } from 'express-validator';

// Production types mapping
const PRODUCTION_TYPES = ['warehouse', 'slitting', 'cutting', 'gluing'];
const PRODUCTION_STATUSES = ['pending', 'preparing', 'canceled', 'completed'];
const PROCESS_SOURCES = ['warehouse', 'slitting', 'cutting', 'production'];
const MOVEMENT_DESTINATIONS = ['slitting', 'cutting', 'production'];

/**
 * قواعد التحقق من معرف أمر الإنتاج
 */
export const productionOrderIdParamRules = [
  param('id')
    .exists({ checkFalsy: true })
    .withMessage('معرف أمر الإنتاج مطلوب')
    .isInt({ min: 1 })
    .withMessage('معرف أمر الإنتاج يجب أن يكون رقماً صحيحاً موجباً')
];

/**
 * قواعد التحقق من معرف عنصر أمر الإنتاج
 */
export const productionOrderItemIdParamRules = [
  param('id')
    .exists({ checkFalsy: true })
    .withMessage('معرف عنصر أمر الإنتاج مطلوب')
    .isInt({ min: 1 })
    .withMessage('معرف عنصر أمر الإنتاج يجب أن يكون رقماً صحيحاً موجباً')
];

/**
 * قواعد التحقق من استعلام أوامر الإنتاج
 */
export const getProductionOrdersQueryRules = [
  query('status')
    .optional()
    .isIn(PRODUCTION_STATUSES)
    .withMessage('حالة الإنتاج غير صالحة'),
  query('search')
    .optional()
    .isString()
    .withMessage('البحث يجب أن يكون نصاً')
];

/**
 * قواعد التحقق من إنشاء أمر إنتاج جديد
 */
export const createProductionOrderRules = [
  body('status')
    .optional()
    .isIn(PRODUCTION_STATUSES)
    .withMessage('حالة الإنتاج غير صالحة'),
  body('notes')
    .optional()
    .isString()
    .withMessage('الملاحظات يجب أن تكون نصاً')
    .isLength({ max: 500 })
    .withMessage('الملاحظات يجب ألا تتجاوز 500 حرف'),
  body('items')
    .exists({ checkFalsy: true })
    .withMessage('عناصر الإنتاج مطلوبة')
    .isArray({ min: 1 })
    .withMessage('يجب تحديد عنصر إنتاج واحد على الأقل'),
  body('items.*.type_item')
    .exists({ checkFalsy: true })
    .withMessage('نوع العنصر مطلوب')
    .isIn(["Presser", "Machine"])
    .withMessage('نوع العنصر يجب أن يكون كوي أو مكنة'),
  body('items.*.color_id')
    .exists({ checkFalsy: true })
    .withMessage('معرف اللون مطلوب')
    .isInt({ min: 1 })
    .withMessage('معرف اللون يجب أن يكون رقماً صحيحاً موجباً'),
  body('items.*.batch_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('معرف الطبخة يجب أن يكون رقماً صحيحاً موجباً'),
  body('items.*.source')
    .optional()
    .isIn(PROCESS_SOURCES)
    .withMessage('المصدر غير صالح'),
  body('items.*.destination')
    .optional()
    .isIn(MOVEMENT_DESTINATIONS)
    .withMessage('الوجهة غير صالحة'),
  body('items.*.thickness')
    .exists({ checkFalsy: true })
    .withMessage('السماكة الثابتة مطلوبة')
    .isDecimal()
    .withMessage('السماكة الثابتة يجب أن تكون رقماً عشريام'),
  body('items.*.width')
    .exists({ checkFalsy: true })
    .withMessage('العرض الثابت مطلوب')
    .isDecimal()
    .withMessage('العرض الثابت يجب أن يكون رقماً عشريام'),
  body('items.*.length')
    .exists({ checkFalsy: true })
    .withMessage('الطول مطلوب')
    .isDecimal()
    .withMessage('الطول يجب أن يكون رقماً عشريام'),
  body('items.*.quantity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('الكمية يجب أن تكون رقماً صحيحاً موجباً'),
  body('items.*.status')
    .optional()
    .isIn(PRODUCTION_STATUSES)
    .withMessage('حالة الإنتاج غير صالحة'),
  body('items.*.notes')
    .optional()
    .isString()
    .withMessage('الملاحظات يجب أن تكون نصام')
    .isLength({ max: 500 })
    .withMessage('الملاحظات يجب ألا تتجاوز 500 حرف'),
  body('items.*.production_types')
    .exists({ checkFalsy: true })
    .withMessage('أنواع الإنتاج مطلوبة')
    .isArray({ min: 1 })
    .withMessage('يجب تحديد نوع إنتاج واحد على الأقل'),
  body('items.*.production_types.*')
    .isIn(PRODUCTION_TYPES)
    .withMessage('نوع الإنتاج غير صالح')

];

export const createProductionOrderItemRules = [
  body('type_item')
    .exists({ checkFalsy: true })
    .withMessage('نوع العنصر مطلوب')
    .isIn(["Presser", "Machine"])
    .withMessage('نوع العنصر يجب أن يكون كوي أو مكنة'),
  body('color_id')
    .exists({ checkFalsy: true })
    .withMessage('معرف اللون مطلوب')
    .isInt({ min: 1 })
    .withMessage('معرف اللون يجب أن يكون رقماً صحيحاً موجباً'),
  body('batch_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('معرف الطبخة يجب أن يكون رقماً صحيحاً موجباً'),
  body('source')
    .optional()
    .isIn(PROCESS_SOURCES)
    .withMessage('المصدر غير صالح'),
  body('destination')
    .optional()
    .isIn(MOVEMENT_DESTINATIONS)
    .withMessage('الوجهة غير صالحة'),
  body('thickness')
    .exists({ checkFalsy: true })
    .withMessage('السماكة الثابتة مطلوبة')
    .isDecimal()
    .withMessage('السماكة الثابتة يجب أن تكون رقماً عشريام'),
  body('width')
    .exists({ checkFalsy: true })
    .withMessage('العرض الثابت مطلوب')
    .isDecimal()
    .withMessage('العرض الثابت يجب أن يكون رقماً عشريام'),
  body('length')
    .exists({ checkFalsy: true })
    .withMessage('الطول مطلوب')
    .isDecimal()
    .withMessage('الطول يجب أن يكون رقماً عشريام'),
  body('quantity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('الكمية يجب أن تكون رقماً صحيحاً موجباً'),
  body('notes')
    .optional()
    .isString()
    .withMessage('الملاحظات يجب أن تكون نصام')
    .isLength({ max: 500 })
    .withMessage('الملاحظات يجب ألا تتجاوز 500 حرف'),
];

export const productionOrderTypeParamRules = [
  param('type')
    .exists({ checkFalsy: true })
    .withMessage('نوع الإنتاج مطلوب')
    .isIn(PRODUCTION_TYPES)
    .withMessage('نوع الإنتاج غير صالح')
];

/**
 * قواعد التحقق من تحديث أمر إنتاج
 */
export const updateProductionOrderRules = [
  body('status')
    .optional()
    .isIn(PRODUCTION_STATUSES)
    .withMessage('حالة الإنتاج غير صالحة'),
  body('notes')
    .optional()
    .isString()
    .withMessage('الملاحظات يجب أن تكون نصاً')
    .isLength({ max: 500 })
    .withMessage('الملاحظات يجب ألا تتجاوز 500 حرف'),
  body('items')
    .optional()
    .isArray()
    .withMessage('عناصر الإنتاج يجب أن تكون مصفوفة'),
  body('items.*.type_item')
    .optional()
    .isIn(["Presser", "Machine"])
    .withMessage('نوع العنصر يجب أن يكون كوي أو مكنة'),
  body('items.*.color_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('معرف اللون يجب أن يكون رقماً صحيحاً موجباً'),
  body('items.*.source')
    .optional()
    .isIn(PROCESS_SOURCES)
    .withMessage('المصدر غير صالح'),
  body('items.*.destination')
    .optional()
    .isIn(MOVEMENT_DESTINATIONS)
    .withMessage('الوجهة غير صالحة'),
  body('items.*.batch_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('معرف الطبخة يجب أن يكون رقماً صحيحاً موجباً'),
  body('items.*.thickness')
    .optional()
    .isDecimal()
    .withMessage('السماكة الثابتة يجب أن تكون رقماً عشريام'),
  body('items.*.width')
    .optional()
    .isDecimal()
    .withMessage('العرض الثابت يجب أن يكون رقماً عشريام'),
  body('items.*.length')
    .optional()
    .isDecimal()
    .withMessage('الطول يجب أن يكون رقماً عشريام'),
  body('items.*.quantity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('الكمية يجب أن تكون رقماً صحيحاً موجباً'),
  body('items.*.status')
    .optional()
    .isIn(PRODUCTION_STATUSES)
    .withMessage('حالة الإنتاج غير صالحة'),
  body('items.*.notes')
    .optional()
    .isString()
    .withMessage('الملاحظات يجب أن تكون نصام')
    .isLength({ max: 500 })
    .withMessage('الملاحظات يجب ألا تتجاوز 500 حرف'),
  body('items.*.production_types')
    .optional()
    .isArray()
    .withMessage('أنواع الإنتاج يجب أن تكون مصفوفة'),
  body('items.*.production_types.*')
    .optional()
    .isIn(PRODUCTION_TYPES)
    .withMessage('نوع الإنتاج غير صالح')
];

export const updatestatusProductionOrderRules = [
  body('status')
    .exists()
    .withMessage('حالة العملية مطلوبة')
    .isIn(PRODUCTION_STATUSES)
    .withMessage('حالة الإنتاج غير صالحة')
]
