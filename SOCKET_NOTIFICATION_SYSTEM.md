# 🔔 نظام الإشعارات الفورية - Socket.IO

## 📋 نظرة عامة

تم تنفيذ نظام إشعارات فوري كامل باستخدام Socket.IO يدعم:
- ✅ إرسال إشعارات فورية للمستخدمين
- ✅ تصفية الإشعارات حسب الصلاحيات
- ✅ تصفية الإشعارات حسب نوع الطلب
- ✅ حفظ الإشعارات في قاعدة البيانات
- ✅ تتبع حالة القراءة (مقروء/غير مقروء)
- ✅ مصادقة JWT للاتصالات

---

## 🗂️ الملفات المنشأة

### **1. Socket Server**
- `socket/socketServer.js` - خادم Socket.IO الرئيسي

### **2. Services**
- `services/notification.service.js` - خدمة إدارة الإشعارات

### **3. Utils**
- `utils/notificationHelper.js` - دوال مساعدة لإرسال الإشعارات

### **4. Controllers & Routes**
- `controllers/notification.controller.js` - معالجات الإشعارات
- `routes/notification.routes.js` - مسارات API للإشعارات

### **5. Models**
- `models/notification.model.js` - موجود مسبقاً (تم استخدامه)

### **6. Schema Updates**
- تحديث `NotificationType` enum في `prisma/schema.prisma`

---

## 🔧 الإعداد والتكوين

### **1. تثبيت المكتبات**
```bash
npm install socket.io
```

### **2. تحديث قاعدة البيانات**
```bash
npx prisma migrate dev --name update_notification_types
```

### **3. متغيرات البيئة**
تأكد من وجود المتغيرات التالية في `.env`:
```env
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:3000  # للـ CORS
```

---

## 📡 كيفية الاتصال (Frontend)

### **مثال باستخدام Socket.IO Client:**

```javascript
import io from 'socket.io-client';

// الاتصال بالخادم
const socket = io('http://localhost:3000', {
  auth: {
    token: 'YOUR_JWT_TOKEN'  // JWT token من تسجيل الدخول
  }
});

// الاستماع لحدث الاتصال
socket.on('connected', (data) => {
  console.log('متصل بنجاح:', data);
});

// الاستماع للإشعارات الجديدة
socket.on('notification', (notification) => {
  console.log('إشعار جديد:', notification);
  // عرض الإشعار للمستخدم
  showNotification(notification.title, notification.body);
});

// طلب عدد الإشعارات غير المقروءة
socket.emit('get:unread:count');

socket.on('unread:count', (data) => {
  console.log('عدد الإشعارات غير المقروءة:', data.count);
});

// تحديد إشعار كمقروء
socket.emit('mark:read', notificationId);

// تحديد جميع الإشعارات كمقروءة
socket.emit('mark:all:read');
```

---

## 🎯 أنواع الإشعارات

تم إضافة الأنواع التالية إلى `NotificationType`:

| النوع | الوصف | الصلاحيات المستهدفة |
|------|-------|---------------------|
| `ORDER_NEW` | طلب جديد | admin, warehouse_manager |
| `ORDER_UPDATE` | تحديث طلب | admin, warehouse_manager |
| `ORDER_DELETE` | حذف طلب | admin |
| `INVOICE_NEW` | فاتورة جديدة | admin, warehouse_manager, customer |
| `INVOICE_UPDATE` | تحديث فاتورة | admin, warehouse_manager |
| `INVOICE_DELETE` | حذف فاتورة | admin |
| `INVOICE_PAYMENT` | دفعة فاتورة | admin, warehouse_manager |
| `CUSTOMER_NEW` | عميل جديد | admin, sales |
| `CUSTOMER_UPDATE` | تحديث عميل | admin, sales |
| `PRODUCTION_NEW` | عملية إنتاج جديدة | admin, warehouse_manager, production_manager |
| `PRODUCTION_UPDATE` | تحديث عملية إنتاج | admin, warehouse_manager, production_manager |
| `WAREHOUSE_MOVEMENT` | حركة مخزن | admin, warehouse_manager |
| `SLITE_NEW` | عملية تشريح جديدة | admin, warehouse_manager, production_manager |

---

## 🔌 API Endpoints

### **1. جلب إشعارات المستخدم الحالي**
```http
GET /notifications/my
Authorization: Bearer {token}

Query Parameters:
- page: رقم الصفحة (افتراضي: 1)
- limit: عدد النتائج (افتراضي: 20)
- type: نوع الإشعار (اختياري)
- isRead: true/false (اختياري)

Response:
{
  "success": true,
  "message": "تم جلب الإشعارات بنجاح",
  "data": {
    "notifications": [...],
    "unreadCount": 5,
    "pagination": {
      "total": 50,
      "page": 1,
      "limit": 20,
      "totalPages": 3
    }
  }
}
```

### **2. جلب عدد الإشعارات غير المقروءة**
```http
GET /notifications/unread-count
Authorization: Bearer {token}

Response:
{
  "success": true,
  "message": "تم جلب عدد الإشعارات غير المقروءة بنجاح",
  "data": {
    "count": 5
  }
}
```

### **3. تحديد إشعار كمقروء**
```http
PUT /notifications/:id/read
Authorization: Bearer {token}

Response:
{
  "success": true,
  "message": "تم تحديد الإشعار كمقروء بنجاح"
}
```

### **4. تحديد جميع الإشعارات كمقروءة**
```http
PUT /notifications/mark-all-read
Authorization: Bearer {token}

Response:
{
  "success": true,
  "message": "تم تحديد جميع الإشعارات كمقروءة بنجاح"
}
```

### **5. جلب جميع الإشعارات (للمدراء فقط)**
```http
GET /notifications
Authorization: Bearer {token}
Role: admin

Query Parameters: نفس /my

Response: نفس /my
```

---

## 🛠️ دوال المساعدة (Helper Functions)

استخدم هذه الدوال في Services لإرسال الإشعارات:

```javascript
import {
  notifyNewOrder,
  notifyOrderUpdate,
  notifyOrderDelete,
  notifyNewInvoice,
  notifyInvoicePayment,
  notifyNewCustomer,
  notifyNewProduction,
  notifyWarehouseMovement,
  notifyNewSlite
} from '../utils/notificationHelper.js';

// مثال: إرسال إشعار طلب جديد
await notifyNewOrder(order, req.user.id);

// مثال: إرسال إشعار فاتورة جديدة
await notifyNewInvoice(invoice, req.user.id);
```

---

## 🔐 الأمان

1. **مصادقة JWT**: جميع اتصالات Socket.IO تتطلب JWT token صالح
2. **التحقق من الصلاحيات**: الإشعارات تُرسل فقط للمستخدمين ذوي الصلاحيات المناسبة
3. **غرف Socket.IO**: كل مستخدم في غرفة خاصة (`user:{userId}`) وغرفة صلاحية (`role:{role}`)

---

## 📊 آلية العمل

1. **المستخدم يتصل**: يرسل JWT token عند الاتصال
2. **التحقق من Token**: Socket middleware يتحقق من صحة Token
3. **الانضمام للغرف**: المستخدم ينضم لغرفته الخاصة وغرفة صلاحيته
4. **إرسال الإشعار**: عند حدوث عملية (طلب جديد، فاتورة، إلخ):
   - يتم حفظ الإشعار في قاعدة البيانات
   - يتم إرسال الإشعار عبر Socket.IO للمستخدمين المستهدفين
5. **استقبال الإشعار**: Frontend يستقبل الإشعار ويعرضه للمستخدم

---

## ✅ الخطوات التالية

- [ ] دمج الإشعارات مع Order Service
- [ ] دمج الإشعارات مع Invoice Service  
- [ ] دمج الإشعارات مع باقي Services
- [ ] اختبار النظام بالكامل
- [ ] إضافة دعم FCM للإشعارات Push (اختياري)

---

**النظام جاهز للاستخدام! 🚀**

