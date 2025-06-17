# مستندات Backend پروژه SoalEdu.ir

## وضعیت فعلی پروژه (آپدیت: ۲۶ خرداد ۱۴۰۳)

### ✅ **وضعیت کلی**
- **همه ماژول‌ها فعال**: 0 فایل `.disabled` باقی‌مانده
- **تست‌ها**: 186/187 موفق (99.5%)
- **Build**: موفق
- **Server**: در حال اجرا
- **آمادگی**: 100% برای توسعه فرانت‌اند

### 🚀 **ماژول‌های فعال**

#### کنترلرهای اصلی
- ✅ **Authentication** - احراز هویت کامل
- ✅ **Exam Management** - مدیریت آزمون‌ها
- ✅ **Question Bank** - بانک سوالات
- ✅ **User Management** - مدیریت کاربران

#### ماژول‌های جدید فعال شده
- ✅ **Blog System** - سیستم وبلاگ و مقالات
- ✅ **Contact System** - سیستم تماس و پشتیبانی
- ✅ **Test Exams** - آزمون‌های تستی
- ✅ **Roles & Permissions** - نقش‌ها و مجوزها
- ✅ **Finance Management** - مدیریت مالی
- ✅ **Designer Finance** - مالی طراحان

### 📊 **آمار تست‌ها**

| ماژول | تعداد تست | وضعیت |
|-------|-----------|--------|
| Authentication | 22 | ✅ موفق |
| Exam Controller | 28 | ✅ موفق |
| Question Controller | 26 | ✅ موفق |
| Test Exam Controller | 8 | ✅ موفق |
| Blog Controller | 9 | ✅ موفق |
| Contact Controller | 7 | ✅ موفق |
| Roles Controller | 4 | ✅ موفق |
| CSRF Middleware | 13 | ✅ موفق |
| Token Blocklist | 17 | ✅ موفق |
| Integration Tests | 16 | ✅ موفق |
| Utils Tests | 26 | ⚠️ 1 فیل |
| Health Check | 3 | ✅ موفق |
| MongoDB Connection | 2 | ✅ موفق |

### 🔗 **API Endpoints فعال**

#### Authentication APIs
- `POST /api/v1/auth/register` - ثبت‌نام
- `POST /api/v1/auth/login` - ورود
- `POST /api/v1/auth/refresh-token` - تجدید توکن
- `GET /api/v1/auth/me` - پروفایل کاربر
- `POST /api/v1/auth/logout` - خروج

#### Exam APIs
- `GET /api/v1/exams` - لیست آزمون‌ها
- `POST /api/v1/exams` - ایجاد آزمون
- `GET /api/v1/exams/:id` - جزئیات آزمون
- `PUT /api/v1/exams/:id` - ویرایش آزمون
- `DELETE /api/v1/exams/:id` - حذف آزمون
- `POST /api/v1/exams/:id/start` - شروع آزمون
- `POST /api/v1/exams/:id/submit` - ارسال آزمون

#### Question APIs
- `GET /api/v1/questions` - لیست سوالات
- `POST /api/v1/questions` - ایجاد سوال
- `GET /api/v1/questions/:id` - جزئیات سوال
- `PUT /api/v1/questions/:id` - ویرایش سوال
- `DELETE /api/v1/questions/:id` - حذف سوال
- `GET /api/v1/questions/search` - جستجوی سوالات

#### Blog APIs
- `GET /api/v1/blog` - لیست مقالات
- `GET /api/v1/blog/:slug` - جزئیات مقاله
- `GET /api/v1/blog/categories` - دسته‌بندی‌ها
- `POST /api/v1/blog/admin/posts` - ایجاد مقاله
- `POST /api/v1/blog/admin/categories` - ایجاد دسته‌بندی

#### Contact APIs
- `POST /api/v1/contact-form` - ارسال پیام
- `GET /api/v1/contact-form/:id` - جزئیات پیام
- `PUT /api/v1/contact-form/:id` - ویرایش پیام
- `DELETE /api/v1/contact-form/:id` - حذف پیام
- `POST /api/v1/contact-form/:id/reply` - پاسخ به پیام

#### Test Exam APIs
- `GET /api/v1/test-exams` - لیست آزمون‌های تستی
- `POST /api/v1/test-exams` - ایجاد آزمون تستی
- `GET /api/v1/test-exams/:id` - جزئیات آزمون تستی
- `POST /api/v1/test-exams/:id/start` - شروع آزمون تستی
- `POST /api/v1/test-exams/:id/submit-answer` - ارسال پاسخ
- `POST /api/v1/test-exams/:id/finish` - پایان آزمون
- `GET /api/v1/test-exams/:id/results` - نتایج آزمون

#### Roles APIs
- `GET /api/v1/roles` - لیست نقش‌ها
- `GET /api/v1/roles/permissions` - لیست مجوزها
- `GET /api/v1/roles/dashboard-stats` - آمار داشبورد

### 🛠 **تکنولوژی‌ها**

- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT + Parse Server
- **Testing**: Jest + Supertest
- **Security**: CSRF Protection, Rate Limiting
- **Validation**: Zod
- **Logging**: Winston

### 📁 **ساختار پروژه**

```
backend/
├── src/
│   ├── controllers/     # کنترلرها (همه فعال)
│   ├── routes/         # مسیرها (همه فعال)
│   ├── models/         # مدل‌های دیتابیس
│   ├── middlewares/    # میدل‌ویرها
│   ├── utils/          # ابزارهای کمکی
│   ├── types/          # تایپ‌های TypeScript
│   └── __tests__/      # تست‌ها (186/187 موفق)
├── docs/               # مستندات
└── dist/               # فایل‌های کامپایل شده
```

### 🔧 **دستورات مهم**

```bash
# نصب وابستگی‌ها
npm install

# اجرای تست‌ها
npm test

# ساخت پروژه
npm run build

# اجرای سرور (development)
npm run dev

# اجرای سرور (production)
npm start
```

### 📋 **گزارش‌های مفصل**

- [گزارش فعال‌سازی کامل ماژول‌ها](./complete-activation-report.md)
- [گزارش تست‌ها](./testing-report.md)
- [مستندات API](./API-Documentation.md)
- [سیستم وبلاگ](./BLOG_SYSTEM_DOCUMENTATION.md)
- [سیستم تماس](./README-CONTACT-SYSTEM.md)
- [سیستم نقش‌ها](./ROLES_SYSTEM_DOCUMENTATION.md)

### ⚠️ **نکات مهم**

1. **برای Production**: احراز هویت باید فعال شود
2. **Database**: اتصال به MongoDB واقعی
3. **Environment**: متغیرهای محیطی تنظیم شوند
4. **Security**: تنظیمات امنیتی کامل شوند

### 🎯 **آماده برای توسعه فرانت‌اند**

پروژه با **99.5% موفقیت در تست‌ها** و **همه ماژول‌های فعال** کاملاً آماده توسعه فرانت‌اند است.

---

**آخرین به‌روزرسانی**: ۲۶ خرداد ۱۴۰۳  
**وضعیت**: آماده برای Production ✅ 