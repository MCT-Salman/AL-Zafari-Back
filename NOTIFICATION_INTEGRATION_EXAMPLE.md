# 📘 دليل دمج الإشعارات مع Services

## 🎯 الهدف
هذا الدليل يوضح كيفية دمج نظام الإشعارات الفورية مع Services الموجودة.

---

## 📝 مثال 1: دمج مع Order Service

### **قبل التعديل:**
```javascript
// services/order.service.js
export const createOrder = async (orderData, req) => {
  // ... منطق إنشاء الطلب
  const newOrder = await OrderModel.create(orderData);
  
  // تسجيل النشاط
  await logCreate(req, "order", newOrder.order_id, newOrder, newOrder.order_number);
  
  return newOrder;
};
```

### **بعد التعديل:**
```javascript
// services/order.service.js
import { notifyNewOrder } from "../utils/notificationHelper.js";

export const createOrder = async (orderData, req) => {
  // ... منطق إنشاء الطلب
  const newOrder = await OrderModel.create(orderData);
  
  // تسجيل النشاط
  await logCreate(req, "order", newOrder.order_id, newOrder, newOrder.order_number);
  
  // إرسال إشعار فوري ✨
  await notifyNewOrder(newOrder, req.user.id);
  
  return newOrder;
};
```

---

## 📝 مثال 2: دمج مع Invoice Service

### **إنشاء فاتورة جديدة:**
```javascript
// services/invoice.service.js
import { notifyNewInvoice } from "../utils/notificationHelper.js";

export const createInvoice = async (invoiceData, req) => {
  // ... منطق إنشاء الفاتورة
  const newInvoice = await InvoiceModel.create(invoiceData);
  
  // تسجيل النشاط
  await logCreate(req, "invoice", newInvoice.invoice_id, newInvoice, newInvoice.invoice_number);
  
  // إرسال إشعار فوري ✨
  await notifyNewInvoice(newInvoice, req.user.id);
  
  return newInvoice;
};
```

### **دفع فاتورة:**
```javascript
// services/invoice.service.js
import { notifyInvoicePayment } from "../utils/notificationHelper.js";

export const payInvoice = async (invoiceId, paymentData, req) => {
  // ... منطق الدفع
  const updatedInvoice = await InvoiceModel.updatePayment(invoiceId, paymentData);
  
  // تسجيل النشاط
  await logUpdate(req, "invoice", invoiceId, oldData, updatedInvoice, updatedInvoice.invoice_number);
  
  // إرسال إشعار فوري ✨
  await notifyInvoicePayment(updatedInvoice, paymentData.amount, req.user.id);
  
  return updatedInvoice;
};
```

---

## 📝 مثال 3: دمج مع Customer Service

```javascript
// services/customer.service.js
import { notifyNewCustomer } from "../utils/notificationHelper.js";

export const createCustomer = async (customerData, req) => {
  // ... منطق إنشاء العميل
  const newCustomer = await CustomerModel.create(customerData);
  
  // تسجيل النشاط
  await logCreate(req, "customer", newCustomer.customer_id, newCustomer, newCustomer.customer_name);
  
  // إرسال إشعار فوري ✨
  await notifyNewCustomer(newCustomer, req.user.id);
  
  return newCustomer;
};
```

---

## 📝 مثال 4: دمج مع Production Service

```javascript
// services/productionProcess.service.js
import { notifyNewProduction } from "../utils/notificationHelper.js";

export const createProductionProcess = async (processData, req) => {
  // ... منطق إنشاء عملية الإنتاج
  const newProcess = await ProductionProcessModel.create(processData);
  
  // تسجيل النشاط
  await logCreate(req, "production_process", newProcess.process_id, newProcess, newProcess.process_id);
  
  // إرسال إشعار فوري ✨
  await notifyNewProduction(newProcess, req.user.id);
  
  return newProcess;
};
```

---

## 📝 مثال 5: دمج مع Warehouse Movement Service

```javascript
// services/warehouseMovement.service.js
import { notifyWarehouseMovement } from "../utils/notificationHelper.js";

export const createWarehouseMovement = async (movementData, req) => {
  // ... منطق إنشاء حركة المخزن
  const newMovement = await WarehouseMovementModel.create(movementData);
  
  // تسجيل النشاط
  await logCreate(req, "warehouse_movement", newMovement.movement_id, newMovement, newMovement.movement_id);
  
  // إرسال إشعار فوري ✨
  await notifyWarehouseMovement(newMovement, req.user.id);
  
  return newMovement;
};
```

---

## 📝 مثال 6: دمج مع Slite Service

```javascript
// services/slite.service.js
import { notifyNewSlite } from "../utils/notificationHelper.js";

export const createSlite = async (sliteData, req) => {
  // ... منطق إنشاء عملية التشريح
  const newSlite = await SliteModel.create(sliteData);
  
  // تسجيل النشاط
  await logCreate(req, "slite", newSlite.slite_id, newSlite, newSlite.slite_id);
  
  // إرسال إشعار فوري ✨
  await notifyNewSlite(newSlite, req.user.id);
  
  return newSlite;
};
```

---

## 🔧 إنشاء إشعار مخصص

إذا كنت تريد إرسال إشعار مخصص غير موجود في Helper Functions:

```javascript
import { sendNotificationByRole, sendNotificationToUser } from "../services/notification.service.js";

// إرسال لصلاحية محددة
await sendNotificationByRole(
  ["admin", "warehouse_manager"],  // الصلاحيات المستهدفة
  {
    title: "عنوان الإشعار",
    body: "محتوى الإشعار",
    type: "GENERAL",  // نوع الإشعار
    data: { customField: "value" },  // بيانات إضافية
    link: "/path/to/resource",  // رابط الإشعار
  },
  req.app.get('io')  // Socket.IO instance
);

// إرسال لمستخدم محدد
await sendNotificationToUser(
  userId,
  {
    title: "عنوان الإشعار",
    body: "محتوى الإشعار",
    type: "GENERAL",
    data: null,
    link: null,
  },
  req.app.get('io')
);
```

---

## ✅ قائمة التحقق للدمج

عند دمج الإشعارات مع أي Service:

- [ ] استيراد الدالة المناسبة من `notificationHelper.js`
- [ ] استدعاء الدالة بعد نجاح العملية
- [ ] تمرير البيانات المطلوبة (الكائن المنشأ، معرف المستخدم)
- [ ] التأكد من أن الإشعار يُرسل للصلاحيات الصحيحة
- [ ] اختبار الإشعار على Frontend

---

## 🎨 نصائح مهمة

1. **لا تنتظر الإشعار**: استخدم `await` فقط إذا كنت تريد التأكد من إرسال الإشعار قبل المتابعة
2. **معالجة الأخطاء**: الدوال المساعدة تحتوي على `try-catch` داخلياً، لن توقف تنفيذ الكود
3. **الأداء**: إرسال الإشعارات سريع جداً ولا يؤثر على أداء API
4. **التخصيص**: يمكنك تعديل الرسائل والأنواع حسب احتياجاتك

---

**جاهز للدمج! 🚀**

