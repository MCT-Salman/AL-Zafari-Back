// validators/ruler.validators.js
import { body, param, query } from 'express-validator';

// Allowed ruler types
const ALLOWED_RULER_TYPES = ['old', 'new'];

/**
 * Validation rules for creating a ruler
 */
export const createRulerRules = [
  body('ruler_type')
    .exists({ checkFalsy: true }).withMessage('نوع المسطرة مطلوب')
    .isIn(ALLOWED_RULER_TYPES).withMessage('نوع المسطرة غير صالح'),
  body('material_id')
    .exists({ checkFalsy: true }).withMessage('معرف المادة مطلوب')
    .isInt({ min: 1 }).withMessage('معرف المادة يجب أن يكون رقماً صحيحاً موجباً'),
  body('color_id')
    .exists({ checkFalsy: true }).withMessage('معرف اللون مطلوب')
    .isInt({ min: 1 }).withMessage('معرف اللون يجب أن يكون رقماً صحيحاً موجباً'),
  body('notes')
    .optional()
    .isString().withMessage('الملاحظات يجب أن تكون نصاً')
    .isLength({ max: 500 }).withMessage('الملاحظات يجب ألا تتجاوز 500 حرف')
];

/**
 * Validation rules for updating a ruler
 */
export const updateRulerRules = [
  body('ruler_type')
    .optional()
    .isIn(ALLOWED_RULER_TYPES).withMessage('نوع المسطرة غير صالح'),
  body('material_id')
    .optional()
    .isInt({ min: 1 }).withMessage('معرف المادة يجب أن يكون رقماً صحيحاً موجباً'),
  body('color_id')
    .optional()
    .isInt({ min: 1 }).withMessage('معرف اللون يجب أن يكون رقماً صحيحاً موجباً'),
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
  query('color_id')
    .optional()
    .isInt({ min: 1 }).withMessage('معرف اللون يجب أن يكون رقماً صحيحاً موجباً'),
  query('ruler_type')
    .optional()
    .isIn(ALLOWED_RULER_TYPES).withMessage('نوع المسطرة غير صالح')
];

