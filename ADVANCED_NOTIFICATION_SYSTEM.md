# 🔔 نظام الإشعارات المتقدم - إشعارات مخصصة حسب نوع العنصر

## 📋 نظرة عامة

تم تطوير نظام الإشعارات ليدعم **إشعارات مخصصة ذكية** حسب:
- ✅ نوع العملية (طلب، طلب مبيعات، طلب إنتاج)
- ✅ نوع العنصر (تشريح، قص، لصق، مخزن، إنتاج)
- ✅ الصلاحية المسؤولة عن كل عنصر
- ✅ إرسال إشعارات متعددة لعمال مختلفين من طلب واحد

---

## 🎯 السيناريوهات المدعومة

### **1. إضافة طلب Order**
عند إضافة طلب جديد:
- ✅ يُرسل إشعار لـ **مستخدم المبيعات** (sales)
- ✅ يُرسل إشعار لـ **المدراء** (admin)
- ✅ يُرسل إشعار لـ **مدير المخزن** (warehouse_manager)

**الكود:**
```javascript
// في order.service.js
await notifyNewOrder(orderResponse, userId);
```

---

### **2. إضافة طلب مبيعات SalesOrder**
عند إضافة طلب مبيعات جديد:
- ✅ يُرسل إشعار لـ **مسؤول الإنتاج** (production_manager)
- ✅ يُرسل إشعار لـ **المدراء** (admin)

**الكود:**
```javascript
// في salesOrder.service.js
await notifySalesOrder(result, userId);
```

---

### **3. إضافة طلب إنتاج ProductionOrder (الأهم)**
عند إضافة طلب إنتاج يحتوي على عناصر متعددة:

#### **إشعار عام:**
- ✅ يُرسل إشعار عام لـ **المدراء** (admin)
- ✅ يُرسل إشعار عام لـ **مسؤول الإنتاج** (production_manager)

#### **إشعارات مخصصة حسب نوع العنصر:**

| نوع العنصر | الصلاحية المستهدفة | نوع الإشعار |
|------------|---------------------|-------------|
| `slitting` (تشريح) | `Dissection_Technician` | `PRODUCTION_ORDER_SLITTING` |
| `cutting` (قص) | `Cutting_Technician` | `PRODUCTION_ORDER_CUTTING` |
| `gluing` (لصق) | `Gluing_Technician` | `PRODUCTION_ORDER_GLUING` |
| `warehouse` (مخزن) | `warehouse_manager` | `PRODUCTION_ORDER_WAREHOUSE` |
| `orderproduction` (إنتاج) | `production_manager` | `PRODUCTION_ORDER_PRODUCTION` |

**مثال:**
إذا كان طلب الإنتاج يحتوي على:
- 3 عناصر تشريح
- 2 عنصر قص
- 1 عنصر لصق

سيتم إرسال:
1. إشعار عام للمدراء ومسؤول الإنتاج
2. إشعار لعامل التشريح: "لديك 3 عنصر تشريح في طلب الإنتاج رقم X"
3. إشعار لعامل القص: "لديك 2 عنصر قص في طلب الإنتاج رقم X"
4. إشعار لعامل اللصق: "لديك 1 عنصر لصق في طلب الإنتاج رقم X"

**الكود:**
```javascript
// في productionOrder.service.js
await notifyProductionOrder(order, createdItems, userId);
```

---

## 🔧 أنواع الإشعارات الجديدة

تم إضافة الأنواع التالية إلى `NotificationType`:

```prisma
enum NotificationType {
  // ... الأنواع السابقة
  SALES_ORDER_NEW              // طلب مبيعات جديد
  SALES_ORDER_UPDATE           // تحديث طلب مبيعات
  PRODUCTION_ORDER_NEW         // طلب إنتاج جديد (عام)
  PRODUCTION_ORDER_SLITTING    // مهمة تشريح
  PRODUCTION_ORDER_CUTTING     // مهمة قص
  PRODUCTION_ORDER_GLUING      // مهمة لصق
  PRODUCTION_ORDER_WAREHOUSE   // طلب مخزن
  PRODUCTION_ORDER_PRODUCTION  // طلب إنتاج
}
```

---

## 📊 آلية العمل التفصيلية

### **عند إنشاء طلب إنتاج:**

1. **إنشاء الطلب والعناصر** في قاعدة البيانات
2. **تسجيل النشاط** في ActivityLog
3. **تحليل العناصر** وتجميعها حسب النوع:
   ```javascript
   {
     slitting: [item1, item2, item3],
     cutting: [item4, item5],
     gluing: [item6],
     warehouse: [],
     orderproduction: []
   }
   ```
4. **إرسال إشعار عام** للمدراء ومسؤول الإنتاج
5. **إرسال إشعارات مخصصة** لكل نوع عنصر:
   - إذا كان هناك عناصر تشريح → إشعار لعامل التشريح
   - إذا كان هناك عناصر قص → إشعار لعامل القص
   - وهكذا...

---

## 🛠️ الدوال المساعدة الجديدة

### **1. notifySalesOrder**
```javascript
import { notifySalesOrder } from "../utils/notificationHelper.js";

await notifySalesOrder(salesOrder, createdBy);
```

### **2. notifyProductionOrder**
```javascript
import { notifyProductionOrder } from "../utils/notificationHelper.js";

await notifyProductionOrder(productionOrder, items, createdBy);
```

**المعاملات:**
- `productionOrder`: كائن طلب الإنتاج
- `items`: مصفوفة العناصر (يجب أن تحتوي على `type` لكل عنصر)
- `createdBy`: معرف المستخدم الذي أنشأ الطلب

---

## 📱 مثال على الإشعار المستلم

### **Frontend - استقبال إشعار تشريح:**
```javascript
socket.on('notification', (notification) => {
  if (notification.type === 'PRODUCTION_ORDER_SLITTING') {
    console.log('إشعار تشريح جديد:', notification);
    // {
    //   title: "مهمة تشريح جديدة",
    //   body: "لديك 3 عنصر تشريح في طلب الإنتاج رقم 123",
    //   type: "PRODUCTION_ORDER_SLITTING",
    //   data: {
    //     productionOrderId: 123,
    //     itemsCount: 3,
    //     items: [...]
    //   },
    //   link: "/production-orders/123"
    // }
  }
});
```

---

## ✅ الملفات المحدثة

### **1. Schema:**
- ✅ `prisma/schema.prisma` - إضافة 8 أنواع إشعارات جديدة

### **2. Utils:**
- ✅ `utils/notificationHelper.js` - إضافة دالتين جديدتين

### **3. Services:**
- ✅ `services/order.service.js` - دمج `notifyNewOrder`
- ✅ `services/salesOrder.service.js` - دمج `notifySalesOrder`
- ✅ `services/productionOrder.service.js` - دمج `notifyProductionOrder`

### **4. Database:**
- ✅ Migration: `20260305074305_add_advanced_notification_types`

---

## 🎨 مثال عملي كامل

### **السيناريو:**
مستخدم يُنشئ طلب إنتاج يحتوي على:
- 2 عنصر تشريح
- 1 عنصر قص

### **ما يحدث:**
1. يتم إنشاء الطلب والعناصر في قاعدة البيانات
2. يتم تسجيل النشاط في ActivityLog
3. يتم إرسال 3 إشعارات:
   - **إشعار 1** (للمدراء ومسؤول الإنتاج): "تم إنشاء طلب إنتاج جديد رقم 123"
   - **إشعار 2** (لعامل التشريح): "لديك 2 عنصر تشريح في طلب الإنتاج رقم 123"
   - **إشعار 3** (لعامل القص): "لديك 1 عنصر قص في طلب الإنتاج رقم 123"

### **النتيجة:**
- عامل التشريح يرى فقط إشعار التشريح
- عامل القص يرى فقط إشعار القص
- المدراء يرون جميع الإشعارات

---

## 🔐 الصلاحيات المطلوبة

| الصلاحية | الإشعارات المستلمة |
|---------|-------------------|
| `admin` | جميع الإشعارات |
| `production_manager` | طلبات الإنتاج، طلبات المبيعات، عمليات الإنتاج |
| `warehouse_manager` | الطلبات، حركات المخزن، طلبات المخزن |
| `sales` | الطلبات الجديدة، العملاء الجدد |
| `Dissection_Technician` | مهام التشريح فقط |
| `Cutting_Technician` | مهام القص فقط |
| `Gluing_Technician` | مهام اللصق فقط |

---

**النظام جاهز ويعمل بكفاءة! 🚀**

