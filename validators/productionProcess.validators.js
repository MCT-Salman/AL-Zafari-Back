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
  query('color_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('معرف اللون يجب أن يكون رقماً صحيحاً'),
  query('batch_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('معرف الطبخة يجب أن يكون رقماً صحيحاً'),
  query('type')
    .optional()
    .isIn(['cutting', 'gluing'])
    .withMessage('نوع العملية غير صحيح'),
  query('source')
    .optional()
    .isIn(['warehouse', 'slitting', 'cutting', 'production'])
    .withMessage('المصدر غير صحيح'),
  query('type_item')
    .optional()
    .isIn(['Presser', 'Machine'])
    .withMessage('نوع العنصر غير صحيح'),
];

/**
 * قواعد التحقق من إنشاء عملية إنتاج
 */
export const createProductionProcessRules = [
  body('color_id')
    .exists({ checkFalsy: true })
    .withMessage('معرف اللون مطلوب')
    .isInt({ min: 1 })
    .withMessage('معرف اللون يجب أن يكون رقماً صحيحاً'),

  body('batch_id')
    .exists({ checkFalsy: true })
    .withMessage('معرف الطبخة مطلوب')
    .isInt({ min: 1 })
    .withMessage('معرف الطبخة يجب أن يكون رقماً صحيحاً'),

  body('type_item')
    .optional()
    .isIn(['Presser', 'Machine'])
    .withMessage('نوع العنصر غير صحيح'),

  body('input_length')
    .exists({ checkFalsy: true })
    .withMessage('طول الإدخال مطلوب')
    .isDecimal()
    .withMessage('طول الإدخال يجب أن يكون رقماً عشرياً'),

  body('output_length')
    .exists({ checkFalsy: true })
    .withMessage('طول الإخراج مطلوب')
    .isString()
    .withMessage('طول الإخراج مطلوب'),

  body('input_width')
    .exists({ checkFalsy: true })
    .withMessage('عرض الإدخال مطلوب')
    .isDecimal()
    .withMessage('عرض الإدخال يجب أن يكون رقماً عشرياً'),

  body('waste')
    .optional()
    .isDecimal()
    .withMessage('الهدر يجب أن يكون رقماً عشرياً'),

  body('type')
    .exists({ checkFalsy: true })
    .withMessage('نوع العملية مطلوب')
    .isIn(['cutting', 'gluing'])
    .withMessage('نوع العملية غير صحيح (cutting أو gluing فقط)'),

  body('source')
    .optional()
    .isIn(['warehouse', 'slitting', 'cutting', 'production'])
    .withMessage('المصدر غير صحيح'),

  body('destination')
    .optional()
    .isIn(['slitting', 'cutting', 'gluing', 'production'])
    .withMessage('الوجهة غير صالحة'),

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
  body('color_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('معرف اللون يجب أن يكون رقماً صحيحاً'),
  body('batch_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('معرف الطبخة يجب أن يكون رقماً صحيحاً'),
  body('input_length').optional().isDecimal().withMessage('طول الإدخال يجب أن يكون رقماً عشريام'),
  body('output_length').optional().isString().withMessage('طول الإخراج يجب أن يكون نصام'),
  body('input_width').optional().isDecimal().withMessage('عرض الإدخال يجب أن يكون رقماً عشريام'),
  body('waste').optional().isDecimal().withMessage('الهدر يجب أن يكون رقماً عشريام'),
  body('type_item')
    .optional()
    .isIn(['Presser', 'Machine']),
  body('source')
    .optional()
    .isIn(['warehouse', 'slitting', 'cutting', 'production']),
  body('destination')
    .optional()
    .isIn(['slitting', 'cutting', 'gluing', 'production']),
  body('notes')
    .optional()
    .isString()
    .withMessage('الملاحظات يجب أن تكون نصام')
    .isLength({ max: 500 }),
];

export const allProductionProcessesarrayRules = [
  body("ids")
    .notEmpty()
    .withMessage("معرفات عملية الإنتاج مطلوبة")
    .isArray()
    .withMessage("معرفات عملية الإنتاج يجب أن تكون مصفوفة")
    .custom((value) => {
      if (value.length === 0) {
        throw new Error("معرفات عملية الإنتاج يجب أن تحتوي على عنصر واحد على الأقل");
      }
      return true;
    }),
];

export const productionProcessTypeParamRules = [
  param('type')
    .exists({ checkFalsy: true })
    .withMessage('نوع العملية مطلوب')
    .isIn(['cutting', 'gluing'])
    .withMessage('نوع العملية غير صحيح (قص أو تغرية فقط)'),
];
