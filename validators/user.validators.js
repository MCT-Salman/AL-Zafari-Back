import { body, param, query } from 'express-validator';
import { usernameValidator, phoneValidator, passwordValidator } from './auth.validators.js';
import { getCountryFromPhone } from '../utils/phoneCountry.js';

// Allowed user roles
const ALLOWED_ROLES = [
  'admin',
  'accountant',
  'sales',
  'Warehouse_Keeper',
  'Warehouse_Products',
  'Dissection_Technician',
  'Cutting_Technician',
  'Gluing_Technician'
];

/**
 * Validation rules for creating a new user (Admin only)
 */
export const createUserRules = [
  usernameValidator,
  phoneValidator,
  passwordValidator,
  body('full_name')
    .exists({ checkFalsy: true }).withMessage('الاسم الكامل مطلوب')
    .isString().withMessage('الاسم الكامل يجب أن يكون نصاً')
    .isLength({ min: 2, max: 100 }).withMessage('الاسم الكامل يجب أن يكون بين 2 و 100 حرف'),
  body('role')
    .optional()
    .isIn(ALLOWED_ROLES).withMessage('الدور المحدد غير صالح'),
  body('notes')
    .optional()
    .isString().withMessage('الملاحظات يجب أن تكون نصاً')
    .isLength({ max: 500 }).withMessage('الملاحظات يجب ألا تتجاوز 500 حرف')
];

/**
 * Validation rules for updating a user (Admin only)
 */
export const updateUserRules = [
  body('username')
    .optional()
    .isString().withMessage('اسم المستخدم يجب أن يكون نصاً')
    .isLength({ min: 6, max: 50 }).withMessage('اسم المستخدم يجب أن يكون بين 6 و 50 حرف'),
  body('phone')
    .optional()
    .isString().withMessage('رقم الهاتف يجب أن يكون نصاً')
    .custom((value) => {
      if (!value || typeof value !== 'string') throw new Error('رقم الهاتف غير صالح');
      const trimmed = value.replace(/\s+/g, '').trim();
      if (!trimmed.startsWith('+')) {
        throw new Error('رقم الهاتف يجب أن يبدأ برمز الدولة (+)');
      }
      const info = getCountryFromPhone(trimmed);
      if (!info.success) {
        throw new Error(info.error || 'رقم الهاتف غير صالح');
      }
      return true;
    }),
  body('password')
    .optional()
    .isString().withMessage('كلمة المرور يجب أن تكون نصاً')
    .isLength({ min: 8 }).withMessage('كلمة المرور يجب أن تكون 8 أحرف على الأقل')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]/)
    .withMessage('كلمة المرور يجب أن تحتوي على حرف كبير وصغير ورقم ورمز خاص'),
  body('full_name')
    .optional()
    .isString().withMessage('الاسم الكامل يجب أن يكون نصاً')
    .isLength({ min: 2, max: 100 }).withMessage('الاسم الكامل يجب أن يكون بين 2 و 100 حرف'),
  body('role')
    .optional()
    .isIn(ALLOWED_ROLES).withMessage('الدور المحدد غير صالح'),
  body('is_active')
    .optional()
    .isBoolean().withMessage('حالة التفعيل يجب أن تكون true أو false'),
  body('notes')
    .optional()
    .isString().withMessage('الملاحظات يجب أن تكون نصاً')
    .isLength({ max: 500 }).withMessage('الملاحظات يجب ألا تتجاوز 500 حرف')
];

/**
 * Validation rules for user ID parameter
 */
export const userIdParamRules = [
  param('id')
    .exists().withMessage('معرف المستخدم مطلوب')
    .isInt({ min: 1 }).withMessage('معرف المستخدم يجب أن يكون رقماً صحيحاً موجباً')
];

/**
 * Validation rules for getting all users with filters
 */
export const getUsersQueryRules = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('رقم الصفحة يجب أن يكون رقماً صحيحاً موجباً'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('عدد العناصر يجب أن يكون بين 1 و 100'),
  query('search')
    .optional()
    .isString().withMessage('نص البحث يجب أن يكون نصاً')
    .isLength({ max: 100 }).withMessage('نص البحث يجب ألا يتجاوز 100 حرف'),
  query('role')
    .optional()
    .isIn(ALLOWED_ROLES).withMessage('الدور المحدد غير صالح'),
  query('isActive')
    .optional()
    .isIn(['true', 'false']).withMessage('حالة التفعيل يجب أن تكون true أو false')
];

// Legacy exports for backward compatibility
export const adminCreateUserRules = createUserRules;
export const adminUpdateUserRules = updateUserRules;
