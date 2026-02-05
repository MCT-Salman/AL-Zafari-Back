# توثيق CRUD للكيانات الجديدة

تم إنشاء نظام CRUD كامل لـ **3 كيانات رئيسية**: العملاء (Customers)، الطلبات (Orders) مع عناصر الطلب (OrderItems)، والإعدادات (Settings).

---

## 📋 جدول المحتويات

1. [العملاء (Customers)](#العملاء-customers)
2. [الطلبات (Orders)](#الطلبات-orders)
3. [الإعدادات (Settings)](#الإعدادات-settings)
4. [الملفات المنشأة](#الملفات-المنشأة)
5. [الصلاحيات](#الصلاحيات)

---

## العملاء (Customers)

### نموذج البيانات
```javascript
{
  customer_id: Int (auto-increment),
  name: String,
  phone: String,
  customer_type: Enum (Branch, agent, customer),
  city: String,
  address: String,
  country: String (auto-generated),
  countryCode: String (auto-generated),
  is_active: Boolean (default: true),
  fcmToken: String (optional),
  notes: String (optional),
  created_at: DateTime
}
```

### API Endpoints

#### 1. جلب جميع العملاء
- **Method:** `GET`
- **URL:** `/customer`
- **Query Parameters:**
  - `customer_type` (optional): Branch | agent | customer
  - `city` (optional): String
  - `is_active` (optional): true | false
  - `search` (optional): String (البحث في الاسم أو الهاتف)
- **Auth:** Required (جميع المستخدمين)
- **Response:**
```json
{
  "success": true,
  "message": "تم جلب العملاء بنجاح",
  "data": {
    "customers": [...],
    "total": 100
  }
}
```

#### 2. جلب عميل واحد
- **Method:** `GET`
- **URL:** `/customer/:id`
- **Auth:** Required (جميع المستخدمين)
- **Response:** يتضمن آخر 5 طلبات وفواتير

#### 3. إنشاء عميل جديد
- **Method:** `POST`
- **URL:** `/customer`
- **Auth:** Required (Admin, Sales)
- **Body:**
```json
{
  "name": "اسم العميل",
  "phone": "+963912345678",
  "customer_type": "customer",
  "city": "دمشق",
  "address": "العنوان الكامل",
  "is_active": true,
  "notes": "ملاحظات اختيارية"
}
```

#### 4. تحديث عميل
- **Method:** `PUT`
- **URL:** `/customer/:id`
- **Auth:** Required (Admin, Sales)
- **Body:** نفس حقول الإنشاء (جميعها اختيارية)

#### 5. حذف عميل
- **Method:** `DELETE`
- **URL:** `/customer/:id`
- **Auth:** Required (Admin فقط)
- **Note:** لا يمكن حذف عميل لديه طلبات

---

## الطلبات (Orders)

### نموذج البيانات
```javascript
Order {
  order_id: Int (auto-increment),
  customer_id: Int,
  sales_user_id: Int (auto-filled from auth),
  status: Enum (pending, preparing, canceled, completed),
  total_amount: Decimal (auto-calculated),
  created_at: DateTime,
  notes: String (optional),
  items: OrderItem[]
}

OrderItem {
  order_item_id: Int (auto-increment),
  order_id: Int,
  type_item: Int,
  ruler_id: Int,
  constant_width: Decimal,
  length: Decimal,
  constant_thickness: Decimal,
  batch_id: Int,
  quantity: Int,
  unit_price: Decimal,
  subtotal: Decimal (auto-calculated),
  notes: String (optional)
}
```

### API Endpoints

#### 1. جلب جميع الطلبات
- **Method:** `GET`
- **URL:** `/order`
- **Query Parameters:**
  - `customer_id` (optional): Int
  - `status` (optional): pending | preparing | canceled | completed
  - `sales_user_id` (optional): Int
  - `start_date` (optional): ISO8601 Date
  - `end_date` (optional): ISO8601 Date
- **Auth:** Required (جميع المستخدمين)

#### 2. جلب طلب واحد
- **Method:** `GET`
- **URL:** `/order/:id`
- **Auth:** Required (جميع المستخدمين)
- **Response:** يتضمن تفاصيل العميل، البائع، العناصر، والفواتير

#### 3. إنشاء طلب جديد
- **Method:** `POST`
- **URL:** `/order`
- **Auth:** Required (Admin, Sales, Accountant)
- **Body:**
```json
{
  "customer_id": 1,
  "status": "pending",
  "notes": "ملاحظات الطلب",
  "items": [
    {
      "type_item": 1,
      "ruler_id": 1,
      "constant_width": 10.5,
      "length": 100.0,
      "constant_thickness": 2.5,
      "batch_id": 1,
      "quantity": 50,
      "unit_price": 25.50,
      "notes": "ملاحظات العنصر"
    }
  ]
}
```
- **Note:** 
  - `sales_user_id` يتم ملؤه تلقائياً من المستخدم المسجل
  - `total_amount` و `subtotal` يتم حسابهما تلقائياً

#### 4. تحديث طلب
- **Method:** `PUT`
- **URL:** `/order/:id`
- **Auth:** Required (Admin, Sales, Accountant)
- **Body:** يمكن تحديث الحقول الأساسية أو العناصر
- **Note:** عند تحديث العناصر، يتم حذف العناصر القديمة وإنشاء الجديدة

#### 5. حذف طلب
- **Method:** `DELETE`
- **URL:** `/order/:id`
- **Auth:** Required (Admin فقط)
- **Note:** لا يمكن حذف طلب لديه فواتير

---

## الإعدادات (Settings)

### نموذج البيانات
```javascript
{
  id: Int (auto-increment),
  key: String (unique),
  value: String,
  description: String,
  createdAt: DateTime,
  updatedAt: DateTime
}
```

### API Endpoints

#### 1. جلب جميع الإعدادات
- **Method:** `GET`
- **URL:** `/setting`
- **Query Parameters:**
  - `search` (optional): String (البحث في المفتاح أو الوصف)
- **Auth:** Required (جميع المستخدمين)

#### 2. جلب إعداد حسب ID
- **Method:** `GET`
- **URL:** `/setting/id/:id`
- **Auth:** Required (جميع المستخدمين)

#### 3. جلب إعداد حسب المفتاح
- **Method:** `GET`
- **URL:** `/setting/key/:key`
- **Auth:** Required (جميع المستخدمين)

#### 4. إنشاء إعداد جديد
- **Method:** `POST`
- **URL:** `/setting`
- **Auth:** Required (Admin فقط)
- **Body:**
```json
{
  "key": "app.name",
  "value": "Automation System",
  "description": "اسم التطبيق"
}
```
- **Note:** المفتاح يجب أن يحتوي على أحرف، أرقام، `_`، `.`، `-` فقط

#### 5. تحديث إعداد حسب ID
- **Method:** `PUT`
- **URL:** `/setting/id/:id`
- **Auth:** Required (Admin فقط)

#### 6. تحديث إعداد حسب المفتاح
- **Method:** `PUT`
- **URL:** `/setting/key/:key`
- **Auth:** Required (Admin فقط)

#### 7. حذف إعداد
- **Method:** `DELETE`
- **URL:** `/setting/id/:id`
- **Auth:** Required (Admin فقط)

#### 8. إنشاء أو تحديث إعداد (Upsert)
- **Method:** `POST`
- **URL:** `/setting/upsert/:key`
- **Auth:** Required (Admin فقط)
- **Body:**
```json
{
  "value": "القيمة الجديدة",
  "description": "الوصف"
}
```
- **Note:** إذا كان المفتاح موجوداً يتم التحديث، وإلا يتم الإنشاء

---

## الملفات المنشأة

### 1. Models (3 ملفات)
- ✅ `models/customer.model.js`
- ✅ `models/order.model.js`
- ✅ `models/orderItem.model.js`
- ✅ `models/setting.model.js`

### 2. Services (3 ملفات)
- ✅ `services/customer.service.js`
- ✅ `services/order.service.js`
- ✅ `services/setting.service.js`

### 3. Controllers (3 ملفات)
- ✅ `controllers/customer.controller.js`
- ✅ `controllers/order.controller.js`
- ✅ `controllers/setting.controller.js`

### 4. Validators (3 ملفات)
- ✅ `validators/customer.validators.js`
- ✅ `validators/order.validators.js`
- ✅ `validators/setting.validators.js`

### 5. Routes (3 ملفات)
- ✅ `routes/customer.routes.js`
- ✅ `routes/order.routes.js`
- ✅ `routes/setting.routes.js`

### 6. التكامل
- ✅ تم تحديث `app.js` لتسجيل جميع الـ Routes
- ✅ تم إضافة استثناءات CSRF للـ API routes الجديدة

---

## الصلاحيات

### العملاء (Customers)
- **القراءة (GET):** جميع المستخدمين المسجلين
- **الإنشاء (POST):** Admin, Sales
- **التحديث (PUT):** Admin, Sales
- **الحذف (DELETE):** Admin فقط

### الطلبات (Orders)
- **القراءة (GET):** جميع المستخدمين المسجلين
- **الإنشاء (POST):** Admin, Sales, Accountant
- **التحديث (PUT):** Admin, Sales, Accountant
- **الحذف (DELETE):** Admin فقط

### الإعدادات (Settings)
- **القراءة (GET):** جميع المستخدمين المسجلين
- **الإنشاء (POST):** Admin فقط
- **التحديث (PUT):** Admin فقط
- **الحذف (DELETE):** Admin فقط
- **Upsert (POST):** Admin فقط

---

## المميزات الرئيسية

### 1. التحقق من البيانات (Validation)
- ✅ التحقق من جميع الحقول المطلوبة
- ✅ التحقق من أنواع البيانات
- ✅ التحقق من Enum Values
- ✅ رسائل خطأ واضحة بالعربية

### 2. العلاقات (Relations)
- ✅ العملاء مرتبطون بالطلبات والفواتير
- ✅ الطلبات مرتبطة بالعملاء، البائعين، والعناصر
- ✅ عناصر الطلب مرتبطة بالمساطر والطبخات

### 3. الحسابات التلقائية
- ✅ حساب `total_amount` للطلب تلقائياً
- ✅ حساب `subtotal` لكل عنصر طلب تلقائياً
- ✅ استخراج معلومات الدولة من رقم الهاتف تلقائياً

### 4. المعاملات (Transactions)
- ✅ إنشاء الطلب مع عناصره في معاملة واحدة
- ✅ تحديث الطلب مع عناصره في معاملة واحدة
- ✅ حذف الطلب مع عناصره في معاملة واحدة

### 5. الأمان
- ✅ Authentication على جميع الـ routes
- ✅ Authorization حسب الدور
- ✅ التحقق من الصلاحيات قبل الحذف
- ✅ منع حذف البيانات المرتبطة

### 6. التسجيل (Logging)
- ✅ تسجيل جميع العمليات الهامة
- ✅ تسجيل الأخطاء مع التفاصيل

---

## أمثلة الاستخدام

### مثال 1: إنشاء عميل جديد
```bash
POST /customer
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "محمد أحمد",
  "phone": "+963912345678",
  "customer_type": "customer",
  "city": "دمشق",
  "address": "شارع الثورة، بناء 10"
}
```

### مثال 2: إنشاء طلب مع عناصره
```bash
POST /order
Authorization: Bearer <token>
Content-Type: application/json

{
  "customer_id": 1,
  "status": "pending",
  "notes": "طلب عاجل",
  "items": [
    {
      "type_item": 1,
      "ruler_id": 1,
      "constant_width": 10.5,
      "length": 100.0,
      "constant_thickness": 2.5,
      "batch_id": 1,
      "quantity": 50,
      "unit_price": 25.50
    },
    {
      "type_item": 2,
      "ruler_id": 2,
      "constant_width": 15.0,
      "length": 200.0,
      "constant_thickness": 3.0,
      "batch_id": 2,
      "quantity": 30,
      "unit_price": 35.00
    }
  ]
}
```

### مثال 3: تحديث إعداد
```bash
PUT /setting/key/app.name
Authorization: Bearer <token>
Content-Type: application/json

{
  "value": "نظام الأتمتة المتقدم",
  "description": "اسم التطبيق الرسمي"
}
```

---

## ملاحظات مهمة

1. **رقم الهاتف:** يجب أن يكون بصيغة دولية (مثل: +963912345678)
2. **الطلبات:** يجب أن يحتوي الطلب على عنصر واحد على الأقل
3. **الحذف:** لا يمكن حذف عميل لديه طلبات أو طلب لديه فواتير
4. **المفاتيح:** مفاتيح الإعدادات يجب أن تكون فريدة وتحتوي على أحرف وأرقام فقط
5. **الصلاحيات:** تأكد من أن المستخدم لديه الصلاحيات المناسبة قبل تنفيذ العمليات

---

## الخطوات التالية المقترحة

1. ✅ اختبار جميع الـ APIs
2. ✅ كتابة Unit Tests
3. ✅ إضافة Pagination للقوائم الطويلة
4. ✅ إضافة Sorting Options
5. ✅ إضافة Export/Import للبيانات

---

تم إنشاء هذا النظام بنجاح! 🎉


