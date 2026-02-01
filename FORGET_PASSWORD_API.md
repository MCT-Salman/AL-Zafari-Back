# 🔐 Forget Password API Documentation

## نظام استعادة كلمة المرور (Forget Password)

تم إنشاء نظام كامل لاستعادة كلمة المرور باستخدام OTP (One-Time Password) مع جميع ميزات الحماية.

---

## 🔄 Flow Diagram

```
1. المستخدم يطلب إعادة تعيين كلمة المرور (يدخل رقم الهاتف)
   ↓
2. النظام يرسل OTP (6 أرقام) صالح لمدة 10 دقائق
   ↓
3. المستخدم يدخل OTP للتحقق
   ↓
4. النظام يتحقق من OTP ويعطي Reset Token
   ↓
5. المستخدم يدخل كلمة المرور الجديدة مع Reset Token
   ↓
6. النظام يحدث كلمة المرور ويلغي جميع الجلسات
```

---

## 📋 API Endpoints

### 1. Request Password Reset (طلب إعادة تعيين كلمة المرور)

**POST** `/auth/forgot-password`

**Description:** إرسال OTP إلى رقم هاتف المستخدم

**Request Body:**
```json
{
  "phone": "+966501234567"
}
```

**Required Fields:**
- `phone`: رقم الهاتف بصيغة دولية (يبدأ بـ +)

**Response (Success):**
```json
{
  "success": true,
  "message": "تم إرسال رمز التحقق إلى رقم هاتفك",
  "data": {
    "expiresIn": 600
  }
}
```

**Response (Error - User Not Found):**
```json
{
  "success": false,
  "message": "المستخدم غير موجود",
  "data": {}
}
```

**Response (Error - Rate Limit):**
```json
{
  "success": false,
  "message": "يرجى الانتظار 120 ثانية قبل طلب رمز جديد",
  "data": {}
}
```

**Notes:**
- ✅ OTP صالح لمدة 10 دقائق
- ✅ يمكن طلب OTP جديد بعد دقيقتين من الطلب السابق
- ✅ يتم تسجيل IP و User Agent لكل طلب
- ⚠️ في الإنتاج، يجب إرسال OTP عبر SMS (حالياً يتم تسجيله في الـ logs)

**Example:**
```bash
curl -X POST "http://localhost:3000/auth/forgot-password" \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+966501234567"
  }'
```

---

### 2. Verify OTP (التحقق من رمز OTP)

**POST** `/auth/verify-otp`

**Description:** التحقق من صحة OTP والحصول على Reset Token

**Request Body:**
```json
{
  "phone": "+966501234567",
  "otp": "123456"
}
```

**Required Fields:**
- `phone`: رقم الهاتف بصيغة دولية
- `otp`: رمز التحقق المكون من 6 أرقام

**Response (Success):**
```json
{
  "success": true,
  "message": "تم التحقق من الرمز بنجاح",
  "data": {
    "resetToken": "+966501234567:a1b2c3d4e5f6....:1738419600000"
  }
}
```

**Response (Error - Invalid OTP):**
```json
{
  "success": false,
  "message": "رمز التحقق غير صحيح أو منتهي الصلاحية",
  "data": {}
}
```

**Response (Error - Max Attempts):**
```json
{
  "success": false,
  "message": "تم تجاوز الحد الأقصى لمحاولات التحقق",
  "data": {}
}
```

**Notes:**
- ✅ Reset Token صالح لمدة 15 دقيقة
- ✅ الحد الأقصى للمحاولات الخاطئة: 5 محاولات
- ✅ يتم تعليم OTP كـ "مستخدم" بعد التحقق الناجح
- ⚠️ احفظ Reset Token لاستخدامه في الخطوة التالية

**Example:**
```bash
curl -X POST "http://localhost:3000/auth/verify-otp" \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+966501234567",
    "otp": "123456"
  }'
```

---

### 3. Reset Password (إعادة تعيين كلمة المرور)

**POST** `/auth/reset-password`

**Description:** تحديث كلمة المرور باستخدام Reset Token

**Request Body:**
```json
{
  "resetToken": "+966501234567:a1b2c3d4e5f6....:1738419600000",
  "newPassword": "NewSecurePass@123"
}
```

**Required Fields:**
- `resetToken`: الرمز المستلم من `/verify-otp`
- `newPassword`: كلمة المرور الجديدة

**Password Requirements:**
- 8 أحرف على الأقل
- حرف كبير (A-Z)
- حرف صغير (a-z)
- رقم (0-9)
- رمز خاص (@$!%*?&#)

**Response (Success):**
```json
{
  "success": true,
  "message": "تم تغيير كلمة المرور بنجاح",
  "data": {}
}
```

**Response (Error - Invalid Token):**
```json
{
  "success": false,
  "message": "رمز إعادة التعيين غير صالح",
  "data": {}
}
```

**Response (Error - Expired Token):**
```json
{
  "success": false,
  "message": "رمز إعادة التعيين منتهي الصلاحية",
  "data": {}
}
```

**Notes:**
- ✅ يتم تشفير كلمة المرور باستخدام bcrypt (12 rounds)
- ✅ يتم حذف جميع OTPs الخاصة بالمستخدم
- ✅ يتم إلغاء جميع الجلسات النشطة (force re-login)
- ✅ يتم إلغاء جميع Refresh Tokens
- ⚠️ يجب على المستخدم تسجيل الدخول مرة أخرى

**Example:**
```bash
curl -X POST "http://localhost:3000/auth/reset-password" \
  -H "Content-Type: application/json" \
  -d '{
    "resetToken": "+966501234567:a1b2c3d4e5f6....:1738419600000",
    "newPassword": "NewSecurePass@123"
  }'
```

---

## 🛡️ Security Features

### 1. **Rate Limiting**
- ✅ حد أدنى دقيقتين بين كل طلب OTP
- ✅ منع إرسال OTP بشكل متكرر (Spam Protection)

### 2. **OTP Security**
- ✅ OTP عشوائي مكون من 6 أرقام
- ✅ صلاحية محدودة (10 دقائق)
- ✅ استخدام واحد فقط (يتم تعليمه كـ "مستخدم" بعد التحقق)
- ✅ حد أقصى 5 محاولات خاطئة

### 3. **Reset Token Security**
- ✅ Token عشوائي (32 bytes hex)
- ✅ صلاحية محدودة (15 دقيقة)
- ✅ يحتوي على رقم الهاتف ووقت الانتهاء

### 4. **Password Security**
- ✅ تشفير bcrypt مع 12 rounds
- ✅ متطلبات قوة كلمة المرور
- ✅ إلغاء جميع الجلسات بعد تغيير كلمة المرور

### 5. **Logging & Monitoring**
- ✅ تسجيل جميع محاولات إعادة تعيين كلمة المرور
- ✅ تسجيل IP و User Agent
- ✅ تسجيل المحاولات الفاشلة

---

## 📊 Database Schema

```sql
PasswordReset {
  id: Int (Primary Key, Auto Increment)
  phone: String (Indexed)
  otp: String (Indexed)
  expiresAt: DateTime (Indexed)
  isUsed: Boolean (Default: false)
  usedAt: DateTime (Nullable)
  attempts: Int (Default: 0)
  ip: String (Nullable)
  userAgent: String (Nullable)
  created_at: DateTime (Default: now, Indexed)
}
```

---

## ⚙️ Configuration

### Environment Variables

لا توجد متغيرات بيئية إضافية مطلوبة. النظام يستخدم:
- `PASSWORD_RESET_SECRET` - موجود بالفعل في `.env`

### SMS Integration (TODO)

لإرسال OTP عبر SMS، يجب دمج خدمة SMS مثل:
- Twilio
- AWS SNS
- Nexmo
- Unifonic (للسعودية)

**مثال على التكامل:**
```javascript
// في services/auth.service.js - requestPasswordReset function
import { sendSMS } from '../utils/sms.js';

// بدلاً من:
logger.info('Password reset OTP generated', { phone, otp, expiresAt });

// استخدم:
await sendSMS(phone, `رمز إعادة تعيين كلمة المرور: ${otp}\nصالح لمدة 10 دقائق`);
```

---

## 🧪 Testing Examples

### Complete Flow Test

```bash
# 1. Request OTP
curl -X POST "http://localhost:3000/auth/forgot-password" \
  -H "Content-Type: application/json" \
  -d '{"phone": "+966501234567"}'

# 2. Check logs for OTP (في الإنتاج سيتم إرساله عبر SMS)
# OTP: 123456

# 3. Verify OTP
curl -X POST "http://localhost:3000/auth/verify-otp" \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+966501234567",
    "otp": "123456"
  }'

# Response will contain resetToken

# 4. Reset Password
curl -X POST "http://localhost:3000/auth/reset-password" \
  -H "Content-Type: application/json" \
  -d '{
    "resetToken": "RESET_TOKEN_FROM_STEP_3",
    "newPassword": "NewSecurePass@123"
  }'

# 5. Login with new password
curl -X POST "http://localhost:3000/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+966501234567",
    "password": "NewSecurePass@123"
  }'
```

---

## ✅ Features Implemented

- ✅ إرسال OTP (6 أرقام)
- ✅ التحقق من OTP
- ✅ إعادة تعيين كلمة المرور
- ✅ Rate Limiting (منع الإرسال المتكرر)
- ✅ OTP Expiration (10 دقائق)
- ✅ Reset Token Expiration (15 دقيقة)
- ✅ Max Attempts (5 محاولات)
- ✅ Single Use OTP
- ✅ Password Validation
- ✅ Session Revocation
- ✅ Logging & Monitoring
- ✅ IP & User Agent Tracking

---

## 🚀 Next Steps

1. ✅ **دمج خدمة SMS** لإرسال OTP
2. ✅ **إضافة Captcha** لمنع الهجمات الآلية
3. ✅ **إضافة Email Notification** عند تغيير كلمة المرور
4. ✅ **إضافة 2FA** (Two-Factor Authentication)
5. ✅ **Cleanup Job** لحذف OTPs المنتهية تلقائياً

---

## 📝 Notes

- ⚠️ **مهم جداً**: في الإنتاج، يجب إرسال OTP عبر SMS وليس تسجيله في الـ logs
- ⚠️ **أمان**: تأكد من تفعيل HTTPS في الإنتاج
- ⚠️ **Rate Limiting**: يمكن تعديل الحد الأدنى بين الطلبات حسب الحاجة
- ⚠️ **Monitoring**: راقب محاولات إعادة تعيين كلمة المرور المشبوهة

---

## 🎯 Summary

تم إنشاء نظام كامل ومحمي لاستعادة كلمة المرور يتضمن:
- 3 Endpoints
- OTP System
- Reset Token System
- Rate Limiting
- Security Best Practices
- Complete Documentation

النظام جاهز للاستخدام ويحتاج فقط إلى دمج خدمة SMS للإنتاج! 🚀

