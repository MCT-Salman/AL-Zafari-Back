// validators/constantValue.validators.js
import { body, param, query } from 'express-validator';


// Allowed constant types
const ALLOWED_CONSTANT_TYPES = ['width', 'height', 'thickness', 'type_order', 'source_order'];

/**
 * Validation rules for creating a constant value
 */
export const createConstantValueRules = [
  body('constant_type_id')
    .exists({ checkFalsy: true }).withMessage('معرف النوع الثابت مطلوب')
    .isInt({ min: 1 }).withMessage('معرف النوع الثابت يجب أن يكون رقماً صحيحاً موجباً'),
  body('value')
    .exists({ checkFalsy: true }).withMessage('القيمة مطلوبة')
    .isString().withMessage('القيمة يجب أن تكون نصاً')
    .isLength({ min: 1, max: 100 }).withMessage('القيمة يجب أن تكون بين 1 و 100 حرف'),
  body('unit')
    // .exists({ checkFalsy: true }).withMessage('الوحدة مطلوبة')
    .optional()
    .isString().withMessage('الوحدة يجب أن تكون نصاً')
    .isLength({ min: 1, max: 50 }).withMessage('الوحدة يجب أن تكون بين 1 و 50 حرف'),
  body('label')
    //.exists({ checkFalsy: true }).withMessage('التسمية مطلوبة')
    .optional()
    .isString().withMessage('التسمية يجب أن تكون نصاً')
    .isLength({ min: 1, max: 100 }).withMessage('التسمية يجب أن تكون بين 1 و 100 حرف'),
  body('isDefault')
    .optional()
    .isBoolean().withMessage('isDefault يجب أن يكون قيمة منطقية'),
  body('notes')
    .optional()
    .isString().withMessage('الملاحظات يجب أن تكون نصاً')
    .isLength({ max: 500 }).withMessage('الملاحظات يجب ألا تتجاوز 500 حرف')
];

/**
 * Validation rules for updating a constant value
 */
export const updateConstantValueRules = [
  body('constant_type_id')
    .optional()
    .isInt({ min: 1 }).withMessage('معرف النوع الثابت يجب أن يكون رقماً صحيحاً موجباً'),
  body('value')
    .optional()
    .isString().withMessage('القيمة يجب أن تكون نصاً')
    .isLength({ min: 1, max: 100 }).withMessage('القيمة يجب أن تكون بين 1 و 100 حرف'),
  body('unit')
    .optional()
    .isString().withMessage('الوحدة يجب أن تكون نصاً')
    .isLength({ min: 1, max: 50 }).withMessage('الوحدة يجب أن تكون بين 1 و 50 حرف'),
  body('label')
    .optional()
    .isString().withMessage('التسمية يجب أن تكون نصاً')
    .isLength({ min: 1, max: 100 }).withMessage('التسمية يجب أن تكون بين 1 و 100 حرف'),
  body('isDefault')
    .optional()
    .isBoolean().withMessage('isDefault يجب أن يكون قيمة منطقية'),
  body('notes')
    .optional()
    .isString().withMessage('الملاحظات يجب أن تكون نصاً')
    .isLength({ max: 500 }).withMessage('الملاحظات يجب ألا تتجاوز 500 حرف')
];

/**
 * Validation rules for constant value ID parameter
 */
export const constantValueIdParamRules = [
  param('id')
    .exists().withMessage('معرف القيمة الثابتة مطلوب')
    .isInt({ min: 1 }).withMessage('معرف القيمة الثابتة يجب أن يكون رقماً صحيحاً موجباً')
];

/**
 * Validation rules for getting constant values with filters
 */
export const getConstantValuesQueryRules = [
  query('constant_type_id')
    .optional()
    .isInt({ min: 1 }).withMessage('معرف النوع الثابت يجب أن يكون رقماً صحيحاً موجباً'),
  query('isDefault')
    .optional()
    .isIn(['true', 'false']).withMessage('isDefault يجب أن يكون true أو false'),
  query('search')
    .optional()
    .isString().withMessage('نص البحث يجب أن يكون نصاً')
];

export const constantTypeIdParamRules = [
  param('id')
    .exists().withMessage('معرف النوع الثابت مطلوب')
    .isInt({ min: 1 }).withMessage('معرف النوع الثابت يجب أن يكون رقماً صحيحاً موجباً')
];

export const constantTypeRules = [
  param('type')
    .exists().withMessage('نوع النوع الثابت مطلوب')
    .isIn(ALLOWED_CONSTANT_TYPES).withMessage('نوع النوع الثابت غير صالح')
];
