import { body } from "express-validator";
import { getCountryFromPhone } from "../utils/phoneCountry.js";

export const usernameValidator = body("username")
  .exists({ checkFalsy: true }).withMessage("اسم المستخدم مطلوب")
  .isString().withMessage("اسم المستخدم يجب أن يكون نصام")
  .isLength({ min: 4 }).withMessage("اسم المستخدم قصير للغاية");

export const passwordValidator = body("password")
  .exists({ checkFalsy: true }).withMessage("كلمة المرور مطلوبة")
  .isString().withMessage("كلمة المرور يجب أن تكون نصاً")
  .isLength({ min: 8 }).withMessage("كلمة المرور يجب أن تكون 8 أحرف على الأقل")
  .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]/)
  .withMessage("كلمة المرور يجب أن تحتوي على حرف كبير وصغير ورقم ورمز خاص");

export const phoneValidator = body("phone")
  .exists({ checkFalsy: true }).withMessage("رقم الهاتف مطلوب")
  .isString().withMessage("رقم الهاتف يجب أن يكون نصاً")
  .custom((value) => {
    if (!value || typeof value !== 'string') throw new Error("رقم الهاتف غير صالح");
    const trimmed = value.replace(/\s+/g, '').trim();
    if (!trimmed.startsWith('+')) {
      throw new Error("رقم الهاتف يجب أن يبدأ برمز الدولة (+)");
    }
    const info = getCountryFromPhone(trimmed);
    if (!info.success) {
      throw new Error(info.error || "رقم الهاتف غير صالح");
    }
    return true;
  });

export const loginUsernameValidator = body("username")
  .exists({ checkFalsy: true }).withMessage("بيانات تسجيل الدخول غير صحيحة")
  .isString().withMessage("بيانات تسجيل الدخول غير صحيحة")
  .isLength({ min: 4 }).withMessage("بيانات تسجيل الدخول غير صحيحة");

  export const loginPasswordValidator = body("password")
  .exists({ checkFalsy: true }).withMessage("بيانات تسجيل الدخول غير صحيحة")
  .isString().withMessage("بيانات تسجيل الدخول غير صحيحة")
  .isLength({ min: 6 }).withMessage("بيانات تسجيل الدخول غير صحيحة");

export const nameValidator = body("name")
  .optional()
  .isString().withMessage("الاسم يجب أن يكون نصاً")
  .isLength({ min: 2 }).withMessage("الاسم قصير جداً");
export const requiredName = body("name")
  .exists({ checkFalsy: true }).withMessage("الاسم مطلوب")
  .isString().withMessage("الاسم يجب أن يكون نصاً")
  .isLength({ min: 2 }).withMessage("الاسم قصير جداً");

export const TokenValidator = body("token")
  .exists({ checkFalsy: true }).withMessage("token مطلوب")
  .isString().withMessage("token يجب أن يكون نصاً");

export const refreshTokenValidator = body("refreshToken")
  .exists({ checkFalsy: true }).withMessage("Refresh token مطلوب")
  .isString().withMessage("Refresh token يجب أن يكون نصاً");

export const resetTokenValidator = body("resetToken")
  .exists({ checkFalsy: true }).withMessage("Reset token مطلوب")
  .isString().withMessage("Reset token يجب أن يكون نصاً");



// Forget Password Validators
export const forgotPasswordPhoneValidator = body("phone")
  .exists({ checkFalsy: true }).withMessage("رقم الهاتف مطلوب")
  .isString().withMessage("رقم الهاتف يجب أن يكون نصاً")
  .custom((value) => {
    if (!value || typeof value !== 'string') throw new Error("رقم الهاتف غير صالح");
    const trimmed = value.replace(/\s+/g, '').trim();
    if (!trimmed.startsWith('+')) {
      throw new Error("رقم الهاتف يجب أن يبدأ برمز الدولة (+)");
    }
    const info = getCountryFromPhone(trimmed);
    if (!info.success) {
      throw new Error(info.error || "رقم الهاتف غير صالح");
    }
    return true;
  });

export const otpValidator = body("otp")
  .exists({ checkFalsy: true }).withMessage("رمز التحقق مطلوب")
  .isString().withMessage("رمز التحقق يجب أن يكون نصاً")
  .isLength({ min: 6, max: 6 }).withMessage("رمز التحقق يجب أن يكون 6 أرقام")
  .matches(/^\d{6}$/).withMessage("رمز التحقق يجب أن يحتوي على أرقام فقط");

export const resetTokenValidatorBody = body("resetToken")
  .exists({ checkFalsy: true }).withMessage("رمز إعادة التعيين مطلوب")
  .isString().withMessage("رمز إعادة التعيين يجب أن يكون نصاً");

export const newPasswordValidator = body("newPassword")
  .exists({ checkFalsy: true }).withMessage("كلمة المرور الجديدة مطلوبة")
  .isString().withMessage("كلمة المرور يجب أن تكون نصاً")
  .isLength({ min: 8 }).withMessage("كلمة المرور يجب أن تكون 8 أحرف على الأقل")
  .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]/)
  .withMessage("كلمة المرور يجب أن تحتوي على حرف كبير وصغير ورقم ورمز خاص");

// Validation Rules Arrays
export const loginRules = [
  loginUsernameValidator,
  loginPasswordValidator
];

export const refreshRules = [refreshTokenValidator];
export const profileUpdateRules = [nameValidator, phoneValidator, usernameValidator];

export const forgotPasswordRules = [];//[forgotPasswordPhoneValidator];
export const verifyOTPRules = [];//[forgotPasswordPhoneValidator, otpValidator];
export const resetPasswordRules = [resetTokenValidatorBody, newPasswordValidator];
