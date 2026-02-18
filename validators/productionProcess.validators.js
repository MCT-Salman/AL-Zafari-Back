import { body, param, query } from 'express-validator';

/**
 * قواعد التحقق من معرف عملية الإنتاج
 */
export const productionProcessIdParamRules = [
  param('id')
    .exists({ checkFalsy: true })
    .withMessage('معرف عملية الإنتاج مطلوب')
    .isInt({ min: 1 })
    .withMessage('معرف عملية الإنتاج يجب أن يكون رقماً صحيحاً موجباً'),
];

/**
 * قواعد التحقق من جلب العمليات
 */
export const getProductionProcessesQueryRules = [
  query('production_order_item_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('معرف عنصر أمر الإنتاج يجب أن يكون رقماً صحيحاً'),
];

/**
 * قواعد التحقق من إنشاء عملية إنتاج
 */
export const createProductionProcessRules = [
  body('production_order_item_id')
    .exists({ checkFalsy: true })
    .withMessage('معرف عنصر أمر الإنتاج مطلوب')
    .isInt({ min: 1 })
    .withMessage('معرف عنصر أمر الإنتاج يجب أن يكون رقماً صحيحاً'),

  body('input_length')
    .exists({ checkFalsy: true })
    .withMessage('طول الإدخال مطلوب')
    .isDecimal()
    .withMessage('طول الإدخال يجب أن يكون رقماً عشرياً'),

  body('output_length')
    .exists({ checkFalsy: true })
    .withMessage('طول الإخراج مطلوب')
    .isDecimal()
    .withMessage('طول الإخراج يجب أن يكون رقماً عشرياً'),

  body('input_width')
    .exists({ checkFalsy: true })
    .withMessage('عرض الإدخال مطلوب')
    .isDecimal()
    .withMessage('عرض الإدخال يجب أن يكون رقماً عشرياً'),

  body('waste')
    .optional()
    .isDecimal()
    .withMessage('الهدر يجب أن يكون رقماً عشرياً'),

  body('barcode')
    .exists({ checkFalsy: true })
    .withMessage('الباركود مطلوب')
    .isString()
    .isLength({ max: 191 })
    .withMessage('الباركود يجب ألا يتجاوز 191 حرف'),

  body('notes')
    .optional()
    .isString()
    .isLength({ max: 500 })
    .withMessage('الملاحظات يجب ألا تتجاوز 500 حرف'),
];

/**
 * قواعد التحقق من تحديث عملية إنتاج
 */
export const updateProductionProcessRules = [
  body('input_length').optional().isDecimal(),
  body('output_length').optional().isDecimal(),
  body('input_width').optional().isDecimal(),
  body('waste').optional().isDecimal(),
  body('barcode')
    .optional()
    .isString()
    .isLength({ max: 191 }),
  body('notes')
    .optional()
    .isString()
    .isLength({ max: 500 }),
];