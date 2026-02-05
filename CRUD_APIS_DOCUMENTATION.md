# توثيق APIs الإدارة الأساسية

هذا الملف يحتوي على توثيق شامل لجميع الـ CRUD APIs للكيانات الأساسية في النظام.

## 📋 جدول المحتويات

1. [ConstantType API](#constanttype-api)
2. [ConstantValue API](#constantvalue-api)
3. [Material API](#material-api)
4. [Color API](#color-api)
5. [PriceColor API](#pricecolor-api)
6. [Ruler API](#ruler-api)
7. [Batch API](#batch-api)

---

## 🔐 المصادقة

جميع الـ endpoints تتطلب مصادقة باستخدام JWT Token:

```bash
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### الصلاحيات:
- **GET** (قراءة): متاح لجميع المستخدمين المصادق عليهم
- **POST, PUT, DELETE**: متاح للـ Admin فقط

---

## 1. ConstantType API

### الأنواع المتاحة:
- `width` - العرض
- `height` - الارتفاع
- `thickness` - السماكة
- `type_order` - نوع الطلب
- `source_order` - مصدر الطلب

### 1.1 جلب جميع الأنواع الثابتة
```http
GET /constant-type?page=1&limit=10&type=width&search=نص البحث
```

**Query Parameters:**
- `page` (optional): رقم الصفحة (افتراضي: 1)
- `limit` (optional): عدد العناصر (افتراضي: 10، الحد الأقصى: 100)
- `type` (optional): نوع الثابت (width, height, thickness, type_order, source_order)
- `search` (optional): البحث في اسم النوع

**Response:**
```json
{
  "success": true,
  "message": "تم جلب الأنواع الثابتة بنجاح",
  "data": {
    "constantTypes": [
      {
        "constant_type_id": 1,
        "constants_Type_name": "عرض قياسي",
        "type": "width",
        "notes": "ملاحظات",
        "values": []
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "totalPages": 5
    }
  }
}
```

### 1.2 جلب نوع ثابت محدد
```http
GET /constant-type/:id
```

### 1.3 إنشاء نوع ثابت جديد (Admin فقط)
```http
POST /constant-type
Content-Type: application/json

{
  "constants_Type_name": "عرض قياسي",
  "type": "width",
  "notes": "ملاحظات اختيارية"
}
```

### 1.4 تحديث نوع ثابت (Admin فقط)
```http
PUT /constant-type/:id
Content-Type: application/json

{
  "constants_Type_name": "عرض محدث",
  "notes": "ملاحظات جديدة"
}
```

### 1.5 حذف نوع ثابت (Admin فقط)
```http
DELETE /constant-type/:id
```

---

## 2. ConstantValue API

### 2.1 جلب جميع القيم الثابتة
```http
GET /constant-value?page=1&limit=10&constant_type_id=1&isDefault=true&search=نص
```

**Query Parameters:**
- `page` (optional): رقم الصفحة
- `limit` (optional): عدد العناصر
- `constant_type_id` (optional): معرف النوع الثابت
- `isDefault` (optional): true أو false
- `search` (optional): البحث في القيمة أو التسمية

**Response:**
```json
{
  "success": true,
  "message": "تم جلب القيم الثابتة بنجاح",
  "data": {
    "constantValues": [
      {
        "constant_value_id": 1,
        "constant_type_id": 1,
        "value": "100",
        "unit": "سم",
        "label": "100 سم",
        "isDefault": true,
        "notes": null,
        "type": {
          "constant_type_id": 1,
          "constants_Type_name": "عرض قياسي"
        }
      }
    ],
    "pagination": { ... }
  }
}
```

### 2.2 إنشاء قيمة ثابتة جديدة (Admin فقط)
```http
POST /constant-value
Content-Type: application/json

{
  "constant_type_id": 1,
  "value": "100",
  "unit": "سم",
  "label": "100 سم",
  "isDefault": false,
  "notes": "ملاحظات اختيارية"
}
```

---

## 3. Material API

### الأنواع المتاحة:
- `Role` - رول
- `Blanck` - بلانك

### 3.1 جلب جميع المواد
```http
GET /material?page=1&limit=10&type=Role&search=نص
```

### 3.2 إنشاء مادة جديدة (Admin فقط)
```http
POST /material
Content-Type: application/json

{
  "material_name": "مادة خام",
  "type": "Role",
  "constant_height_id": 1,
  "constant_width_id": 2,
  "constant_thickness_id": 3,
  "constant_value_unit": "متر",
  "notes": "ملاحظات"
}
```

--- 

## 4. Color API

### 4.1 جلب جميع الألوان
```http
GET /color?page=1&limit=10&material_id=1&search=نص
```

### 4.2 إنشاء لون جديد (Admin فقط)
```http
POST /color
Content-Type: application/json

{
  "material_id": 1,
  "color_code": "RED001",
  "color_name": "أحمر فاتح",
  "notes": "ملاحظات"
}
```

**ملاحظة:** `color_code` يجب أن يكون فريداً

---

## 5. PriceColor API

### الأنواع المتاحة:
- `isByMeter22` - بالمتر 22
- `isByMeter44` - بالمتر 44
- `isByMeter66` - بالمتر 66
- `isByBlanck` - بالبلانك

### 5.1 جلب جميع أسعار الألوان
```http
GET /price-color?page=1&limit=10&color_id=1&constant_value_id=1&price_color_By=isByMeter22
```

### 5.2 إنشاء سعر لون جديد (Admin فقط)
```http
POST /price-color
Content-Type: application/json

{
  "color_id": 1,
  "constant_value_id": 1,
  "price_color_By": "isByMeter22",
  "price_per_meter": 150.50,
  "notes": "ملاحظات"
}
```

---

## 6. Ruler API

### الأنواع المتاحة:
- `old` - قديم
- `new` - جديد

### 6.1 جلب جميع المساطر
```http
GET /ruler?page=1&limit=10&material_id=1&color_id=1&ruler_type=new
```

### 6.2 إنشاء مسطرة جديدة (Admin فقط)
```http
POST /ruler
Content-Type: application/json

{
  "ruler_type": "new",
  "material_id": 1,
  "color_id": 1,
  "notes": "ملاحظات"
}
```

---

## 7. Batch API

### 7.1 جلب جميع الدفعات
```http
GET /batch?page=1&limit=10&material_id=1&search=رقم الطبخة
```

### 7.2 إنشاء دفعة جديدة (Admin فقط)
```http
POST /batch
Content-Type: application/json

{
  "batch_number": "BATCH-2024-001",
  "entry_date": "2024-01-15T10:30:00Z",
  "material_id": 1,
  "notes": "ملاحظات"
}
```

**ملاحظة:** `batch_number` يجب أن يكون فريداً

---

## 📝 ملاحظات عامة

### نمط الـ Endpoints:
جميع الـ endpoints تتبع نفس النمط:
- `GET /entity` - جلب جميع العناصر مع pagination
- `GET /entity/:id` - جلب عنصر محدد
- `POST /entity` - إنشاء عنصر جديد (Admin فقط)
- `PUT /entity/:id` - تحديث عنصر (Admin فقط)
- `DELETE /entity/:id` - حذف عنصر (Admin فقط)

### Pagination:
جميع الـ GET endpoints تدعم pagination:
- `page`: رقم الصفحة (افتراضي: 1)
- `limit`: عدد العناصر (افتراضي: 10، الحد الأقصى: 100)

### Error Responses:
```json
{
  "success": false,
  "error": "رسالة الخطأ",
  "details": "تفاصيل إضافية (في development mode فقط)"
}
```

### Status Codes:
- `200` - نجاح العملية
- `201` - تم الإنشاء بنجاح
- `400` - بيانات غير صالحة
- `401` - غير مصرح
- `403` - ممنوع (صلاحيات غير كافية)
- `404` - غير موجود
- `409` - تعارض (مثل: قيمة مكررة)
- `500` - خطأ في الخادم

