# تحديثات نظام الفواتير

## 📋 ملخص التعديلات

تم تحديث نظام الفواتير ليتوافق مع جدول `InvoiceItem` الجديد في قاعدة البيانات. الآن عند إنشاء فاتورة، يتم تلقائياً إنشاء عناصر الفاتورة من عناصر الطلب.

---

## 🔄 التغييرات الرئيسية

### 1. **ملف Model الجديد: `models/invoiceItem.model.js`**
تم إنشاء ملف model جديد لإدارة عناصر الفاتورة (InvoiceItem) مع الدوال التالية:
- ✅ `create()` - إنشاء عنصر فاتورة واحد
- ✅ `createMany()` - إنشاء عدة عناصر فاتورة
- ✅ `findById()` - البحث عن عنصر فاتورة بالمعرف
- ✅ `findAll()` - جلب جميع عناصر الفاتورة
- ✅ `findByInvoiceId()` - جلب عناصر فاتورة معينة
- ✅ `updateById()` - تحديث عنصر فاتورة
- ✅ `deleteById()` - حذف عنصر فاتورة
- ✅ `deleteByInvoiceId()` - حذف جميع عناصر فاتورة معينة

### 2. **تحديث `models/invoice.model.js`**
تم تحديث جميع دوال الاستعلام لتضمين `invoiceItems` مع العلاقات الكاملة:

#### الدوال المحدثة:
- ✅ `findById()` - الآن تُرجع الفاتورة مع عناصرها
- ✅ `findAll()` - تُرجع جميع الفواتير مع عناصرها
- ✅ `findByOrderId()` - تُرجع فواتير الطلب مع عناصرها
- ✅ `findByCustomerId()` - تُرجع فواتير العميل مع عناصرها

#### البيانات المُرجعة تتضمن:
```javascript
{
  invoice_id: 1,
  order_id: 1,
  customer_id: 1,
  total_amount: 1000.00,
  paid_amount: 500.00,
  remaining_amount: 500.00,
  invoiceItems: [
    {
      invoice_item_id: 1,
      invoice_id: 1,
      order_item_id: 1,
      width: 100.00,
      length: 200.00,
      unit_price: 50.00,
      quantity: 10,
      subtotal: 500.00,
      orderItem: {
        // تفاصيل عنصر الطلب
        color: {
          ruler: {
            material: { ... }
          }
        },
        batch: { ... }
      }
    }
  ],
  customer: { ... },
  order: { ... },
  user: { ... }
}
```

### 3. **تحديث `services/invoice.service.js`**

#### دالة `createInvoice()`:
تم تحديثها لإنشاء عناصر الفاتورة تلقائياً:

**الخطوات:**
1. ✅ التحقق من وجود الطلب وحالته
2. ✅ التحقق من عدم وجود فاتورة سابقة للطلب
3. ✅ **جديد:** التحقق من وجود عناصر في الطلب
4. ✅ إنشاء الفاتورة الرئيسية
5. ✅ **جديد:** إنشاء عناصر الفاتورة من عناصر الطلب
6. ✅ تحديث رصيد العميل
7. ✅ **جديد:** إرجاع الفاتورة الكاملة مع جميع العناصر والعلاقات

**مثال على البيانات المُنشأة:**
```javascript
// لكل عنصر في الطلب، يتم إنشاء عنصر فاتورة:
{
  invoice_id: newInvoice.invoice_id,
  order_item_id: item.order_item_id,
  width: item.width || 0,
  length: item.length || 0,
  unit_price: item.unit_price || 0,
  quantity: item.quantity,
  subtotal: item.subtotal
}
```

### 4. **تحديث `models/index.js`**
تم إضافة `InvoiceItemModel` إلى الـ exports:
```javascript
import * as InvoiceItemModel from './invoiceItem.model.js';

export {
  // ...
  InvoiceItemModel,
  // ...
};
```

---

## 📊 هيكل قاعدة البيانات

### جدول Invoice
```sql
CREATE TABLE `Invoice` (
  `invoice_id` INT PRIMARY KEY AUTO_INCREMENT,
  `order_id` INT NOT NULL,
  `customer_id` INT NOT NULL,
  `total_amount` DECIMAL(20, 2) NOT NULL,
  `paid_amount` DECIMAL(20, 2) NOT NULL,
  `remaining_amount` DECIMAL(20, 2) NOT NULL,
  `issued_by` INT NOT NULL,
  `issued_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `notes` VARCHAR(191)
);
```

### جدول InvoiceItem
```sql
CREATE TABLE `InvoiceItem` (
  `invoice_item_id` INT PRIMARY KEY AUTO_INCREMENT,
  `invoice_id` INT NOT NULL,
  `order_item_id` INT NOT NULL,
  `width` DECIMAL(10, 2) NOT NULL,
  `length` DECIMAL(10, 2) NOT NULL,
  `unit_price` DECIMAL(20, 2) NOT NULL,
  `quantity` INT NOT NULL,
  `subtotal` DECIMAL(20, 2) NOT NULL,
  FOREIGN KEY (`invoice_id`) REFERENCES `Invoice`(`invoice_id`),
  FOREIGN KEY (`order_item_id`) REFERENCES `OrderItem`(`order_item_id`)
);
```

---

## 🔍 الاختبار

### اختبار إنشاء فاتورة:
```javascript
POST /api/invoices
{
  "order_id": 1,
  "paid_amount": 500.00,
  "notes": "دفعة أولى"
}
```

### النتيجة المتوقعة:
- ✅ إنشاء فاتورة جديدة
- ✅ إنشاء عناصر الفاتورة تلقائياً من عناصر الطلب
- ✅ تحديث رصيد العميل
- ✅ إرجاع الفاتورة الكاملة مع جميع العناصر

---

## ⚠️ ملاحظات مهمة

1. **العلاقات الكاملة**: جميع استعلامات الفواتير الآن تُرجع `invoiceItems` مع العلاقات الكاملة
2. **التوافق مع الجدول**: التعديلات متوافقة 100% مع schema Prisma الحالي
3. **Transaction Safety**: جميع العمليات تتم داخل transaction لضمان سلامة البيانات
4. **Logging**: تم إضافة logging لتتبع إنشاء الفواتير وعناصرها

---

## 📝 التحديثات المستقبلية المقترحة

- [ ] إضافة إمكانية تعديل عناصر الفاتورة بعد الإنشاء
- [ ] إضافة validators لعناصر الفاتورة
- [ ] إضافة endpoints منفصلة لإدارة عناصر الفاتورة
- [ ] إضافة تقارير تفصيلية لعناصر الفواتير

