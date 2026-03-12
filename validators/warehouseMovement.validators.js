import { body, param, query } from "express-validator";

const DESTINATIONS = ["slitting", "cutting", "gluing", "production"];

/**
 * معرف حركة المخزن
 */
export const warehouseMovementIdParamRules = [
  param("id")
    .exists({ checkFalsy: true })
    .withMessage("معرف حركة المخزن مطلوب")
    .isInt({ min: 1 })
    .withMessage("معرف حركة المخزن يجب أن يكون رقماً صحيحاً موجباً"),
];

/**
 * Query للحصول على حركات المخزن
 */
export const getWarehouseMovementsQueryRules = [
  query("production_order_item_id")
    .optional()
    .isInt({ min: 1 })
    .withMessage("معرف عنصر أمر الإنتاج يجب أن يكون رقماً صحيحاً"),
  query("color_id")
    .optional()
    .isInt({ min: 1 })
    .withMessage("معرف اللون يجب أن يكون رقماً صحيحاً"),
  query("batch_id")
    .optional()
    .isInt({ min: 1 })
    .withMessage("معرف الدفعة يجب أن يكون رقماً صحيحاً"),
  query("destination")
    .optional()
    .isIn(DESTINATIONS)
    .withMessage("الوجهة غير صالحة"),
];

/**
 * إنشاء حركة مخزن جديدة
 */
export const createWarehouseMovementRules = [
  body("color_id")
    .exists({ checkFalsy: true })
    .withMessage("معرف اللون مطلوب")
    .isInt({ min: 1 })
    .withMessage("معرف اللون يجب أن يكون رقماً صحيحاً"),
  body("batch_id")
    .optional()
    .isInt({ min: 1 })
    .withMessage("معرف الدفعة يجب أن يكون رقماً صحيحاً"),
  body("quantity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("الكمية يجب أن تكون رقماً صحيحاً موجباً"),
  body("length")
    .exists({ checkFalsy: true })
    .withMessage("الطول مطلوب")
    .isDecimal()
    .withMessage("الطول يجب أن يكون رقماً عشرياً"),
  body("width")
    .exists({ checkFalsy: true })
    .withMessage("العرض مطلوب")
    .isDecimal()
    .withMessage("العرض يجب أن يكون رقماً عشرياً"),
  body("thickness")
    .exists({ checkFalsy: true })
    .withMessage("السماكة مطلوبة")
    .isDecimal()
    .withMessage("السماكة يجب أن تكون رقماً عشرياً"),
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
 * تحديث حركة مخزن
 */
export const updateWarehouseMovementRules = [
  body("quantity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("الكمية يجب أن تكون رقماً صحيحاً موجباً"),
  body("length")
    .optional()
    .isDecimal()
    .withMessage("الطول يجب أن يكون رقماً عشرياً"),
  body("width")
    .optional()
    .isDecimal()
    .withMessage("العرض يجب أن يكون رقماً عشرياً"),
  body("thickness")
    .optional()
    .isDecimal()
    .withMessage("السماكة يجب أن تكون رقماً عشرياً"),
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

export const allWarehouseMovementsarrayRules = [
  body("ids")
    .notEmpty()
    .withMessage("معرفات حركة المخزن مطلوبة")
    .isArray()
    .withMessage("معرفات حركة المخزن يجب أن تكون مصفوفة")
    .custom((value) => {
      if (value.length === 0) {
        throw new Error("معرفات حركة المخزن يجب أن تحتوي على عنصر واحد على الأقل");
      }
      return true;
    }),
];

