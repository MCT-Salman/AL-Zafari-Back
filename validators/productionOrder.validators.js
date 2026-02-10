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
  body('type_item')
    .exists({ checkFalsy: true })
    .withMessage('نوع العنصر مطلوب')
    .isInt({ min: 1 })
    .withMessage('نوع العنصر يجب أن يكون رقماً صحيحاً موجباً'),
  body('constant_width')
    .exists({ checkFalsy: true })
    .withMessage('العرض الثابت مطلوب')
    .isDecimal()
    .withMessage('العرض الثابت يجب أن يكون رقماً عشرياً'),
  body('length')
    .exists({ checkFalsy: true })
    .withMessage('الطول مطلوب')
    .isDecimal()
    .withMessage('الطول يجب أن يكون رقماً عشرياً'),
  body('constant_thickness')
    .exists({ checkFalsy: true })
    .withMessage('السماكة الثابتة مطلوبة')
    .isDecimal()
    .withMessage('السماكة الثابتة يجب أن تكون رقماً عشرياً'),
  body('ruler_id')
    .exists({ checkFalsy: true })
    .withMessage('معرف المسطرة مطلوب')
    .isInt({ min: 1 })
    .withMessage('معرف المسطرة يجب أن يكون رقماً صحيحاً موجباً'),
  body('batch_id')
    .exists({ checkFalsy: true })
    .withMessage('معرف الطبخة مطلوب')
    .isInt({ min: 1 })
    .withMessage('معرف الطبخة يجب أن يكون رقماً صحيحاً موجباً'),
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

  // Validation for production types array
  /* body('production_types')
     .exists({ checkFalsy: true })
     .withMessage('أنواع الإنتاج مطلوبة')
     .isArray({ min: 1 })
     .withMessage('يجب تحديد نوع إنتاج واحد على الأقل'),
   body('production_types.*')
     .isIn(PRODUCTION_TYPES)
     .withMessage('نوع الإنتاج غير صالح'),
 
   // Optional quantity for each production type
   body('quantity')
     .optional()
     .isInt({ min: 1 })
     .withMessage('الكمية يجب أن تكون رقماً صحيحاً موجباً')*/
];

/**
 * قواعد التحقق من تحديث أمر إنتاج
 */
export const updateProductionOrderRules = [
  body('type_item')
    .optional()
    .isInt({ min: 1 })
    .withMessage('نوع العنصر يجب أن يكون رقماً صحيحاً موجباً'),
  body('constant_width')
    .optional()
    .isDecimal()
    .withMessage('العرض الثابت يجب أن يكون رقماً عشرياً'),
  body('length')
    .optional()
    .isDecimal()
    .withMessage('الطول يجب أن يكون رقماً عشرياً'),
  body('constant_thickness')
    .optional()
    .isDecimal()
    .withMessage('السماكة الثابتة يجب أن تكون رقماً عشرياً'),
  body('ruler_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('معرف المسطرة يجب أن يكون رقماً صحيحاً موجباً'),
  body('batch_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('معرف الطبخة يجب أن يكون رقماً صحيحاً موجباً'),
  body('status')
    .optional()
    .isIn(PRODUCTION_STATUSES)
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
export const createProductionOrderItemRules = [
  body().isArray({ min: 1 })
    .withMessage('يجب إرسال مصفوفة عناصر إنتاج'),
  body('*.constant_width')
    .exists({ checkFalsy: true })
    .withMessage('العرض الثابت مطلوب')
    .isDecimal()
    .withMessage('العرض الثابت يجب أن يكون رقماً عشرياً'),
  body('*.length')
    .exists({ checkFalsy: true })
    .withMessage('الطول مطلوب')
    .isDecimal()
    .withMessage('الطول يجب أن يكون رقماً عشرياً'),
  body('*.quantity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('الكمية يجب أن تكون رقماً صحيحاً موجباً'),
  body('*.status')
    .optional()
    .isIn(PRODUCTION_STATUSES)
    .withMessage('حالة الإنتاج غير صالحة'),
  body('*.notes')
    .optional()
    .isString()
    .withMessage('الملاحظات يجب أن تكون نصاً')
    .isLength({ max: 500 })
    .withMessage('الملاحظات يجب ألا تتجاوز 500 حرف'),
  body('*.production_types')
    .exists({ checkFalsy: true })
    .withMessage('أنواع الإنتاج مطلوبة')
    .isArray({ min: 1 })
    .withMessage('يجب تحديد نوع إنتاج واحد على الأقل'),
  body('production_types.*')
    .isIn(PRODUCTION_TYPES)
    .withMessage('نوع الإنتاج غير صالح'),
  body('*.source')
    .optional()
    .isIn(PROCESS_SOURCES)
    .withMessage('مصدر الإنتاج غير صالح'),
];
/**
 * قواعد التحقق من تحديث عنصر أمر إنتاج
 */
export const updateProductionOrderItemRules = [
  body('constant_width')
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
    .isIn(PRODUCTION_STATUSES)
    .withMessage('حالة الإنتاج غير صالحة'),
  body('notes')
    .optional()
    .isString()
    .withMessage('الملاحظات يجب أن تكون نصاً')
    .isLength({ max: 500 })
    .withMessage('الملاحظات يجب ألا تتجاوز 500 حرف')
];
