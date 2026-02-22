// validators/color.validators.js
import { body, param, query } from 'express-validator';

/**
 * Validation rules for ruler ID parameter
 */
export const rulerIdParamRules = [
  param('id')
    .exists().withMessage('معرف المسطرة مطلوب')
    .isInt({ min: 1 }).withMessage('معرف المسطرة يجب أن يكون رقماً صحيحاً موجباً')
];

/**
 * Validation rules for creating a color
 */
export const createColorRules = [
  body('ruler_id')
    .exists({ checkFalsy: true }).withMessage('معرف المسطرة مطلوب')
    .isInt({ min: 1 }).withMessage('معرف المسطرة يجب أن يكون رقماً صحيحاً موجباً'),
  body('color_code')
    .exists({ checkFalsy: true }).withMessage('كود اللون مطلوب')
    .isString().withMessage('كود اللون يجب أن يكون نصاً')
    .isLength({ min: 1, max: 50 }).withMessage('كود اللون يجب أن يكون بين 1 و 50 حرف'),
  body('color_name')
    .exists({ checkFalsy: true }).withMessage('اسم اللون مطلوب')
    .isString().withMessage('اسم اللون يجب أن يكون نصاً')
    .isLength({ min: 2, max: 100 }).withMessage('اسم اللون يجب أن يكون بين 2 و 100 حرف'),
  body("imageUrl").custom((value, { req }) => {
    if (!req.file) {
      throw new Error("الصورة مطلوبة");
    }
    return true;
  }),
  body('notes')
    .optional()
    .isString().withMessage('الملاحظات يجب أن تكون نصاً')
    .isLength({ max: 500 }).withMessage('الملاحظات يجب ألا تتجاوز 500 حرف')
];

/**
 * Validation rules for updating a color
 */
export const updateColorRules = [
  body('color_id')
    .optional()
    .isInt({ min: 1 }).withMessage('معرف اللون يجب أن يكون رقماً صحيحاً موجباً'),
  body('color_code')
    .optional()
    .isString().withMessage('كود اللون يجب أن يكون نصاً')
    .isLength({ min: 1, max: 50 }).withMessage('كود اللون يجب أن يكون بين 1 و 50 حرف'),
  body('color_name')
    .optional()
    .isString().withMessage('اسم اللون يجب أن يكون نصاً')
    .isLength({ min: 2, max: 100 }).withMessage('اسم اللون يجب أن يكون بين 2 و 100 حرف'),
  body('imageUrl')
    .optional()
    .custom((value, { req }) => {
      if (req.file || value) {
        return true;
      }
      return true;
    }),
  body('notes')
    .optional()
    .isString().withMessage('الملاحظات يجب أن تكون نصاً')
    .isLength({ max: 500 }).withMessage('الملاحظات يجب ألا تتجاوز 500 حرف')
];

/**
 * Validation rules for color ID parameter
 */
export const colorIdParamRules = [
  param('id')
    .exists().withMessage('معرف اللون مطلوب')
    .isInt({ min: 1 }).withMessage('معرف اللون يجب أن يكون رقماً صحيحاً موجباً')
];

/**
 * Validation rules for getting colors with filters
 */
export const getColorsQueryRules = [
  query('ruler_id')
    .optional()
    .isInt({ min: 1 }).withMessage('معرف المسطرة يجب أن يكون رقماً صحيحاً موجباً'),
  query('search')
    .optional()
    .isString().withMessage('نص البحث يجب أن يكون نصاً')
];

