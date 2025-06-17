# مستندات API - بک‌اند Exam-Edu

**نسخه:** v2.0.0  
**آخرین بروزرسانی:** 16 دی 1403  
**وضعیت:** ✅ آماده تولید  

---

## 📋 نمای کلی

این مستند شامل مستندات جامع تمام endpoint های سیستم بک‌اند Exam-Edu می‌باشد. API از معماری RESTful پیروی کرده و از JSON برای تبادل داده استفاده می‌کند.

## 🌐 آدرس پایه

```
Development: http://localhost:3000/api/v1
Staging: https://api-staging.soaledu.ir/api/v1
Production: https://api.soaledu.ir/api/v1
```

## 🔐 احراز هویت

اکثر endpoint ها نیاز به احراز هویت با JWT token دارند. توکن را در header Authorization قرار دهید:

```http
Authorization: Bearer <your-jwt-token>
```

## 🛡️ امنیت CSRF

برای endpoint های POST، PUT، DELETE نیاز به CSRF token است:

```http
X-CSRF-Token: <csrf-token>
```

**دریافت CSRF Token:**
```http
GET /api/v1/csrf-token
```

## 📊 فرمت پاسخ

تمام پاسخ‌های API از این فرمت استاندارد پیروی می‌کنند:

```json
{
  "success": true|false,
  "message": "پیام پاسخ",
  "data": {}, // داده‌های پاسخ (در صورت وجود)
  "errors": [], // جزئیات خطا (در صورت وجود)
  "meta": {} // اطلاعات اضافی مثل pagination
}
```

## 🚨 کدهای خطا

| کد | توضیح | مثال |
|-----|--------|-------|
| `200` | موفق | درخواست با موفقیت انجام شد |
| `201` | ایجاد شده | رکورد جدید ایجاد شد |
| `400` | درخواست نامعتبر | داده‌های ورودی اشتباه |
| `401` | غیرمجاز | نیاز به احراز هویت |
| `403` | ممنوع | عدم دسترسی |
| `404` | یافت نشد | منبع موجود نیست |
| `422` | خطای اعتبارسنجی | داده‌های ورودی نامعتبر |
| `429` | تعداد درخواست زیاد | Rate limit exceeded |
| `500` | خطای سرور | خطای داخلی سرور |

---

## 🔑 Authentication Endpoints

### POST /api/v1/auth/register
ثبت نام کاربر جدید

**Headers:**
```http
Content-Type: application/json
X-CSRF-Token: <csrf-token>
```

**Request Body:**
```json
{
  "firstName": "احمد",
  "lastName": "محمدی",
  "email": "ahmad@example.com",
  "password": "SecurePass123!",
  "nationalCode": "1234567890", // اختیاری
  "phoneNumber": "09123456789", // اختیاری
  "role": "student", // اختیاری، پیش‌فرض: student
  "gradeLevel": 12, // اختیاری
  "institutionId": "institution_id" // اختیاری
}
```

**Response:**
```json
{
  "success": true,
  "message": "کاربر با موفقیت ثبت نام شد",
  "data": {
    "user": {
      "id": "user_id",
      "firstName": "احمد",
      "lastName": "محمدی",
      "email": "ahmad@example.com",
      "role": "student",
      "profileCompleted": false
    },
    "tokens": {
      "accessToken": "jwt_access_token",
      "refreshToken": "jwt_refresh_token"
    }
  }
}
```

### POST /api/v1/auth/login
ورود کاربر و دریافت توکن دسترسی

**Headers:**
```http
Content-Type: application/json
X-CSRF-Token: <csrf-token>
```

**Request Body:**
```json
{
  "email": "ahmad@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "ورود موفقیت‌آمیز",
  "data": {
    "user": {
      "id": "user_id",
      "firstName": "احمد",
      "lastName": "محمدی",
      "email": "ahmad@example.com",
      "role": "student",
      "lastLoginAt": "2024-01-01T12:00:00.000Z"
    },
    "tokens": {
      "accessToken": "jwt_access_token",
      "refreshToken": "jwt_refresh_token"
    }
  }
}
```

### POST /api/v1/auth/refresh-token
تجدید توکن دسترسی

**Headers:**
```http
Content-Type: application/json
X-CSRF-Token: <csrf-token>
```

**Request Body:**
```json
{
  "refreshToken": "jwt_refresh_token"
}
```

### GET /api/v1/auth/me
دریافت اطلاعات کاربر فعلی

**Headers:**
```http
Authorization: Bearer <access_token>
```

### PUT /api/v1/auth/complete-profile
تکمیل پروفایل کاربر

**Headers:**
```http
Authorization: Bearer <access_token>
Content-Type: application/json
X-CSRF-Token: <csrf-token>
```

**Request Body:**
```json
{
  "nationalCode": "1234567890",
  "phoneNumber": "09123456789",
  "gradeLevel": 12,
  "bio": "توضیحات کاربر"
}
```

### POST /api/v1/auth/logout
خروج کاربر و ابطال توکن

**Headers:**
```http
Authorization: Bearer <access_token>
X-CSRF-Token: <csrf-token>
```

---

## 👤 User Management Endpoints

### GET /api/v1/users
دریافت لیست کاربران (فقط ادمین)

**Headers:**
```http
Authorization: Bearer <admin_token>
```

**Query Parameters:**
```
?page=1&limit=10&sort=createdAt&order=desc&role=student&search=احمد
```

### GET /api/v1/users/:id
دریافت اطلاعات کاربر خاص

**Headers:**
```http
Authorization: Bearer <token>
```

### PUT /api/v1/users/:id
بروزرسانی اطلاعات کاربر

**Headers:**
```http
Authorization: Bearer <token>
Content-Type: application/json
X-CSRF-Token: <csrf-token>
```

### DELETE /api/v1/users/:id
حذف کاربر (فقط ادمین)

**Headers:**
```http
Authorization: Bearer <admin_token>
X-CSRF-Token: <csrf-token>
```

---

## 📝 Question Management Endpoints

### POST /api/v1/questions
ایجاد سوال جدید

**Headers:**
```http
Authorization: Bearer <instructor_token>
Content-Type: application/json
X-CSRF-Token: <csrf-token>
```

**Request Body:**
```json
{
  "title": "عنوان سوال",
  "content": "محتوای سوال",
  "type": "multiple_choice",
  "difficulty": "medium",
  "category": "category_id",
  "lesson": "lesson_name",
  "tags": ["ریاضی", "جبر"],
  "options": [
    {
      "text": "گزینه اول",
      "isCorrect": false
    },
    {
      "text": "گزینه دوم",
      "isCorrect": true
    }
  ],
  "explanation": "توضیح پاسخ",
  "points": 5
}
```

### GET /api/v1/questions
دریافت لیست سوالات

**Query Parameters:**
```
?page=1&limit=10&category=category_id&difficulty=medium&search=ریاضی
```

### GET /api/v1/questions/:id
دریافت جزئیات سوال

### PUT /api/v1/questions/:id
بروزرسانی سوال

### DELETE /api/v1/questions/:id
حذف سوال

### GET /api/v1/questions/search
جستجو در سوالات

**Query Parameters:**
```
?q=کلمه کلیدی&category=category_id&difficulty=easy
```

### POST /api/v1/questions/bulk
ایجاد چندین سوال همزمان

### GET /api/v1/questions/stats
آمار سوالات

### POST /api/v1/questions/validate
اعتبارسنجی داده‌های سوال

---

## 📋 Exam Management Endpoints

### POST /api/v1/exams
ایجاد آزمون جدید

**Headers:**
```http
Authorization: Bearer <instructor_token>
Content-Type: application/json
X-CSRF-Token: <csrf-token>
```

**Request Body:**
```json
{
  "title": "آزمون ریاضی پایه دوازدهم",
  "description": "توضیحات آزمون",
  "duration": 90,
  "difficulty": "medium",
  "category": "category_id",
  "lesson": "جبر",
  "isPublic": true,
  "maxAttempts": 3,
  "passingScore": 60,
  "scheduledAt": "2024-01-15T10:00:00.000Z",
  "questions": ["question_id_1", "question_id_2"],
  "institutionId": "institution_id"
}
```

### GET /api/v1/exams
دریافت لیست آزمون‌ها

**Query Parameters:**
```
?page=1&limit=10&status=active&category=category_id&isPublic=true
```

### GET /api/v1/exams/:id
دریافت جزئیات آزمون

### PUT /api/v1/exams/:id
بروزرسانی آزمون

### DELETE /api/v1/exams/:id
حذف آزمون

### POST /api/v1/exams/:id/publish
انتشار آزمون

### POST /api/v1/exams/:id/start
شروع جلسه آزمون

### POST /api/v1/exams/:id/submit
ارسال پاسخ‌های آزمون

### GET /api/v1/exams/:id/results
دریافت نتایج آزمون

### GET /api/v1/exams/stats
آمار آزمون‌ها

---

## 📚 Category Management Endpoints

### POST /api/v1/categories
ایجاد دسته‌بندی جدید

**Headers:**
```http
Authorization: Bearer <admin_token>
Content-Type: application/json
X-CSRF-Token: <csrf-token>
```

**Request Body:**
```json
{
  "name": "ریاضی",
  "slug": "math",
  "description": "دروس ریاضی",
  "parentId": "parent_category_id",
  "order": 1,
  "isActive": true
}
```

### GET /api/v1/categories
دریافت لیست دسته‌بندی‌ها

### GET /api/v1/categories/:id
دریافت جزئیات دسته‌بندی

### PUT /api/v1/categories/:id
بروزرسانی دسته‌بندی

### DELETE /api/v1/categories/:id
حذف دسته‌بندی

---

## 🏢 Institution Management Endpoints

### POST /api/v1/institutions
ایجاد سازمان جدید

**Headers:**
```http
Authorization: Bearer <admin_token>
Content-Type: application/json
X-CSRF-Token: <csrf-token>
```

**Request Body:**
```json
{
  "name": "دانشگاه تهران",
  "domain": "ut.ac.ir",
  "type": "university",
  "city": "تهران",
  "province": "تهران",
  "description": "توضیحات سازمان",
  "adminUserId": "admin_user_id"
}
```

### GET /api/v1/institutions
دریافت لیست سازمان‌ها

### GET /api/v1/institutions/:id
دریافت جزئیات سازمان

### PUT /api/v1/institutions/:id
بروزرسانی سازمان

### DELETE /api/v1/institutions/:id
حذف سازمان

---

## 💰 Payment & Transaction Endpoints

### POST /api/v1/payments
ایجاد پرداخت جدید

**Headers:**
```http
Authorization: Bearer <token>
Content-Type: application/json
X-CSRF-Token: <csrf-token>
```

**Request Body:**
```json
{
  "amount": 50000,
  "gateway": "zarinpal",
  "description": "خرید آزمون",
  "callbackUrl": "https://example.com/callback"
}
```

### GET /api/v1/payments
دریافت لیست پرداخت‌ها

### GET /api/v1/payments/:id
دریافت جزئیات پرداخت

### POST /api/v1/payments/:id/verify
تایید پرداخت

### GET /api/v1/transactions
دریافت لیست تراکنش‌ها

### GET /api/v1/transactions/:id
دریافت جزئیات تراکنش

---

## 🎫 Discount Code Endpoints

### POST /api/v1/discount-codes
ایجاد کد تخفیف جدید

**Headers:**
```http
Authorization: Bearer <admin_token>
Content-Type: application/json
X-CSRF-Token: <csrf-token>
```

**Request Body:**
```json
{
  "code": "SUMMER2024",
  "type": "percentage",
  "value": 20,
  "maxUsage": 100,
  "validFrom": "2024-06-01T00:00:00.000Z",
  "validTo": "2024-08-31T23:59:59.000Z",
  "institutionId": "institution_id"
}
```

### GET /api/v1/discount-codes
دریافت لیست کدهای تخفیف

### POST /api/v1/discount-codes/validate
اعتبارسنجی کد تخفیف

### PUT /api/v1/discount-codes/:id
بروزرسانی کد تخفیف

### DELETE /api/v1/discount-codes/:id
حذف کد تخفیف

---

## 💳 Wallet Management Endpoints

### GET /api/v1/wallet
دریافت اطلاعات کیف پول

**Headers:**
```http
Authorization: Bearer <token>
```

### POST /api/v1/wallet/charge
شارژ کیف پول

**Headers:**
```http
Authorization: Bearer <token>
Content-Type: application/json
X-CSRF-Token: <csrf-token>
```

**Request Body:**
```json
{
  "amount": 100000,
  "gateway": "zarinpal"
}
```

### GET /api/v1/wallet/transactions
دریافت تراکنش‌های کیف پول

---

## 📞 Contact Management Endpoints

### POST /api/v1/contact
ارسال پیام تماس

**Headers:**
```http
Content-Type: application/json
X-CSRF-Token: <csrf-token>
```

**Request Body:**
```json
{
  "name": "احمد محمدی",
  "email": "ahmad@example.com",
  "phone": "09123456789",
  "subject": "موضوع پیام",
  "message": "متن پیام",
  "type": "support",
  "priority": "medium"
}
```

### GET /api/v1/contact
دریافت لیست پیام‌ها (فقط ادمین)

### GET /api/v1/contact/:id
دریافت جزئیات پیام

### PUT /api/v1/contact/:id
بروزرسانی وضعیت پیام

---

## 📊 Analytics & Statistics Endpoints

### GET /api/v1/analytics/dashboard
داشبورد آمار کلی

**Headers:**
```http
Authorization: Bearer <token>
```

### GET /api/v1/analytics/exams
آمار آزمون‌ها

### GET /api/v1/analytics/questions
آمار سوالات

### GET /api/v1/analytics/users
آمار کاربران

### GET /api/v1/analytics/performance
آمار عملکرد سیستم

---

## 📁 File Upload Endpoints

### POST /api/v1/upload/image
آپلود تصویر

**Headers:**
```http
Authorization: Bearer <token>
Content-Type: multipart/form-data
X-CSRF-Token: <csrf-token>
```

**Form Data:**
```
file: [image file] (max 5MB, PNG/JPG only)
```

**Response:**
```json
{
  "success": true,
  "message": "فایل با موفقیت آپلود شد",
  "data": {
    "url": "https://example.com/uploads/image.jpg",
    "filename": "image.jpg",
    "size": 1024000
  }
}
```

---

## 🔍 Search Endpoints

### GET /api/v1/search
جستجوی عمومی

**Query Parameters:**
```
?q=کلمه کلیدی&type=questions&category=category_id&page=1&limit=10
```

### GET /api/v1/search/suggestions
پیشنهادات جستجو

**Query Parameters:**
```
?q=کلمه کلیدی&limit=5
```

---

## 🏥 Health Check Endpoints

### GET /api/health
بررسی سلامت سیستم

**Response:**
```json
{
  "success": true,
  "message": "سیستم سالم است",
  "data": {
    "status": "healthy",
    "timestamp": "2024-01-01T12:00:00.000Z",
    "uptime": 3600,
    "version": "2.0.0"
  }
}
```

### GET /api/health/detailed
بررسی تفصیلی سلامت سیستم

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "services": {
      "database": "connected",
      "redis": "connected",
      "storage": "available"
    },
    "performance": {
      "responseTime": "50ms",
      "memoryUsage": "45%",
      "cpuUsage": "30%"
    }
  }
}
```

---

## 🔧 Utility Endpoints

### GET /api/v1/csrf-token
دریافت CSRF token

**Response:**
```json
{
  "success": true,
  "data": {
    "csrfToken": "csrf_token_value"
  }
}
```

### GET /api/v1/config
دریافت تنظیمات عمومی

**Response:**
```json
{
  "success": true,
  "data": {
    "appName": "Exam-Edu",
    "version": "2.0.0",
    "supportedLanguages": ["fa", "en"],
    "maxFileSize": 5242880,
    "allowedFileTypes": ["image/jpeg", "image/png"]
  }
}
```

---

## 📝 Validation Rules

### کد ملی ایرانی
- باید ۱۰ رقم باشد
- الگوریتم اعتبارسنجی کد ملی ایرانی

### شماره موبایل ایرانی
- فرمت: `09xxxxxxxxx`
- پشتیبانی از `+98` و `98`

### رمز عبور
- حداقل ۸ کاراکتر
- شامل حروف کوچک، بزرگ، عدد و کاراکتر خاص

### نام‌های فارسی
- فقط حروف فارسی و فاصله
- حداقل ۲ کاراکتر، حداکثر ۵۰ کاراکتر

---

## 🚦 Rate Limiting

| Endpoint Type | Limit | Window |
|---------------|-------|--------|
| Authentication | 5 requests | 15 minutes |
| General API | 100 requests | 15 minutes |
| File Upload | 10 requests | 15 minutes |
| Search | 50 requests | 15 minutes |

---

## 📚 SDK و کتابخانه‌ها

### JavaScript/TypeScript
```javascript
import { ExamEduAPI } from '@exam-edu/api-client';

const api = new ExamEduAPI({
  baseURL: 'https://api.soaledu.ir/api/v1',
  apiKey: 'your-api-key'
});

// استفاده
const user = await api.auth.login({
  email: 'user@example.com',
  password: 'password'
});
```

### Python
```python
from exam_edu_api import ExamEduClient

client = ExamEduClient(
    base_url='https://api.soaledu.ir/api/v1',
    api_key='your-api-key'
)

# استفاده
user = client.auth.login(
    email='user@example.com',
    password='password'
)
```

---

## 🐛 خطایابی

### لاگ‌های مفید
```bash
# مشاهده لاگ‌های API
tail -f logs/api.log

# مشاهده لاگ‌های خطا
tail -f logs/error.log

# مشاهده لاگ‌های امنیتی
tail -f logs/security.log
```

### ابزارهای مانیتورینگ
- **Health Check:** `/api/health`
- **Metrics:** `/api/metrics`
- **Status:** `/api/status`

---

## 📞 پشتیبانی

### تماس با تیم توسعه
- **ایمیل:** dev@soaledu.ir
- **تلگرام:** @soaledu_support
- **مستندات:** https://docs.soaledu.ir

### گزارش باگ
لطفاً باگ‌ها را در GitHub Issues گزارش دهید:
https://github.com/soaledu/backend/issues

---

**نکته:** این مستندات بر اساس نسخه v2.0.0 تهیه شده است. برای آخرین تغییرات، لطفاً به مخزن GitHub مراجعه کنید.

---

*آخرین بروزرسانی: 16 دی 1403*
