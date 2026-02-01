# 📚 User Management API Documentation

## نظام إدارة المستخدمين (CRUD)

تم إنشاء نظام كامل لإدارة المستخدمين مع جميع عمليات CRUD والحماية الكاملة.

---

## 🔐 Authentication

جميع المسارات تتطلب:
- **Authentication**: Bearer Token في الـ Header
- **Authorization**: صلاحية Admin فقط

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

---

## 📋 API Endpoints

### 1. Get All Users (قائمة المستخدمين)

**GET** `/user`

**Query Parameters:**
- `page` (optional): رقم الصفحة (default: 1)
- `limit` (optional): عدد العناصر في الصفحة (default: 10, max: 100)
- `search` (optional): البحث في الاسم، اسم المستخدم، أو رقم الهاتف
- `role` (optional): تصفية حسب الدور
- `isActive` (optional): تصفية حسب حالة التفعيل (true/false)

**Response:**
```json
{
  "success": true,
  "message": "تم جلب المستخدمين بنجاح",
  "data": {
    "users": [
      {
        "id": 1,
        "username": "user123",
        "phone": "+966501234567",
        "full_name": "أحمد محمد",
        "role": "sales",
        "country": "Saudi Arabia",
        "countryCode": "SA",
        "is_active": true,
        "created_at": "2024-01-01T00:00:00.000Z",
        "updated_at": "2024-01-01T00:00:00.000Z",
        "notes": null
      }
    ],
    "total": 50,
    "page": 1,
    "totalPages": 5,
    "limit": 10
  }
}
```

**Example:**
```bash
GET /user?page=1&limit=20&search=أحمد&role=sales&isActive=true
```

---

### 2. Get User by ID (جلب مستخدم محدد)

**GET** `/user/:id`

**URL Parameters:**
- `id` (required): معرف المستخدم

**Response:**
```json
{
  "success": true,
  "message": "تم جلب بيانات المستخدم بنجاح",
  "data": {
    "id": 1,
    "username": "user123",
    "phone": "+966501234567",
    "full_name": "أحمد محمد",
    "role": "sales",
    "country": "Saudi Arabia",
    "countryCode": "SA",
    "is_active": true,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z",
    "notes": "ملاحظات عن المستخدم",
    "fcmToken": null
  }
}
```

**Example:**
```bash
GET /user/1
```

---

### 3. Create User (إنشاء مستخدم جديد)

**POST** `/user`

**Request Body:**
```json
{
  "username": "newuser123",
  "phone": "+966501234567",
  "password": "SecurePass@123",
  "full_name": "محمد أحمد",
  "role": "sales",
  "notes": "ملاحظات اختيارية"
}
```

**Required Fields:**
- `username`: اسم المستخدم (6-50 حرف)
- `phone`: رقم الهاتف بصيغة دولية (+966...)
- `password`: كلمة المرور (8 أحرف على الأقل، حرف كبير + صغير + رقم + رمز خاص)
- `full_name`: الاسم الكامل (2-100 حرف)

**Optional Fields:**
- `role`: الدور (default: sales)
- `notes`: ملاحظات (max: 500 حرف)

**Available Roles:**
- `admin` - مدير النظام
- `accountant` - محاسب
- `sales` - مندوب مبيعات
- `Warehouse_Keeper` - أمين مستودع
- `Warehouse_Products` - مسؤول منتجات
- `Dissection_Technician` - فني تشريح
- `Cutting_Technician` - فني قص
- `Gluing_Technician` - فني لصق

**Response:**
```json
{
  "success": true,
  "message": "تم إنشاء المستخدم بنجاح",
  "data": {
    "id": 10,
    "username": "newuser123",
    "phone": "+966501234567",
    "full_name": "محمد أحمد",
    "role": "sales",
    "country": "Saudi Arabia",
    "countryCode": "SA",
    "is_active": true,
    "created_at": "2024-01-15T10:30:00.000Z",
    "notes": "ملاحظات اختيارية"
  }
}
```

---

### 4. Update User (تحديث بيانات مستخدم)

**PUT** `/user/:id`

**URL Parameters:**
- `id` (required): معرف المستخدم

**Request Body:** (جميع الحقول اختيارية)
```json
{
  "username": "updateduser",
  "phone": "+966509876543",
  "password": "NewSecurePass@456",
  "full_name": "محمد أحمد المحدث",
  "role": "accountant",
  "is_active": false,
  "notes": "ملاحظات محدثة"
}
```

**Response:**
```json
{
  "success": true,
  "message": "تم تحديث بيانات المستخدم بنجاح",
  "data": {
    "id": 10,
    "username": "updateduser",
    "phone": "+966509876543",
    "full_name": "محمد أحمد المحدث",
    "role": "accountant",
    "country": "Saudi Arabia",
    "countryCode": "SA",
    "is_active": false,
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-15T14:20:00.000Z",
    "notes": "ملاحظات محدثة"
  }
}
```

---

### 5. Delete User (حذف مستخدم)

**DELETE** `/user/:id`

**URL Parameters:**
- `id` (required): معرف المستخدم

**Notes:**
- لا يمكن للمدير حذف حسابه الخاص
- سيتم حذف جميع البيانات المرتبطة بالمستخدم (Cascade Delete)

**Response:**
```json
{
  "success": true,
  "message": "تم حذف المستخدم بنجاح",
  "data": {}
}
```

**Example:**
```bash
DELETE /user/10
```

---

### 6. Toggle User Status (تفعيل/تعطيل مستخدم)

**PATCH** `/user/:id/toggle-status`

**URL Parameters:**
- `id` (required): معرف المستخدم

**Notes:**
- لا يمكن للمدير تعطيل حسابه الخاص
- يقوم بعكس حالة التفعيل الحالية

**Response:**
```json
{
  "success": true,
  "message": "تم تعطيل المستخدم بنجاح",
  "data": {
    "id": 10,
    "username": "user123",
    "phone": "+966501234567",
    "full_name": "محمد أحمد",
    "role": "sales",
    "is_active": false,
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-15T15:00:00.000Z"
  }
}
```

**Example:**
```bash
PATCH /user/10/toggle-status
```

---

## ❌ Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "اسم المستخدم مسجل مسبقاً",
  "data": {}
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "ليس لديك الصلاحية"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "ليس لديك الصلاحية"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "المستخدم غير موجود",
  "data": {}
}
```

---

## 🔒 Security Features

1. **Authentication Required**: جميع المسارات تتطلب Bearer Token
2. **Admin Only**: فقط المستخدمين بصلاحية `admin` يمكنهم الوصول
3. **Password Hashing**: كلمات المرور يتم تشفيرها باستخدام bcrypt (12 rounds)
4. **Input Validation**: جميع المدخلات يتم التحقق منها
5. **XSS Protection**: حماية من هجمات XSS
6. **Rate Limiting**: حد أقصى للطلبات
7. **Logging**: تسجيل جميع العمليات

---

## 📝 Validation Rules

### Username
- مطلوب عند الإنشاء
- 6-50 حرف
- يجب أن يكون فريداً

### Phone
- مطلوب عند الإنشاء
- يجب أن يبدأ برمز الدولة (+)
- يجب أن يكون رقم هاتف صالح
- يجب أن يكون فريداً

### Password
- مطلوب عند الإنشاء
- 8 أحرف على الأقل
- يجب أن يحتوي على:
  - حرف كبير (A-Z)
  - حرف صغير (a-z)
  - رقم (0-9)
  - رمز خاص (@$!%*?&#)

### Full Name
- مطلوب عند الإنشاء
- 2-100 حرف

### Role
- اختياري (default: sales)
- يجب أن يكون من القائمة المسموحة

### Notes
- اختياري
- حد أقصى 500 حرف

---

## 🧪 Testing Examples

### Using cURL

```bash
# 1. Get all users
curl -X GET "http://localhost:3000/user?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"

# 2. Get user by ID
curl -X GET "http://localhost:3000/user/1" \
  -H "Authorization: Bearer YOUR_TOKEN"

# 3. Create user
curl -X POST "http://localhost:3000/user" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "phone": "+966501234567",
    "password": "SecurePass@123",
    "full_name": "Test User",
    "role": "sales"
  }'

# 4. Update user
curl -X PUT "http://localhost:3000/user/10" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Updated Name",
    "role": "accountant"
  }'

# 5. Delete user
curl -X DELETE "http://localhost:3000/user/10" \
  -H "Authorization: Bearer YOUR_TOKEN"

# 6. Toggle user status
curl -X PATCH "http://localhost:3000/user/10/toggle-status" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📊 Database Schema

```sql
Users {
  id: Int (Primary Key, Auto Increment)
  phone: String (Unique)
  username: String (Unique)
  password: String (Hashed)
  full_name: String
  role: Enum (UserRole)
  country: String (Nullable)
  countryCode: String (Nullable)
  is_active: Boolean (Default: true)
  currentSessionId: String (Nullable, Unique)
  fcmToken: String (Nullable)
  notes: String (Nullable)
  created_at: DateTime (Default: now)
  updated_at: DateTime (Auto Update)
}
```

---

## ✅ Features Implemented

- ✅ CRUD Operations كاملة
- ✅ Pagination & Filtering
- ✅ Search Functionality
- ✅ Input Validation
- ✅ Error Handling
- ✅ Authentication & Authorization
- ✅ Password Hashing
- ✅ Logging
- ✅ Security Best Practices
- ✅ API Documentation

---

## 🚀 Next Steps

1. اختبر جميع الـ endpoints
2. تأكد من الصلاحيات
3. راجع الـ logs
4. أضف المزيد من الفلاتر إذا لزم الأمر

