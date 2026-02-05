// validators/material.validators.js
import { body, param, query } from 'express-validator';

// Allowed material types
const ALLOWED_MATERIAL_TYPES = ['Role', 'Blanck'];

/**
 * Validation rules for creating a material
 */
export const createMaterialRules = [
  body('material_name')
    .exists({ checkFalsy: true }).withMessage('اسم المادة مطلوب')
    .isString().withMessage('اسم المادة يجب أن يكون نصاً')
    .isLength({ min: 2, max: 100 }).withMessage('اسم المادة يجب أن يكون بين 2 و 100 حرف'),
  body('type')
    .exists({ checkFalsy: true }).withMessage('نوع المادة مطلوب')
    .isIn(ALLOWED_MATERIAL_TYPES).withMessage('نوع المادة غير صالح'),
  body('constant_height_id')
    .optional()
    .isInt({ min: 1 }).withMessage('معرف الارتفاع الثابت يجب أن يكون رقماً صحيحاً موجباً'),
  body('constant_width_id')
    .optional()
    .isInt({ min: 1 }).withMessage('معرف العرض الثابت يجب أن يكون رقماً صحيحاً موجباً'),
  body('constant_thickness_id')
    .optional()
    .isInt({ min: 1 }).withMessage('معرف السماكة الثابتة يجب أن يكون رقماً صحيحاً موجباً'),
  body('constant_value_unit')
    .optional()
    .isString().withMessage('وحدة القيمة الثابتة يجب أن تكون نصاً')
    .isLength({ max: 50 }).withMessage('وحدة القيمة الثابتة يجب ألا تتجاوز 50 حرف'),
  body('notes')
    .optional()
    .isString().withMessage('الملاحظات يجب أن تكون نصاً')
    .isLength({ max: 500 }).withMessage('الملاحظات يجب ألا تتجاوز 500 حرف')
];

/**
 * Validation rules for updating a material
 */
export const updateMaterialRules = [
  body('material_name')
    .optional()
    .isString().withMessage('اسم المادة يجب أن يكون نصاً')
    .isLength({ min: 2, max: 100 }).withMessage('اسم المادة يجب أن يكون بين 2 و 100 حرف'),
  body('type')
    .optional()
    .isIn(ALLOWED_MATERIAL_TYPES).withMessage('نوع المادة غير صالح'),
  body('constant_height_id')
    .optional()
    .isInt({ min: 1 }).withMessage('معرف الارتفاع الثابت يجب أن يكون رقماً صحيحاً موجباً'),
  body('constant_width_id')
    .optional()
    .isInt({ min: 1 }).withMessage('معرف العرض الثابت يجب أن يكون رقماً صحيحاً موجباً'),
  body('constant_thickness_id')
    .optional()
    .isInt({ min: 1 }).withMessage('معرف السماكة الثابتة يجب أن يكون رقماً صحيحاً موجباً'),
  body('constant_value_unit')
    .optional()
    .isString().withMessage('وحدة القيمة الثابتة يجب أن تكون نصاً')
    .isLength({ max: 50 }).withMessage('وحدة القيمة الثابتة يجب ألا تتجاوز 50 حرف'),
  body('notes')
    .optional()
    .isString().withMessage('الملاحظات يجب أن تكون نصاً')
    .isLength({ max: 500 }).withMessage('الملاحظات يجب ألا تتجاوز 500 حرف')
];

/**
 * Validation rules for material ID parameter
 */
export const materialIdParamRules = [
  param('id')
    .exists().withMessage('معرف المادة مطلوب')
    .isInt({ min: 1 }).withMessage('معرف المادة يجب أن يكون رقماً صحيحاً موجباً')
];

/**
 * Validation rules for getting materials with filters
 */
export const getMaterialsQueryRules = [
  query('type')
    .optional()
    .isIn(ALLOWED_MATERIAL_TYPES).withMessage('نوع المادة غير صالح'),
  query('search')
    .optional()
    .isString().withMessage('نص البحث يجب أن يكون نصاً')
];

