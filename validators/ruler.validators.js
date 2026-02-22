// validators/ruler.validators.js
import { body, param, query } from 'express-validator';

export const materialIdParamRules = [
  param('id')
    .exists().withMessage('معرف المادة مطلوب')
    .isInt({ min: 1 }).withMessage('معرف المادة يجب أن يكون رقماً صحيحاً موجباً')
];
/**
 * Validation rules for creating a ruler
 */
export const createRulerRules = [
  body('ruler_name')
    .exists({ checkFalsy: true }).withMessage('اسم المسطرة مطلوب')
    .isString().withMessage('اسم المسطرة يجب أن يكون نصام')
    .isLength({ min: 2, max: 100 }).withMessage('اسم المسطرة يجب أن يكون بين 2 و 100 حرف'),
  body('entry_date')
    .exists({ checkFalsy: true }).withMessage('تاريخ الدخول مطلوب')
    .isISO8601().withMessage('تاريخ الدخول يجب أن يكون تاريخ صالح'),
  body('material_id')
    .exists({ checkFalsy: true }).withMessage('معرف المادة مطلوب')
    .isInt({ min: 1 }).withMessage('معرف المادة يجب أن يكون رقماً صحيحاً موجباً'),
  body('notes')
    .optional()
    .isString().withMessage('الملاحظات يجب أن تكون نصاً')
    .isLength({ max: 500 }).withMessage('الملاحظات يجب ألا تتجاوز 500 حرف')
];

/**
 * Validation rules for updating a ruler
 */
export const updateRulerRules = [
  body('name')
    .optional()
    .isString().withMessage('اسم المسطرة يجب أن يكون نصام')
    .isLength({ min: 2, max: 100 }).withMessage('اسم المسطرة يجب أن يكون بين 2 و 100 حرف'),
  body('entry_date')
    .optional()
    .isISO8601().withMessage('تاريخ الدخول يجب أن يكون تاريخ صالح'),
  body('material_id')
    .optional()
    .isInt({ min: 1 }).withMessage('معرف المادة يجب أن يكون رقماً صحيحاً موجباً'),
  body('notes')
    .optional()
    .isString().withMessage('الملاحظات يجب أن تكون نصاً')
    .isLength({ max: 500 }).withMessage('الملاحظات يجب ألا تتجاوز 500 حرف')
];

/**
 * Validation rules for ruler ID parameter
 */
export const rulerIdParamRules = [
  param('id')
    .exists().withMessage('معرف المسطرة مطلوب')
    .isInt({ min: 1 }).withMessage('معرف المسطرة يجب أن يكون رقماً صحيحاً موجباً')
];

/**
 * Validation rules for getting rulers with filters
 */
export const getRulersQueryRules = [
  query('material_id')
    .optional()
    .isInt({ min: 1 }).withMessage('معرف المادة يجب أن يكون رقماً صحيحاً موجباً'),
];

