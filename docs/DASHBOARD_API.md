# 📊 Dashboard API Documentation
## لوحة إحصائيات المدير

### نظرة عامة
توفر هذه الـ API إحصائيات شاملة للمديرين حول النظام بالكامل، بما في ذلك:
- **إجمالي المبيعات لليوم** - إجمالي الإيرادات من الفواتير اليوم
- **عدد الفواتير** - عدد الفواتير الصادرة اليوم
- **عدد الطلبات حسب الحالة** - قيد الانتظار، قيد التجهيز، مكتملة
- **طلبات الإنتاج الموجودة حالياً** - جميع طلبات الإنتاج النشطة
- **العمليات الموجودة** - مخرجات الإنتاج من جميع الأقسام:
  - مخرجات أمين المستودع
  - مخرجات التشريح
  - مخرجات القص
  - مخرجات التغرية

---

## 🔐 الصلاحيات المطلوبة

جميع نقاط النهاية (endpoints) تتطلب:
- **المصادقة**: `requireAuth` middleware
- **الأدوار**: `admin`, `production_manager`, أو `sales`

---

## 📍 Endpoints

### 1. إحصائيات شاملة للمدير

```http
GET /dashboard/stats?period=month
```

#### المعاملات (Query Parameters)

| المعامل | النوع | الافتراضي | الوصف |
|---------|------|----------|------|
| `period` | string | `month` | الفترة الزمنية: `day`, `week`, `month`, `year` |

#### مثال على الطلب

```bash
curl -X GET "http://localhost:3000/dashboard/stats?period=week" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### مثال على الاستجابة

```json
{
  "success": true,
  "message": "تم جلب إحصائيات المدير بنجاح",
  "data": {
    "period": "month",
    "todaySales": 2500000,
    "todayInvoicesCount": 15,
    "orders": {
      "pending": 5,
      "preparing": 8,
      "completed": 120,
      "total": 133
    },
    "currentProductionOrders": [
      {
        "productionOrderId": 42,
        "status": "preparing",
        "createdAt": "2026-04-02T08:30:00.000Z",
        "issuedBy": {
          "id": 5,
          "username": "prod_manager",
          "fullName": "أحمد محمد"
        },
        "itemsCount": 10,
        "notes": "طلب عاجل"
      }
    ],
    "productionOutputs": {
      "warehouseOutputs": [
        {
          "movementId": 150,
          "userName": "خالد السيد",
          "userRole": "warehouse_keeper",
          "destination": "cutting",
          "colorName": "أزرق",
          "batchNumber": "B-2024-001",
          "quantity": 50,
          "dimensions": {
            "length": 300,
            "width": 120,
            "thickness": 0.5
          },
          "createdAt": "2026-04-02T10:15:00.000Z",
          "notes": null
        }
      ],
      "cuttingOutputs": [
        {
          "processId": 85,
          "userName": "محمد علي",
          "userRole": "cutting_operator",
          "type": "cutting",
          "source": "warehouse",
          "destination": "production",
          "colorName": "أحمر",
          "batchNumber": "B-2024-002",
          "inputDimensions": {
            "width": 120,
            "length": 250
          },
          "outputLength": "100x2, 50x2",
          "waste": 2.5,
          "createdAt": "2026-04-02T09:45:00.000Z",
          "notes": null
        }
      ],
      "gluingOutputs": [
        {
          "processId": 92,
          "userName": "سامي حسن",
          "userRole": "production_worker",
          "type": "gluing",
          "source": "cutting",
          "destination": "production",
          "colorName": "أخضر",
          "batchNumber": "B-2024-003",
          "inputDimensions": {
            "width": 100,
            "length": 200
          },
          "outputLength": "200x1",
          "waste": 1.2,
          "createdAt": "2026-04-02T11:20:00.000Z",
          "notes": "جودة ممتازة"
        }
      ],
      "slittingOutputs": [
        {
          "processId": 78,
          "userName": "يوسف إبراهيم",
          "userRole": "slitting_operator",
          "type": "cutting",
          "source": "slitting",
          "destination": "production",
          "colorName": "أصفر",
          "batchNumber": "B-2024-004",
          "inputDimensions": {
            "width": 150,
            "length": 300
          },
          "outputLength": "150x2",
          "waste": 0.8,
          "createdAt": "2026-04-02T08:50:00.000Z",
          "notes": null
        }
      ]
    }
  }
}
```

---

## 📊 هيكل البيانات

### الحقول الرئيسية
| الحقل | النوع | الوصف |
|------|------|------|
| `period` | string | الفترة الزمنية المحددة |
| `todaySales` | number | إجمالي المبيعات لليوم بالليرة السورية |
| `todayInvoicesCount` | number | عدد الفواتير الصادرة اليوم |
| `orders` | object | إحصائيات الطلبات حسب الحالة |
| `currentProductionOrders` | array | طلبات الإنتاج الموجودة حالياً |
| `productionOutputs` | object | العمليات الموجودة - مخرجات الإنتاج |

### Orders (الطلبات)
| الحقل | النوع | الوصف |
|------|------|------|
| `pending` | number | عدد الطلبات قيد الانتظار |
| `preparing` | number | عدد الطلبات قيد التجهيز |
| `completed` | number | عدد الطلبات المكتملة |
| `total` | number | إجمالي عدد الطلبات |

### Current Production Orders (طلبات الإنتاج الحالية)
| الحقل | النوع | الوصف |
|------|------|------|
| `productionOrderId` | number | معرف طلب الإنتاج |
| `status` | string | الحالة: `pending` أو `preparing` |
| `createdAt` | DateTime | تاريخ الإنشاء |
| `issuedBy` | object | بيانات المستخدم الذي أصدر الطلب |
| `itemsCount` | number | عدد العناصر في الطلب |
| `notes` | string \| null | ملاحظات |

### Production Outputs (مخرجات الإنتاج)

#### Warehouse Outputs (مخرجات أمين المستودع)
| الحقل | النوع | الوصف |
|------|------|------|
| `movementId` | number | معرف الحركة |
| `userName` | string | اسم المستخدم |
| `userRole` | string | دور المستخدم |
| `destination` | string | الوجهة: `slitting`, `cutting`, `gluing`, `production` |
| `colorName` | string | اسم اللون |
| `batchNumber` | string | رقم الدفعة |
| `quantity` | number | الكمية |
| `dimensions` | object | الأبعاد (طول، عرض، سماكة) |
| `createdAt` | DateTime | تاريخ الإنشاء |

#### Cutting/Gluing/Slitting Outputs (مخرجات القص/التغرية/التشريح)
| الحقل | النوع | الوصف |
|------|------|------|
| `processId` | number | معرف العملية |
| `userName` | string | اسم المستخدم |
| `type` | string | نوع العملية: `cutting` أو `gluing` |
| `source` | string | المصدر |
| `destination` | string | الوجهة |
| `colorName` | string | اسم اللون |
| `batchNumber` | string | رقم الدفعة |
| `inputDimensions` | object | أبعاد الإدخال |
| `outputLength` | string | طول الإخراج |
| `waste` | number | الهدر بالكيلوغرام |
| `createdAt` | DateTime | تاريخ الإنشاء |

---

## 🎯 حالات الخطأ

### 401 Unauthorized
```json
{
  "success": false,
  "message": "غير مصرح لك بالوصول"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "ليس لديك الصلاحية للوصول لهذا المورد"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "حدث خطأ أثناء جلب الإحصائيات"
}
```

---

## 📝 ملاحظات

1. **الأداء**: جميع الاستعلامات يتم تنفيذها بشكل متوازي باستخدام `Promise.all`
2. **الذاكرة المؤقتة**: يُنصح بإضافة caching للنتائج في بيئة الإنتاج
3. **الحماية**: جميع المسارات محمية بـ authentication و role-based authorization
4. **الفترات المتاحة**:
   - `day`: اليوم الحالي (من منتصف الليل)
   - `week`: آخر 7 أيام
   - `month`: آخر 30 يوم (افتراضي)
   - `year`: آخر 365 يوم

---

## 🖥️ الواجهة الأمامية

تم إنشاء صفحة HTML تفاعلية لعرض الإحصائيات:

**URL**: `http://localhost:3000/dashboard.html`

**المميزات**:
- ✅ عرض مرئي جذاب للإحصائيات
- ✅ اختيار الفترة الزمنية (يوم، أسبوع، شهر، سنة)
- ✅ تحديث تلقائي للبيانات
- ✅ تنظيم حسب الفئات
- ✅ ألوان وأيقونات واضحة

---

## 🔧 التطوير المستقبلي

اقتراحات للتحسين:
1. إضافة رسوم بيانية (Charts.js)
2. تصدير البيانات إلى Excel/PDF
3. مقارنة بين فترتين زمنيتين
4. إشعارات عند انخفاض المخزون
5. إحصائيات في الوقت الفعلي (Real-time)

---

**تم إنشاء التوثيق بواسطة**: Augment Agent  
**التاريخ**: 2026-04-02

