# 📊 نظام التسجيل والمراجعة - Logging & Auditing System

## 📋 نظرة عامة

تم تنفيذ نظام شامل لتسجيل جميع العمليات والأنشطة في المشروع باستخدام ثلاثة جداول رئيسية:

1. **LoginAttempt** - تسجيل محاولات تسجيل الدخول (ناجحة وفاشلة)
2. **ActivityLog** - تسجيل جميع أنشطة المستخدمين (CREATE, UPDATE, DELETE, VIEW, etc.)
3. **AuditLog** - تسجيل عمليات المراجعة والتدقيق

---

## 🗂️ الملفات المنشأة والمحدثة

### **Models** (طبقة قاعدة البيانات):
- ✅ `models/activityLog.model.js` - CRUD كامل لسجلات النشاط
- ✅ `models/auditLog.model.js` - CRUD كامل لسجلات المراجعة
- ✅ `models/loginAttempt.model.js` - محدث بدوال إضافية

### **Services** (طبقة منطق الأعمال):
- ✅ `services/activityLog.service.js` - منطق الأعمال لسجلات النشاط
- ✅ `services/auditLog.service.js` - منطق الأعمال لسجلات المراجعة
- ✅ `services/loginAttempt.service.js` - منطق الأعمال لمحاولات تسجيل الدخول
- ✅ `services/auth.service.js` - محدث لتسجيل LOGIN و LOGOUT

### **Controllers** (طبقة التحكم):
- ✅ `controllers/activityLog.controller.js` - معالجة طلبات سجلات النشاط
- ✅ `controllers/auditLog.controller.js` - معالجة طلبات سجلات المراجعة
- ✅ `controllers/loginAttempt.controller.js` - معالجة طلبات محاولات تسجيل الدخول
- ✅ `controllers/auth.controller.js` - محدث لتمرير req إلى logout functions

### **Routes** (المسارات):
- ✅ `routes/activityLog.routes.js` - مسارات سجلات النشاط
- ✅ `routes/auditLog.routes.js` - مسارات سجلات المراجعة
- ✅ `routes/loginAttempt.routes.js` - مسارات محاولات تسجيل الدخول

### **Utilities** (الأدوات المساعدة):
- ✅ `utils/activityLogger.js` - Helper functions لتسجيل الأنشطة بسهولة

### **Configuration**:
- ✅ `app.js` - محدث لإضافة Routes الجديدة

---

## 📡 API Endpoints

### **1. Activity Logs (سجلات النشاط)**

#### **GET /activity-logs**
جلب جميع سجلات النشاط مع فلترة

**الصلاحيات:** `admin`, `warehouse_manager`

**Query Parameters:**
```json
{
  "userId": "integer (optional)",
  "action": "string (optional) - CREATE|UPDATE|DELETE|VIEW|LOGIN|LOGOUT|SEARCH|EXPORT",
  "module": "string (optional) - auth|order|invoice|customer|etc.",
  "entityId": "integer (optional)",
  "startDate": "ISO date (optional)",
  "endDate": "ISO date (optional)",
  "skip": "integer (optional, default: 0)",
  "take": "integer (optional, default: 50)"
}
```

**Response:**
```json
{
  "success": true,
  "message": "تم جلب سجلات النشاط بنجاح",
  "data": {
    "logs": [
      {
        "id": 1,
        "userId": 5,
        "action": "CREATE",
        "module": "order",
        "entityId": 123,
        "entityRef": "ORD-2024-123",
        "oldData": null,
        "newData": { "customer_id": 10, "total": 5000 },
        "ip": "192.168.1.1",
        "userAgent": "Mozilla/5.0...",
        "searchQuery": null,
        "createdAt": "2024-03-04T10:30:00.000Z",
        "user": {
          "id": 5,
          "username": "admin",
          "full_name": "المدير العام",
          "role": "admin"
        }
      }
    ],
    "total": 150,
    "skip": 0,
    "take": 50
  }
}
```

#### **GET /activity-logs/:id**
جلب سجل نشاط واحد

**الصلاحيات:** `admin`, `warehouse_manager`

#### **GET /activity-logs/user/:userId**
جلب سجلات النشاط حسب المستخدم

**الصلاحيات:** `admin`, `warehouse_manager`

#### **GET /activity-logs/module/:module**
جلب سجلات النشاط حسب الوحدة

**الصلاحيات:** `admin`, `warehouse_manager`

---

### **2. Audit Logs (سجلات المراجعة)**

#### **GET /audit-logs**
جلب جميع سجلات المراجعة مع فلترة

**الصلاحيات:** `admin` فقط

**Query Parameters:**
```json
{
  "actorId": "integer (optional)",
  "action": "string (optional)",
  "resource": "string (optional)",
  "startDate": "ISO date (optional)",
  "endDate": "ISO date (optional)",
  "skip": "integer (optional, default: 0)",
  "take": "integer (optional, default: 50)"
}
```

#### **GET /audit-logs/:id**
جلب سجل مراجعة واحد

**الصلاحيات:** `admin` فقط

#### **GET /audit-logs/actor/:actorId**
جلب سجلات المراجعة حسب المستخدم

**الصلاحيات:** `admin` فقط

---

### **3. Login Attempts (محاولات تسجيل الدخول)**

#### **GET /login-attempts**
جلب جميع محاولات تسجيل الدخول مع فلترة

**الصلاحيات:** `admin` فقط

**Query Parameters:**
```json
{
  "userId": "integer (optional)",
  "identifier": "string (optional) - username or phone",
  "success": "boolean (optional)",
  "ip": "string (optional)",
  "startDate": "ISO date (optional)",
  "endDate": "ISO date (optional)",
  "skip": "integer (optional, default: 0)",
  "take": "integer (optional, default: 50)"
}
```

**Response:**
```json
{
  "success": true,
  "message": "تم جلب محاولات تسجيل الدخول بنجاح",
  "data": {
    "attempts": [
      {
        "id": 1,
        "userId": 5,
        "identifier": "admin",
        "success": true,
        "ip": "192.168.1.1",
        "userAgent": "Mozilla/5.0...",
        "created_at": "2024-03-04T10:00:00.000Z",
        "user": {
          "id": 5,
          "username": "admin",
          "full_name": "المدير العام"
        }
      }
    ],
    "total": 500,
    "skip": 0,
    "take": 50
  }
}
```

#### **GET /login-attempts/stats**
جلب إحصائيات محاولات تسجيل الدخول

**الصلاحيات:** `admin` فقط

**Response:**
```json
{
  "success": true,
  "message": "تم جلب إحصائيات محاولات تسجيل الدخول بنجاح",
  "data": {
    "total": 1000,
    "successful": 950,
    "failed": 50,
    "successRate": "95.00"
  }
}
```

#### **GET /login-attempts/failed**
جلب محاولات تسجيل الدخول الفاشلة فقط

**الصلاحيات:** `admin` فقط

#### **GET /login-attempts/user/:userId**
جلب محاولات تسجيل الدخول حسب المستخدم

**الصلاحيات:** `admin` فقط

---

## 🔧 استخدام Activity Logger Helpers

### **في Services:**

```javascript
import { logCreate, logUpdate, logDelete, logView } from "../utils/activityLogger.js";

// عند إنشاء سجل جديد
export const createOrder = async (data, req) => {
  const order = await OrderModel.create(data);
  
  // تسجيل النشاط
  await logCreate(req, "order", order.order_id, order, order.order_number);
  
  return order;
};

// عند تحديث سجل
export const updateOrder = async (orderId, data, req) => {
  const oldOrder = await OrderModel.findById(orderId);
  const updatedOrder = await OrderModel.update(orderId, data);
  
  // تسجيل النشاط
  await logUpdate(req, "order", orderId, oldOrder, updatedOrder, updatedOrder.order_number);
  
  return updatedOrder;
};

// عند حذف سجل
export const deleteOrder = async (orderId, req) => {
  const order = await OrderModel.findById(orderId);
  await OrderModel.delete(orderId);
  
  // تسجيل النشاط
  await logDelete(req, "order", orderId, order, order.order_number);
  
  return true;
};
```

---

## 🎯 الميزات الرئيسية

1. **تسجيل تلقائي** لجميع محاولات تسجيل الدخول (ناجحة وفاشلة)
2. **تتبع كامل** لجميع عمليات CREATE, UPDATE, DELETE
3. **حفظ البيانات القديمة والجديدة** في JSON format
4. **تسجيل IP و User-Agent** لكل عملية
5. **فلترة متقدمة** حسب المستخدم، التاريخ، النوع، الوحدة
6. **RBAC** - صلاحيات محددة لكل endpoint
7. **رسائل بالعربية** لجميع الاستجابات
8. **إحصائيات شاملة** لمحاولات تسجيل الدخول

---

## ✅ الخطوات التالية المقترحة

1. **دمج التسجيل في Services الأخرى:**
   - `productionProcess.service.js`
   - `slite.service.js`
   - `warehouseMovement.service.js`
   - `invoice.service.js`
   - `order.service.js`
   - `customer.service.js`

2. **إضافة Validators** لفلترة البيانات في query parameters

3. **إضافة Cron Jobs** لتنظيف السجلات القديمة تلقائياً

4. **إضافة Dashboard** لعرض الإحصائيات والتقارير

---

## 🔒 الأمان والصلاحيات

- **ActivityLog**: يمكن الوصول إليها من قبل `admin` و `warehouse_manager`
- **AuditLog**: يمكن الوصول إليها من قبل `admin` فقط
- **LoginAttempt**: يمكن الوصول إليها من قبل `admin` فقط

---

**تم التنفيذ بنجاح! 🎉**

