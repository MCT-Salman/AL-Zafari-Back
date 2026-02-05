// validators/batch.validators.js
import { body, param, query } from 'express-validator';

/**
 * Validation rules for creating a batch
 */
export const createBatchRules = [
  body('batch_number')
    .exists({ checkFalsy: true }).withMessage('رقم الطبخة مطلوب')
    .isString().withMessage('رقم الطبخة يجب أن يكون نصاً')
    .isLength({ min: 1, max: 100 }).withMessage('رقم الطبخة يجب أن يكون بين 1 و 100 حرف'),
  body('entry_date')
    .exists({ checkFalsy: true }).withMessage('تاريخ الدخول مطلوب')
    .isISO8601().withMessage('تاريخ الدخول يجب أن يكون تاريخاً صالحاً'),
  body('material_id')
    .exists({ checkFalsy: true }).withMessage('معرف المادة مطلوب')
    .isInt({ min: 1 }).withMessage('معرف المادة يجب أن يكون رقماً صحيحاً موجباً'),
  body('notes')
    .optional()
    .isString().withMessage('الملاحظات يجب أن تكون نصاً')
    .isLength({ max: 500 }).withMessage('الملاحظات يجب ألا تتجاوز 500 حرف')
];

/**
 * Validation rules for updating a batch
 */
export const updateBatchRules = [
  body('batch_number')
    .optional()
    .isString().withMessage('رقم الطبخة يجب أن يكون نصاً')
    .isLength({ min: 1, max: 100 }).withMessage('رقم الطبخة يجب أن يكون بين 1 و 100 حرف'),
  body('entry_date')
    .optional()
    .isISO8601().withMessage('تاريخ الدخول يجب أن يكون تاريخاً صالحاً'),
  body('material_id')
    .optional()
    .isInt({ min: 1 }).withMessage('معرف المادة يجب أن يكون رقماً صحيحاً موجباً'),
  body('notes')
    .optional()
    .isString().withMessage('الملاحظات يجب أن تكون نصاً')
    .isLength({ max: 500 }).withMessage('الملاحظات يجب ألا تتجاوز 500 حرف')
];

/**
 * Validation rules for batch ID parameter
 */
export const batchIdParamRules = [
  param('id')
    .exists().withMessage('معرف الطبخة مطلوب')
    .isInt({ min: 1 }).withMessage('معرف الطبخة يجب أن يكون رقماً صحيحاً موجباً')
];

/**
 * Validation rules for getting batches with filters
 */
export const getBatchesQueryRules = [
  query('material_id')
    .optional()
    .isInt({ min: 1 }).withMessage('معرف المادة يجب أن يكون رقماً صحيحاً موجباً'),
  query('search')
    .optional()
    .isString().withMessage('نص البحث يجب أن يكون نصاً')
];

