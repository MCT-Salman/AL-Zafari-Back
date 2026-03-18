import { body, param, query } from "express-validator";

const DESTINATIONS = ["slitting", "cutting", "gluing", "production"];
const SOURCES = ["warehouse", "slitting", "cutting", "production"];
const TYPE_ITEMS = ["Presser", "Machine"];

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
  query("color_id")
    .optional()
    .isInt({ min: 1 })
    .withMessage("معرف اللون يجب أن يكون رقماً صحيحاً"),
  query("batch_id")
    .optional()
    .isInt({ min: 1 })
    .withMessage("معرف الطبخة يجب أن يكون رقماً صحيحاً"),
  query("destination")
    .optional()
    .isIn(DESTINATIONS)
    .withMessage("الوجهة غير صحيحة"),
  query("source")
    .optional()
    .isIn(SOURCES)
    .withMessage("المصدر غير صحيح"),
  query("type_item")
    .optional()
    .isIn(TYPE_ITEMS)
    .withMessage("نوع العنصر غير صحيح"),
];

/**
 * إنشاء Slite جديد
 */
export const createSliteRules = [
  body("color_id")
    .exists({ checkFalsy: true })
    .withMessage("معرف اللون مطلوب")
    .isInt({ min: 1 })
    .withMessage("معرف اللون يجب أن يكون رقماً صحيحاً"),
  body("batch_id")
    .exists({ checkFalsy: true })
    .withMessage("معرف الطبخة مطلوب")
    .isInt({ min: 1 })
    .withMessage("معرف الطبخة يجب أن يكون رقماً صحيحاً"),
  body("type_item")
    .optional()
    .isIn(TYPE_ITEMS)
    .withMessage("نوع العنصر غير صحيح"),
  body("input_length")
    .optional()
    .isDecimal()
    .withMessage("طول الإدخال يجب أن يكون رقماً عشريام"),
  body("output_length")
    .exists({ checkFalsy: true })
    .withMessage("الطول الخارج مطلوب")
    .isString()
    .withMessage("الطول الخارج يجب أن يكون رقماً عشريام"),
  body("input_width")
    .exists({ checkFalsy: true })
    .withMessage("العرض الداخل مطلوب")
    .isDecimal()
    .withMessage("العرض الداخل يجب أن يكون رقماً عشريام"),
  body("output_length_22")
    .optional()
    .isDecimal()
    .withMessage("الطول الخارج 22 يجب أن يكون رقماً عشريام"),
  body("output_length_44")
    .optional()
    .isDecimal()
    .withMessage("الطول الخارج 44 يجب أن يكون رقماً عشريام"),
  body("source")
    .optional()
    .isIn(SOURCES)
    .withMessage("المصدر غير صحيح"),
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
  body("color_id")
    .optional()
    .isInt({ min: 1 })
    .withMessage("معرف اللون يجب أن يكون رقماً صحيحاً"),
  body("batch_id")
    .optional()
    .isInt({ min: 1 })
    .withMessage("معرف الطبخة يجب أن يكون رقماً صحيحاً"),
  body("input_length").optional().isDecimal().withMessage("طول الإدخال يجب أن يكون رقماً عشريام"),
  body("output_length").optional().isDecimal().withMessage("الطول الخارج يجب أن يكون رقماً عشريام"),
  body("input_width").optional().isString().withMessage("العرض الداخل يجب أن يكون رقماً عشريام"),
  body("type_item").optional().isIn(TYPE_ITEMS).withMessage("نوع العنصر غير صحيح"),
  body("output_length_22").optional().isDecimal().withMessage("الطول الخارج 22 يجب أن يكون رقماً عشريام"),
  body("output_length_44").optional().isDecimal().withMessage("الطول الخارج 44 يجب أن يكون رقماً عشريام"),
  body("source").optional().isIn(SOURCES).withMessage("المصدر غير صحيح"),
  body("destination").optional().isIn(DESTINATIONS).withMessage("الوجهة غير صالحة"),
  body("notes").optional().isString().withMessage("الملاحظات يجب أن تكون نصام").isLength({ max: 500 }),
];

export const allSlitesarrayRules = [
  body("ids")
    .notEmpty()
    .withMessage("معرفات عملية Slite مطلوبة")
    .isArray()
    .withMessage("معرفات عملية Slite يجب أن تكون مصفوفة")
    .custom((value) => {
      if (value.length === 0) {
        throw new Error("معرفات عملية Slite يجب أن تحتوي على عنصر واحد على الأقل");
      }
      return true;
    }),
];
