import express from 'express';
import {
  login,
  refresh,
  validateToken,
  logout,
  logoutAll,
  getSessions,
  revokeSessionById,
  getProfile,
  updateProfile,
  requestPasswordReset,
  verifyOTP,
  resetPassword
} from '../controllers/auth.controller.js';
import {
  requireAuth,
  logRequest
} from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
  loginRules,
  refreshRules,
  TokenValidator,
  profileUpdateRules,
  forgotPasswordRules,
  verifyOTPRules,
  resetPasswordRules
} from '../validators/auth.validators.js';
import { normalizePhoneE164 } from '../middlewares/phone.middleware.js';
import { getstatususer } from '../controllers/auth.controller.js';

const router = express.Router();

// تطبيق middleware لتسجيل الطلبات على جميع المسارات
router.use(logRequest);

// مسارات المصادقة العامة (لا تتطلب مصادقة)
router.post('/login',  normalizePhoneE164, validate(loginRules), login);

router.post('/refresh',  validate(refreshRules), refresh);
router.post('/validate-token', validate(TokenValidator), validateToken);

// Forget Password Routes (لا تتطلب مصادقة)
router.post('/forgot-password', normalizePhoneE164, validate(forgotPasswordRules), requestPasswordReset);
router.post('/verify-otp', normalizePhoneE164, validate(verifyOTPRules), verifyOTP);
router.post('/reset-password', validate(resetPasswordRules), resetPassword);

// مسارات تتطلب مصادقة
router.use(requireAuth); // تطبيق middleware المصادقة على جميع المسارات التالية

// إدارة الجلسات
router.get('/active-user', getstatususer);
router.post('/logout', logout);
router.post('/logout-all', logoutAll);
router.get('/sessions', getSessions);
router.delete('/sessions/:sessionId', revokeSessionById);


// إدارة الملف الشخصي
router.get('/profile', getProfile);
router.put('/profile', validate(profileUpdateRules), updateProfile);

export default router;

