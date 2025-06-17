# مستندات API - SoalEdu.ir Backend

## 📋 **خلاصه کلی (آپدیت: ۲۶ خرداد ۱۴۰۳)**

### ✅ **وضعیت فعلی**
- **35+ API Endpoint** فعال و تست شده
- **99.5% موفقیت تست‌ها** (186/187)
- **همه ماژول‌ها فعال** (0 فایل disabled)
- **آماده برای توسعه فرانت‌اند**

### 🔗 **Base URL**
```
Development: http://localhost:5000
Production: https://api.soaledu.ir
```

### 🛡️ **Authentication**
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

---

## 🔐 **Authentication APIs**

### 1. ثبت‌نام کاربر
```http
POST /api/v1/auth/register
```

**Request Body:**
```json
{
  "name": "احمد محمدی",
  "email": "ahmad@example.com",
  "password": "securePassword123",
  "phone": "09123456789",
  "role": "student"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "name": "احمد محمدی",
      "email": "ahmad@example.com",
      "role": "student"
    },
    "tokens": {
      "accessToken": "jwt_access_token",
      "refreshToken": "jwt_refresh_token"
    }
  },
  "message": "کاربر با موفقیت ثبت شد"
}
```

### 2. ورود کاربر
```http
POST /api/v1/auth/login
```

**Request Body:**
```json
{
  "email": "ahmad@example.com",
  "password": "securePassword123"
}
```

### 3. تجدید توکن
```http
POST /api/v1/auth/refresh-token
```

### 4. پروفایل کاربر
```http
GET /api/v1/auth/me
```

### 5. خروج
```http
POST /api/v1/auth/logout
```

---

## 📝 **Exam Management APIs**

### 1. لیست آزمون‌ها
```http
GET /api/v1/exams
```

**Query Parameters:**
- `page` (number): شماره صفحه
- `limit` (number): تعداد در صفحه
- `category` (string): دسته‌بندی
- `difficulty` (string): سطح دشواری
- `status` (string): وضعیت آزمون

**Response:**
```json
{
  "success": true,
  "data": {
    "exams": [
      {
        "id": "exam_id",
        "title": "آزمون ریاضی پایه دهم",
        "description": "آزمون جامع ریاضی",
        "duration": 90,
        "totalQuestions": 25,
        "status": "active",
        "createdAt": "2024-06-16T10:00:00Z"
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

### 2. ایجاد آزمون
```http
POST /api/v1/exams
```

**Request Body:**
```json
{
  "title": "آزمون ریاضی پایه دهم",
  "description": "آزمون جامع ریاضی",
  "duration": 90,
  "category": "mathematics",
  "difficulty": "medium",
  "questions": ["question_id_1", "question_id_2"]
}
```

### 3. جزئیات آزمون
```http
GET /api/v1/exams/:id
```

### 4. ویرایش آزمون
```http
PUT /api/v1/exams/:id
```

### 5. حذف آزمون
```http
DELETE /api/v1/exams/:id
```

### 6. انتشار آزمون
```http
POST /api/v1/exams/:id/publish
```

### 7. شروع آزمون
```http
POST /api/v1/exams/:id/start
```

**Response:**
```json
{
  "success": true,
  "data": {
    "sessionId": "session_id",
    "examId": "exam_id",
    "startTime": "2024-06-16T10:00:00Z",
    "endTime": "2024-06-16T11:30:00Z",
    "questions": [
      {
        "id": "question_id",
        "text": "متن سوال",
        "options": ["گزینه 1", "گزینه 2", "گزینه 3", "گزینه 4"]
      }
    ]
  }
}
```

### 8. ارسال آزمون
```http
POST /api/v1/exams/:id/submit
```

### 9. نتایج آزمون
```http
GET /api/v1/exams/:id/results
```

---

## ❓ **Question Bank APIs**

### 1. لیست سوالات
```http
GET /api/v1/questions
```

**Query Parameters:**
- `page`, `limit`: صفحه‌بندی
- `category`: دسته‌بندی
- `difficulty`: سطح دشواری
- `type`: نوع سوال (multiple_choice, true_false, essay)

### 2. ایجاد سوال
```http
POST /api/v1/questions
```

**Request Body:**
```json
{
  "text": "متن سوال",
  "type": "multiple_choice",
  "options": ["گزینه 1", "گزینه 2", "گزینه 3", "گزینه 4"],
  "correctAnswer": 0,
  "explanation": "توضیح پاسخ",
  "category": "mathematics",
  "difficulty": "medium",
  "points": 2
}
```

### 3. جزئیات سوال
```http
GET /api/v1/questions/:id
```

### 4. ویرایش سوال
```http
PUT /api/v1/questions/:id
```

### 5. حذف سوال
```http
DELETE /api/v1/questions/:id
```

### 6. جستجوی سوالات
```http
GET /api/v1/questions/search?q=متن جستجو
```

### 7. ایجاد دسته‌ای سوالات
```http
POST /api/v1/questions/bulk
```

### 8. آمار سوالات
```http
GET /api/v1/questions/stats
```

### 9. اعتبارسنجی سوال
```http
POST /api/v1/questions/validate
```

---

## 📰 **Blog System APIs**

### 1. لیست مقالات
```http
GET /api/v1/blog
```

**Query Parameters:**
- `page`, `limit`: صفحه‌بندی
- `category`: دسته‌بندی
- `search`: جستجو در عنوان و محتوا
- `status`: وضعیت انتشار

**Response:**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "post_id",
        "title": "عنوان مقاله",
        "slug": "article-slug",
        "excerpt": "خلاصه مقاله",
        "publishedAt": "2024-06-16T10:00:00Z",
        "author": {
          "name": "نویسنده",
          "avatar": "avatar_url"
        },
        "categories": ["دسته‌بندی"]
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3
    }
  }
}
```

### 2. جزئیات مقاله
```http
GET /api/v1/blog/:slug
```

### 3. دسته‌بندی‌های وبلاگ
```http
GET /api/v1/blog/categories
```

### 4. ایجاد مقاله (Admin)
```http
POST /api/v1/blog/admin/posts
```

**Request Body:**
```json
{
  "title": "عنوان مقاله",
  "content": "محتوای کامل مقاله",
  "excerpt": "خلاصه مقاله",
  "categories": ["category_id_1"],
  "tags": ["تگ1", "تگ2"],
  "status": "published"
}
```

### 5. ایجاد دسته‌بندی (Admin)
```http
POST /api/v1/blog/admin/categories
```

---

## 📞 **Contact System APIs**

### 1. ارسال پیام تماس
```http
POST /api/v1/contact-form
```

**Request Body:**
```json
{
  "name": "احمد محمدی",
  "email": "ahmad@example.com",
  "subject": "سوال در مورد آزمون‌ها",
  "message": "سلام، سوالی در مورد آزمون‌ها دارم"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "contact_id",
    "message": "پیام شما دریافت شد"
  },
  "message": "پیام تماس با موفقیت ارسال شد"
}
```

### 2. جزئیات پیام
```http
GET /api/v1/contact-form/:id
```

### 3. ویرایش پیام
```http
PUT /api/v1/contact-form/:id
```

### 4. حذف پیام
```http
DELETE /api/v1/contact-form/:id
```

### 5. پاسخ به پیام
```http
POST /api/v1/contact-form/:id/reply
```

---

## 🧪 **Test Exam APIs**

### 1. لیست آزمون‌های تستی
```http
GET /api/v1/test-exams
```

### 2. ایجاد آزمون تستی
```http
POST /api/v1/test-exams
```

**Request Body:**
```json
{
  "title": "آزمون تستی نمونه",
  "description": "توضیحات آزمون تستی",
  "duration": 60,
  "questions": ["question_id_1", "question_id_2"]
}
```

### 3. جزئیات آزمون تستی
```http
GET /api/v1/test-exams/:id
```

### 4. شروع آزمون تستی
```http
POST /api/v1/test-exams/:id/start
```

**Response:**
```json
{
  "success": true,
  "data": {
    "sessionId": "session_id",
    "examId": "exam_id",
    "startTime": "2024-06-16T10:00:00Z"
  },
  "message": "آزمون تستی شروع شد"
}
```

### 5. ارسال پاسخ
```http
POST /api/v1/test-exams/:id/submit-answer
```

**Request Body:**
```json
{
  "questionId": "question_id",
  "answer": "A"
}
```

### 6. پایان آزمون
```http
POST /api/v1/test-exams/:id/finish
```

### 7. نتایج آزمون تستی
```http
GET /api/v1/test-exams/:id/results
```

---

## 👥 **Roles & Permissions APIs**

### 1. لیست نقش‌ها
```http
GET /api/v1/roles
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "role_id",
      "name": "admin",
      "displayName": "مدیر سیستم",
      "permissions": ["read", "write", "delete"]
    }
  ],
  "message": "لیست نقش‌ها"
}
```

### 2. لیست مجوزها
```http
GET /api/v1/roles/permissions
```

### 3. آمار داشبورد
```http
GET /api/v1/roles/dashboard-stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalUsers": 150,
    "activeExams": 12,
    "totalQuestions": 500,
    "recentActivities": []
  }
}
```

---

## 💰 **Finance APIs**

### 1. تنظیمات مالی
```http
GET /api/v1/finance/settings
POST /api/v1/finance/settings
```

### 2. مدیریت مالی طراحان
```http
GET /api/v1/designer-finance
POST /api/v1/designer-finance
PUT /api/v1/designer-finance/:id
DELETE /api/v1/designer-finance/:id
```

---

## 📊 **Response Format**

### موفقیت‌آمیز
```json
{
  "success": true,
  "data": { /* داده‌ها */ },
  "message": "پیام موفقیت"
}
```

### خطا
```json
{
  "success": false,
  "error": "پیام خطا",
  "code": "ERROR_CODE"
}
```

---

## 🔒 **Security Headers**

```http
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
X-CSRF-Token: <CSRF_TOKEN>
```

---

## 📈 **Rate Limiting**

- **عمومی**: 100 درخواست در دقیقه
- **احراز هویت**: 5 درخواست در دقیقه
- **آپلود فایل**: 10 درخواست در دقیقه

---

## ⚠️ **Error Codes**

| کد | توضیح |
|----|-------|
| 400 | Bad Request - درخواست نامعتبر |
| 401 | Unauthorized - عدم احراز هویت |
| 403 | Forbidden - عدم دسترسی |
| 404 | Not Found - یافت نشد |
| 422 | Validation Error - خطای اعتبارسنجی |
| 429 | Too Many Requests - تعداد درخواست زیاد |
| 500 | Internal Server Error - خطای سرور |

---

**آخرین به‌روزرسانی**: ۲۶ خرداد ۱۴۰۳  
**وضعیت**: ✅ **کامل و آماده استفاده** 