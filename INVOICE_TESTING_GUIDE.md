# دليل اختبار نظام الفواتير المحدث

## 🧪 اختبار إنشاء فاتورة جديدة

### المتطلبات الأساسية:
1. طلب موجود بحالة `completed`
2. الطلب يحتوي على عناصر (OrderItems)
3. لا توجد فاتورة سابقة لهذا الطلب

---

## 📝 أمثلة الاختبار

### 1. إنشاء فاتورة ناجحة

**الطلب (Request):**
```http
POST /api/invoices
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN

{
  "order_id": 1,
  "paid_amount": 500.00,
  "notes": "دفعة أولى - نقداً"
}
```

**الاستجابة المتوقعة (Response):**
```json
{
  "success": true,
  "message": "تم إنشاء الفاتورة بنجاح",
  "data": {
    "invoice_id": 1,
    "order_id": 1,
    "customer_id": 1,
    "total_amount": "1000.00",
    "paid_amount": "500.00",
    "remaining_amount": "500.00",
    "issued_by": 1,
    "issued_at": "2026-03-01T10:30:00.000Z",
    "notes": "دفعة أولى - نقداً",
    "invoiceItems": [
      {
        "invoice_item_id": 1,
        "invoice_id": 1,
        "order_item_id": 1,
        "width": "100.00",
        "length": "200.00",
        "unit_price": "50.00",
        "quantity": 10,
        "subtotal": "500.00",
        "orderItem": {
          "order_item_id": 1,
          "color": {
            "color_id": 1,
            "color_name": "أبيض",
            "ruler": {
              "ruler_id": 1,
              "ruler_name": "مسطرة 1",
              "material": {
                "material_id": 1,
                "material_name": "خشب"
              }
            }
          },
          "batch": {
            "batch_id": 1,
            "batch_number": "BATCH-001"
          }
        }
      },
      {
        "invoice_item_id": 2,
        "invoice_id": 1,
        "order_item_id": 2,
        "width": "150.00",
        "length": "250.00",
        "unit_price": "50.00",
        "quantity": 10,
        "subtotal": "500.00",
        "orderItem": { /* ... */ }
      }
    ],
    "customer": {
      "customer_id": 1,
      "name": "محمد أحمد",
      "phone": "0123456789",
      "balance": "500.00"
    },
    "order": {
      "order_id": 1,
      "status": "completed",
      "total_amount": "1000.00"
    },
    "user": {
      "id": 1,
      "username": "admin",
      "full_name": "المدير العام"
    }
  }
}
```

---

### 2. جلب فاتورة بالمعرف

**الطلب:**
```http
GET /api/invoices/1
Authorization: Bearer YOUR_TOKEN
```

**الاستجابة:**
```json
{
  "success": true,
  "message": "تم جلب الفاتورة بنجاح",
  "data": {
    "invoice_id": 1,
    "invoiceItems": [ /* جميع عناصر الفاتورة */ ],
    /* ... باقي البيانات */
  }
}
```

---

### 3. جلب جميع الفواتير

**الطلب:**
```http
GET /api/invoices
Authorization: Bearer YOUR_TOKEN
```

**الاستجابة:**
```json
{
  "success": true,
  "message": "تم جلب الفواتير بنجاح",
  "data": [
    {
      "invoice_id": 1,
      "invoiceItems": [ /* ... */ ],
      /* ... */
    },
    {
      "invoice_id": 2,
      "invoiceItems": [ /* ... */ ],
      /* ... */
    }
  ],
  "total": 2
}
```

---

### 4. جلب فواتير عميل معين

**الطلب:**
```http
GET /api/invoices/customer/1
Authorization: Bearer YOUR_TOKEN
```

---

### 5. جلب فواتير طلب معين

**الطلب:**
```http
GET /api/invoices/order/1
Authorization: Bearer YOUR_TOKEN
```

---

## ❌ حالات الخطأ المتوقعة

### 1. الطلب غير موجود
```json
{
  "success": false,
  "message": "الطلب غير موجود"
}
```

### 2. الطلب غير مكتمل
```json
{
  "success": false,
  "message": "لا يمكن إنشاء فاتورة لطلب غير مكتمل"
}
```

### 3. فاتورة موجودة مسبقاً
```json
{
  "success": false,
  "message": "تم إنشاء فاتورة لهذا الطلب مسبقًا"
}
```

### 4. الطلب بدون عناصر
```json
{
  "success": false,
  "message": "لا يمكن إنشاء فاتورة لطلب بدون عناصر"
}
```

### 5. المبلغ المدفوع أكبر من الإجمالي
```json
{
  "success": false,
  "message": "المبلغ المدفوع لا يمكن أن يتجاوز المبلغ الإجمالي"
}
```

---

## 🔍 التحقق من البيانات في قاعدة البيانات

### التحقق من الفاتورة:
```sql
SELECT * FROM Invoice WHERE invoice_id = 1;
```

### التحقق من عناصر الفاتورة:
```sql
SELECT * FROM InvoiceItem WHERE invoice_id = 1;
```

### التحقق من رصيد العميل:
```sql
SELECT customer_id, name, balance FROM Customer WHERE customer_id = 1;
```

### التحقق من العلاقات الكاملة:
```sql
SELECT 
  i.invoice_id,
  i.total_amount,
  i.paid_amount,
  i.remaining_amount,
  ii.invoice_item_id,
  ii.width,
  ii.length,
  ii.quantity,
  ii.subtotal,
  oi.order_item_id,
  c.color_name,
  m.material_name
FROM Invoice i
LEFT JOIN InvoiceItem ii ON i.invoice_id = ii.invoice_id
LEFT JOIN OrderItem oi ON ii.order_item_id = oi.order_item_id
LEFT JOIN Color c ON oi.color_id = c.color_id
LEFT JOIN Ruler r ON c.ruler_id = r.ruler_id
LEFT JOIN Material m ON r.material_id = m.material_id
WHERE i.invoice_id = 1;
```

---

## 📊 نقاط التحقق الرئيسية

- ✅ تم إنشاء الفاتورة الرئيسية
- ✅ تم إنشاء عناصر الفاتورة لكل عنصر في الطلب
- ✅ تم تحديث رصيد العميل بالمبلغ المتبقي
- ✅ البيانات المُرجعة تحتوي على جميع العلاقات
- ✅ جميع العمليات تمت داخل transaction واحدة
- ✅ تم تسجيل العملية في الـ logs

