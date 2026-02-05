// validators/setting.validators.js
import { body, param, query } from "express-validator";

/**
 * Validation rules for creating a setting
 */
export const createSettingRules = [
  body("key")
    .exists({ checkFalsy: true })
    .withMessage("المفتاح مطلوب")
    .isString()
    .withMessage("المفتاح يجب أن يكون نصاً")
    .isLength({ min: 2, max: 100 })
    .withMessage("المفتاح يجب أن يكون بين 2 و 100 حرف")
    .matches(/^[a-zA-Z0-9_.-]+$/)
    .withMessage("المفتاح يجب أن يحتوي على أحرف وأرقام و _ و . و - فقط"),
  body("value")
    .exists({ checkFalsy: true })
    .withMessage("القيمة مطلوبة")
    .isString()
    .withMessage("القيمة يجب أن تكون نصاً"),
  body("description")
    .exists({ checkFalsy: true })
    .withMessage("الوصف مطلوب")
    .isString()
    .withMessage("الوصف يجب أن يكون نصاً")
    .isLength({ min: 5, max: 255 })
    .withMessage("الوصف يجب أن يكون بين 5 و 255 حرف"),
];

/**
 * Validation rules for updating a setting
 */
export const updateSettingRules = [
  body("key")
    .optional()
    .isString()
    .withMessage("المفتاح يجب أن يكون نصاً")
    .isLength({ min: 2, max: 100 })
    .withMessage("المفتاح يجب أن يكون بين 2 و 100 حرف")
    .matches(/^[a-zA-Z0-9_.-]+$/)
    .withMessage("المفتاح يجب أن يحتوي على أحرف وأرقام و _ و . و - فقط"),
  body("value")
    .optional()
    .isString()
    .withMessage("القيمة يجب أن تكون نصاً"),
  body("description")
    .optional()
    .isString()
    .withMessage("الوصف يجب أن يكون نصاً")
    .isLength({ min: 5, max: 255 })
    .withMessage("الوصف يجب أن يكون بين 5 و 255 حرف"),
];

/**
 * Validation rules for upsert setting
 */
export const upsertSettingRules = [
  body("value")
    .exists({ checkFalsy: true })
    .withMessage("القيمة مطلوبة")
    .isString()
    .withMessage("القيمة يجب أن تكون نصاً"),
  body("description")
    .exists({ checkFalsy: true })
    .withMessage("الوصف مطلوب")
    .isString()
    .withMessage("الوصف يجب أن يكون نصاً")
    .isLength({ min: 5, max: 255 })
    .withMessage("الوصف يجب أن يكون بين 5 و 255 حرف"),
];

/**
 * Validation rules for setting ID parameter
 */
export const settingIdParamRules = [
  param("id")
    .exists()
    .withMessage("معرف الإعداد مطلوب")
    .isInt({ min: 1 })
    .withMessage("معرف الإعداد يجب أن يكون رقماً صحيحاً موجباً"),
];

/**
 * Validation rules for setting key parameter
 */
export const settingKeyParamRules = [
  param("key")
    .exists()
    .withMessage("مفتاح الإعداد مطلوب")
    .isString()
    .withMessage("مفتاح الإعداد يجب أن يكون نصاً")
    .matches(/^[a-zA-Z0-9_.-]+$/)
    .withMessage("المفتاح يجب أن يحتوي على أحرف وأرقام و _ و . و - فقط"),
];

/**
 * Validation rules for getting settings with filters
 */
export const getSettingsQueryRules = [
  query("search")
    .optional()
    .isString()
    .withMessage("نص البحث يجب أن يكون نصاً"),
];

