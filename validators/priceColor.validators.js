// validators/priceColor.validators.js
import { body, param, query } from 'express-validator';

// Allowed price color by types
const ALLOWED_PRICE_COLOR_BY = ['isByMeter22', 'isByMeter44', 'isByMeter66', 'isByBlanck'];

/**
 * Validation rules for creating a price color
 */
export const createPriceColorRules = [
  body('color_id')
    .exists({ checkFalsy: true }).withMessage('معرف اللون مطلوب')
    .isInt({ min: 1 }).withMessage('معرف اللون يجب أن يكون رقماً صحيحاً موجباً'),
  body('constant_value_id')
    .exists({ checkFalsy: true }).withMessage('معرف القيمة الثابتة مطلوب')
    .isInt({ min: 1 }).withMessage('معرف القيمة الثابتة يجب أن يكون رقماً صحيحاً موجباً'),
  body('price_color_By')
    .exists({ checkFalsy: true }).withMessage('نوع السعر مطلوب')
    .isIn(ALLOWED_PRICE_COLOR_BY).withMessage('نوع السعر غير صالح'),
  body('price_per_meter')
    .exists({ checkFalsy: true }).withMessage('السعر لكل متر مطلوب')
    .isDecimal().withMessage('السعر لكل متر يجب أن يكون رقماً عشرياً')
    .custom((value) => parseFloat(value) >= 0).withMessage('السعر لكل متر يجب أن يكون موجباً'),
  body('notes')
    .optional()
    .isString().withMessage('الملاحظات يجب أن تكون نصاً')
    .isLength({ max: 500 }).withMessage('الملاحظات يجب ألا تتجاوز 500 حرف')
];

/**
 * Validation rules for updating a price color
 */
export const updatePriceColorRules = [
  body('color_id')
    .optional()
    .isInt({ min: 1 }).withMessage('معرف اللون يجب أن يكون رقماً صحيحاً موجباً'),
  body('constant_value_id')
    .optional()
    .isInt({ min: 1 }).withMessage('معرف القيمة الثابتة يجب أن يكون رقماً صحيحاً موجباً'),
  body('price_color_By')
    .optional()
    .isIn(ALLOWED_PRICE_COLOR_BY).withMessage('نوع السعر غير صالح'),
  body('price_per_meter')
    .optional()
    .isDecimal().withMessage('السعر لكل متر يجب أن يكون رقماً عشرياً')
    .custom((value) => parseFloat(value) >= 0).withMessage('السعر لكل متر يجب أن يكون موجباً'),
  body('notes')
    .optional()
    .isString().withMessage('الملاحظات يجب أن تكون نصاً')
    .isLength({ max: 500 }).withMessage('الملاحظات يجب ألا تتجاوز 500 حرف')
];

/**
 * Validation rules for price color ID parameter
 */
export const priceColorIdParamRules = [
  param('id')
    .exists().withMessage('معرف سعر اللون مطلوب')
    .isInt({ min: 1 }).withMessage('معرف سعر اللون يجب أن يكون رقماً صحيحاً موجباً')
];

/**
 * Validation rules for getting price colors with filters
 */
export const getPriceColorsQueryRules = [
  query('color_id')
    .optional()
    .isInt({ min: 1 }).withMessage('معرف اللون يجب أن يكون رقماً صحيحاً موجباً'),
  query('constant_value_id')
    .optional()
    .isInt({ min: 1 }).withMessage('معرف القيمة الثابتة يجب أن يكون رقماً صحيحاً موجباً'),
  query('price_color_By')
    .optional()
    .isIn(ALLOWED_PRICE_COLOR_BY).withMessage('نوع السعر غير صالح')
];

