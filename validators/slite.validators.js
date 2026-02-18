import { body, param, query } from "express-validator";

const DESTINATIONS = ["slitting", "cutting", "production"];

/**
 * معرف Slite
 */
export const sliteIdParamRules = [
  param("id")
    .exists({ checkFalsy: true })
    .withMessage("معرف عملية Slite مطلوب")
    .isInt({ min: 1 })
    .withMessage("معرف Slite يجب أن يكون رقماً صحيحاً موجباً"),
];

/**
 * Query للحصول على عمليات Slite
 */
export const getSlitesQueryRules = [
  query("production_order_item_id")
    .optional()
    .isInt({ min: 1 })
    .withMessage("معرف عنصر أمر الإنتاج يجب أن يكون رقماً صحيحاً"),
];

/**
 * إنشاء Slite جديد
 */
export const createSliteRules = [
  body("production_order_item_id")
    .exists({ checkFalsy: true })
    .withMessage("معرف عنصر أمر الإنتاج مطلوب")
    .isInt({ min: 1 }),
  body("input_length")
    .exists({ checkFalsy: true })
    .withMessage("الطول الداخل مطلوب")
    .isDecimal(),
  body("output_length")
    .exists({ checkFalsy: true })
    .withMessage("الطول الخارج مطلوب")
    .isDecimal(),
  body("input_width")
    .exists({ checkFalsy: true })
    .withMessage("العرض الداخل مطلوب")
    .isDecimal(),
  body("output_length_22")
    .exists({ checkFalsy: true })
    .withMessage("الطول الخارج 22 مطلوب")
    .isDecimal(),
  body("output_length_44")
    .exists({ checkFalsy: true })
    .withMessage("الطول الخارج 44 مطلوب")
    .isDecimal(),
  body("barcode")
    .exists({ checkFalsy: true })
    .withMessage("الباركود مطلوب")
    .isString(),
  body("destination")
    .optional()
    .isIn(DESTINATIONS)
    .withMessage("الوجهة غير صالحة"),
  body("notes")
    .optional()
    .isString()
    .isLength({ max: 500 })
    .withMessage("الملاحظات يجب ألا تتجاوز 500 حرف"),
];

/**
 * تحديث Slite
 */
export const updateSliteRules = [
  body("input_length").optional().isDecimal(),
  body("output_length").optional().isDecimal(),
  body("input_width").optional().isDecimal(),
  body("output_length_22").optional().isDecimal(),
  body("output_length_44").optional().isDecimal(),
  body("barcode").optional().isString(),
  body("destination").optional().isIn(DESTINATIONS),
  body("notes").optional().isString().isLength({ max: 500 }),
];