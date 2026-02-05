// validators/constantType.validators.js
import { body, param, query } from 'express-validator';

// Allowed constant types
const ALLOWED_CONSTANT_TYPES = ['width', 'height', 'thickness', 'type_order', 'source_order'];

/**
 * Validation rules for creating a constant type
 */
export const createConstantTypeRules = [
  body('constants_Type_name')
    .exists({ checkFalsy: true }).withMessage('اسم النوع الثابت مطلوب')
    .isString().withMessage('اسم النوع الثابت يجب أن يكون نصاً')
    .isLength({ min: 2, max: 100 }).withMessage('اسم النوع الثابت يجب أن يكون بين 2 و 100 حرف'),
  body('type')
    .exists({ checkFalsy: true }).withMessage('نوع الثابت مطلوب')
    .isIn(ALLOWED_CONSTANT_TYPES).withMessage('نوع الثابت غير صالح'),
  body('notes')
    .optional()
    .isString().withMessage('الملاحظات يجب أن تكون نصاً')
    .isLength({ max: 500 }).withMessage('الملاحظات يجب ألا تتجاوز 500 حرف')
];

/**
 * Validation rules for updating a constant type
 */
export const updateConstantTypeRules = [
  body('constants_Type_name')
    .optional()
    .isString().withMessage('اسم النوع الثابت يجب أن يكون نصاً')
    .isLength({ min: 2, max: 100 }).withMessage('اسم النوع الثابت يجب أن يكون بين 2 و 100 حرف'),
  body('type')
    .optional()
    .isIn(ALLOWED_CONSTANT_TYPES).withMessage('نوع الثابت غير صالح'),
  body('notes')
    .optional()
    .isString().withMessage('الملاحظات يجب أن تكون نصاً')
    .isLength({ max: 500 }).withMessage('الملاحظات يجب ألا تتجاوز 500 حرف')
];

/**
 * Validation rules for constant type ID parameter
 */
export const constantTypeIdParamRules = [
  param('id')
    .exists().withMessage('معرف النوع الثابت مطلوب')
    .isInt({ min: 1 }).withMessage('معرف النوع الثابت يجب أن يكون رقماً صحيحاً موجباً')
];

/**
 * Validation rules for getting constant types with filters
 */
export const getConstantTypesQueryRules = [
  query('type')
    .optional()
    .isIn(ALLOWED_CONSTANT_TYPES).withMessage('نوع الثابت غير صالح'),
  query('search')
    .optional()
    .isString().withMessage('نص البحث يجب أن يكون نصاً')
];

