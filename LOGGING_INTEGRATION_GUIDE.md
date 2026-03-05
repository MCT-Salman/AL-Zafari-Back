# 📝 دليل دمج نظام التسجيل في Services

## ✅ تم الإكمال

### **1. Order Service** ✅
- ✅ `createOrder` - تسجيل CREATE
- ✅ `updateOrder` - تسجيل UPDATE
- ✅ `deleteOrder` - تسجيل DELETE
- ✅ تحديث Controller لتمرير `req`

### **2. Invoice Service** ✅
- ✅ `createInvoice` - تسجيل CREATE
- ✅ `updateInvoice` - تسجيل UPDATE
- ✅ `deleteInvoice` - تسجيل DELETE
- ✅ تحديث Controller لتمرير `req`

### **3. Customer Service** ✅
- ✅ `createCustomer` - تسجيل CREATE
- ✅ `updateCustomer` - تسجيل UPDATE
- ✅ `deleteCustomer` - تسجيل DELETE
- ✅ تحديث Controller لتمرير `req`

---

## 🔄 قيد التنفيذ

### **4. ProductionProcess Service**
يجب تطبيق التغييرات التالية:

#### في `services/invoice.service.js`:
```javascript
// إضافة import
import { logCreate, logUpdate, logDelete } from "../utils/activityLogger.js";

// تحديث دوال
export const createInvoice = async (data, userId, req = null) => {
  // ... الكود الحالي
  
  // قبل return
  if (req) {
    await logCreate(req, "invoice", newInvoice.invoice_id, newInvoice, newInvoice.invoice_number);
  }
  return newInvoice;
};

export const updateInvoice = async (invoice_id, data, req = null) => {
  const existingInvoice = await getInvoiceById(invoice_id);
  // ... الكود الحالي
  
  // قبل return
  if (req) {
    await logUpdate(req, "invoice", invoice_id, existingInvoice, updatedInvoice, updatedInvoice.invoice_number);
  }
  return updatedInvoice;
};

export const deleteInvoice = async (invoice_id, req = null) => {
  const invoice = await getInvoiceById(invoice_id);
  // ... الكود الحالي
  
  // قبل return
  if (req) {
    await logDelete(req, "invoice", invoice_id, invoice, invoice.invoice_number);
  }
  return result;
};
```

#### في `controllers/invoice.controller.js`:
```javascript
// تمرير req إلى Service
const invoice = await createInvoiceService(data, userId, req);
const invoice = await updateInvoiceService(parseInt(id), data, req);
const result = await deleteInvoiceService(parseInt(id), req);
```

---

### **3. Customer Service**
```javascript
// في services/customer.service.js
import { logCreate, logUpdate, logDelete } from "../utils/activityLogger.js";

export const createCustomer = async (data, req = null) => {
  // ... الكود الحالي
  if (req) {
    await logCreate(req, "customer", customer.customer_id, customer, customer.customer_name);
  }
  return customer;
};

export const updateCustomer = async (customer_id, data, req = null) => {
  const existingCustomer = await getCustomerById(customer_id);
  // ... الكود الحالي
  if (req) {
    await logUpdate(req, "customer", customer_id, existingCustomer, updatedCustomer, updatedCustomer.customer_name);
  }
  return updatedCustomer;
};

export const deleteCustomer = async (customer_id, req = null) => {
  const customer = await getCustomerById(customer_id);
  // ... الكود الحالي
  if (req) {
    await logDelete(req, "customer", customer_id, customer, customer.customer_name);
  }
  return result;
};
```

---

### **4. ProductionProcess Service**
```javascript
// في services/productionProcess.service.js
import { logCreate, logUpdate, logDelete } from "../utils/activityLogger.js";

export const createProductionProcess = async (data, req = null) => {
  // ... الكود الحالي
  if (req) {
    await logCreate(req, "production_process", process.process_id, process, `Process-${process.process_id}`);
  }
  return process;
};

export const updateProductionProcess = async (process_id, data, req = null) => {
  const existingProcess = await getProductionProcessById(process_id);
  // ... الكود الحالي
  if (req) {
    await logUpdate(req, "production_process", process_id, existingProcess, updatedProcess, `Process-${process_id}`);
  }
  return updatedProcess;
};

export const deleteProductionProcess = async (process_id, req = null) => {
  const process = await getProductionProcessById(process_id);
  // ... الكود الحالي
  if (req) {
    await logDelete(req, "production_process", process_id, process, `Process-${process_id}`);
  }
  return result;
};
```

---

### **5. Slite Service**
```javascript
// في services/slite.service.js
import { logCreate, logUpdate, logDelete } from "../utils/activityLogger.js";

export const createSlite = async (data, req = null) => {
  // ... الكود الحالي
  if (req) {
    await logCreate(req, "slite", slite.slite_id, slite, `Slite-${slite.slite_id}`);
  }
  return slite;
};

export const updateSlite = async (slite_id, data, req = null) => {
  const existingSlite = await getSliteById(slite_id);
  // ... الكود الحالي
  if (req) {
    await logUpdate(req, "slite", slite_id, existingSlite, updatedSlite, `Slite-${slite_id}`);
  }
  return updatedSlite;
};

export const deleteSlite = async (slite_id, req = null) => {
  const slite = await getSliteById(slite_id);
  // ... الكود الحالي
  if (req) {
    await logDelete(req, "slite", slite_id, slite, `Slite-${slite_id}`);
  }
  return result;
};
```

---

### **6. WarehouseMovement Service**
```javascript
// في services/warehouseMovement.service.js
import { logCreate, logUpdate, logDelete } from "../utils/activityLogger.js";

export const createWarehouseMovement = async (data, req = null) => {
  // ... الكود الحالي
  if (req) {
    await logCreate(req, "warehouse_movement", movement.movement_id, movement, `Movement-${movement.movement_id}`);
  }
  return movement;
};

export const updateWarehouseMovement = async (movement_id, data, req = null) => {
  const existingMovement = await getWarehouseMovementById(movement_id);
  // ... الكود الحالي
  if (req) {
    await logUpdate(req, "warehouse_movement", movement_id, existingMovement, updatedMovement, `Movement-${movement_id}`);
  }
  return updatedMovement;
};

export const deleteWarehouseMovement = async (movement_id, req = null) => {
  const movement = await getWarehouseMovementById(movement_id);
  // ... الكود الحالي
  if (req) {
    await logDelete(req, "warehouse_movement", movement_id, movement, `Movement-${movement_id}`);
  }
  return result;
};
```

---

## 📌 ملاحظات مهمة

1. **Parameter `req`**: يجب أن يكون اختياري (`req = null`) لعدم كسر الكود الحالي
2. **Module Name**: استخدم اسم واضح للوحدة (order, invoice, customer, etc.)
3. **Entity Reference**: استخدم معرف واضح (order_number, invoice_number, customer_name, etc.)
4. **Old Data**: احفظ البيانات القديمة قبل التحديث أو الحذف
5. **Controller Update**: لا تنسى تمرير `req` من Controller إلى Service

---

## ✅ الخطوات المطلوبة لكل Service

1. إضافة import للـ helper functions
2. إضافة parameter `req = null` لدوال CREATE, UPDATE, DELETE
3. إضافة استدعاء `logCreate/logUpdate/logDelete` قبل return
4. تحديث Controller لتمرير `req`

---

**تم إكمال Order Service ✅**
**باقي 5 Services رئيسية + Services إضافية**

