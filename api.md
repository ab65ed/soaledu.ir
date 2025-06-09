

# 📋 لیست کامل API های موجود در backend

براساس بررسی فایل‌های routes، در ادامه لیست کامل تمام API های موجود در سیستم و کاربرد هر کدام آورده شده است:

## 🔐 **احراز هویت (Authentication)** - `/api/auth`

| HTTP Method | Endpoint | کاربرد |
|-------------|----------|---------|
| `POST` | `/register` | ثبت‌نام کاربر جدید |
| `POST` | `/login` | ورود کاربر |
| `POST` | `/refresh-token` | تجدید توکن دسترسی |
| `GET` | `/me` | دریافت پروفایل کاربر جاری |
| `PUT` | `/complete-profile` | تکمیل پروفایل (انتخاب رشته تحصیلی) |
| `POST` | `/logout` | خروج کاربر |

---

## ❓ **مدیریت سوالات (Questions)** - `/api/questions`

| HTTP Method | Endpoint | کاربرد |
|-------------|----------|---------|
| `GET` | `/` | دریافت سوالات منتشر شده با فیلتر و صفحه‌بندی |
| `GET` | `/search` | جستجوی متنی در سوالات |
| `GET` | `/tags` | دریافت تگ‌های موجود |
| `GET` | `/categories` | دریافت دسته‌بندی‌های موجود |
| `GET` | `/stats` | آمار عمومی سوالات |
| `GET` | `/:id` | دریافت سوال خاص |
| `POST` | `/` | ایجاد سوال جدید (احراز هویت لازم) |
| `PUT` | `/:id` | ویرایش سوال (فقط مالک) |
| `DELETE` | `/:id` | حذف سوال (فقط مالک) |
| `PATCH` | `/:id/auto-save` | ذخیره خودکار سوال |
| `PATCH` | `/:id/publish` | انتشار سوال |
| `PATCH` | `/:id/unpublish` | لغو انتشار سوال |
| `POST` | `/validate` | اعتبارسنجی داده‌های سوال |
| `POST` | `/:id/duplicate` | کپی کردن سوال |

---

## 📝 **مدیریت آزمون‌ها (Exams)** - `/api/exams`

| HTTP Method | Endpoint | کاربرد |
|-------------|----------|---------|
| `GET` | `/` | تست سلامت API آزمون‌ها |
| `POST` | `/create` | ایجاد آزمون جدید (فقط ادمین) |
| `GET` | `/admin/all` | دریافت همه آزمون‌ها (فقط ادمین) |
| `GET` | `/available` | دریافت آزمون‌های در دسترس برای دانشجویان |

---

## 🎓 **آزمون‌های دوره‌ای (Course Exams)** - `/api/courseExam`

| HTTP Method | Endpoint | کاربرد |
|-------------|----------|---------|
| `GET` | `/published` | لیست آزمون‌های دوره‌ای منتشر شده |
| `GET` | `/search` | جستجو در آزمون‌های دوره‌ای |
| `GET` | `/tags` | تگ‌های موجود |
| `GET` | `/stats` | آمار آزمون‌های دوره‌ای |
| `GET` | `/:id` | دریافت آزمون دوره‌ای خاص |
| `POST` | `/` | ایجاد آزمون دوره‌ای جدید |
| `PUT` | `/:id` | ویرایش آزمون دوره‌ای |
| `DELETE` | `/:id` | حذف آزمون دوره‌ای |
| `PATCH` | `/:id/auto-save` | ذخیره خودکار |
| `PATCH` | `/:id/publish` | انتشار آزمون |
| `PATCH` | `/:id/unpublish` | لغو انتشار |
| `POST` | `/:id/sale` | ثبت فروش |
| `POST` | `/:id/rating` | افزودن امتیاز |
| `GET` | `/author/:authorId` | آزمون‌های یک نویسنده |

---

## 💰 **مدیریت کیف پول (Wallet)** - `/api/wallet`

| HTTP Method | Endpoint | کاربرد |
|-------------|----------|---------|
| `GET` | `/stats` | آمار کیف پول |
| `GET` | `/transactions` | لیست تراکنش‌ها |
| `POST` | `/charge` | شارژ کیف پول |
| `POST` | `/deduct` | کسر از کیف پول |
| `GET` | `/balance/:userId` | موجودی کیف پول کاربر |
| `GET` | `/user/:userId/transactions` | تاریخچه تراکنش‌های کاربر |
| `POST` | `/refund` | بازگشت وجه |
| `GET` | `/analytics` | تحلیل‌های مالی |
| `GET` | `/export` | صادرات تراکنش‌ها |
| `POST` | `/bulk` | عملیات انبوه کیف پول |

---

## 💳 **پرداخت (Payments)** - `/api/payment`

| HTTP Method | Endpoint | کاربرد |
|-------------|----------|---------|
| `POST` | `/initiate` | شروع فرآیند پرداخت |
| `GET` | `/callback` | بازگشت از درگاه پرداخت |
| `GET` | `/history` | تاریخچه پرداخت‌ها |
| `POST` | `/validate-discount` | اعتبارسنجی کد تخفیف |
| `GET` | `/wallet` | اطلاعات کیف پول |

---

## 🎫 **سیستم تیکت‌ها (Tickets)** - `/api/tickets`

| HTTP Method | Endpoint | کاربرد |
|-------------|----------|---------|
| `POST` | `/create` | ایجاد تیکت جدید |
| `GET` | `/my-tickets` | تیکت‌های کاربر جاری |
| `GET` | `/:id` | دریافت تیکت خاص |
| `POST` | `/:id/response` | پاسخ به تیکت |
| `PATCH` | `/:id/status` | تغییر وضعیت تیکت |
| `PATCH` | `/:id/assign` | تخصیص تیکت |
| `GET` | `/admin/all` | همه تیکت‌ها (ادمین) |
| `GET` | `/admin/stats` | آمار تیکت‌ها (ادمین) |

---

## 👥 **مدیریت نقش‌ها (Roles)** - `/api/roles`

| HTTP Method | Endpoint | کاربرد |
|-------------|----------|---------|
| `GET` | `/user-roles` | نقش‌های کاربر |
| `GET` | `/dashboard-stats` | آمار داشبورد |
| `POST` | `/log-activity` | ثبت فعالیت |
| `GET` | `/activity-logs` | لاگ فعالیت‌ها |
| `POST` | `/tickets` | ایجاد تیکت (از بخش نقش‌ها) |
| `GET` | `/tickets` | دریافت تیکت‌ها |
| `POST` | `/payment-requests` | درخواست پرداخت |
| `GET` | `/knowledge-base` | پایگاه دانش |

---

## 📊 **تست A/B (AB Testing)** - `/api/ab-test`

| HTTP Method | Endpoint | کاربرد |
|-------------|----------|---------|
| `GET` | `/` | لیست تست‌های A/B |
| `POST` | `/` | ایجاد تست A/B جدید |
| `GET` | `/:id` | دریافت تست A/B خاص |
| `PUT` | `/:id` | ویرایش تست A/B |
| `DELETE` | `/:id` | حذف تست A/B |
| `POST` | `/:id/start` | شروع تست |
| `POST` | `/:id/pause` | توقف موقت تست |
| `POST` | `/:id/stop` | پایان تست |
| `GET` | `/:id/results` | نتایج تست |
| `GET` | `/:id/analytics` | تحلیل‌های تست |
| `POST` | `/:id/assign` | تخصیص کاربر به متغیر |
| `POST` | `/:id/convert` | ثبت تبدیل |

---

## 🗂️ **دسته‌بندی‌ها (Categories)** - `/api/categories`

| HTTP Method | Endpoint | کاربرد |
|-------------|----------|---------|
| `GET` | `/` | دریافت دسته‌بندی‌ها |
| `GET` | `/:id` | دریافت دسته‌بندی خاص |
| `POST` | `/` | ایجاد دسته‌بندی جدید |
| `PUT` | `/:id` | ویرایش دسته‌بندی |
| `DELETE` | `/:id` | حذف دسته‌بندی |

---

## 🃏 **فلش کارت‌ها (Flashcards)** - `/api/flashcard`

| HTTP Method | Endpoint | کاربرد |
|-------------|----------|---------|
| `GET` | `/` | دریافت فلش کارت‌ها |
| `GET` | `/categories` | دسته‌بندی‌های فلش کارت |
| `GET` | `/stats` | آمار کاربر |
| `GET` | `/my-purchases` | خریدهای کاربر |
| `POST` | `/generate-from-questions` | تولید از روی سوالات |
| `POST` | `/` | ایجاد فلش کارت جدید |
| `GET` | `/:id` | دریافت فلش کارت خاص |
| `PUT` | `/:id` | ویرایش فلش کارت |
| `DELETE` | `/:id` | حذف فلش کارت |
| `POST` | `/:id/purchase` | خرید فلش کارت |
| `POST` | `/:id/study` | ثبت جلسه مطالعه |

---

## 💼 **تنظیمات مالی (Finance Settings)** - `/api/financeSettings`

| HTTP Method | Endpoint | کاربرد |
|-------------|----------|---------|
| `GET` | `/global` | تنظیمات مالی سراسری |
| `PUT` | `/global` | ویرایش تنظیمات سراسری |
| `GET` | `/exam/:examId` | تنظیمات مالی آزمون |
| `PUT` | `/exam/:examId` | ویرایش تنظیمات آزمون |
| `DELETE` | `/exam/:examId` | حذف تنظیمات آزمون |
| `GET` | `/custom-exams` | آزمون‌های سفارشی |
| `POST` | `/calculate-sharing` | محاسبه سهم‌بندی |

---

## 🗄️ **مدیریت کش (Cache)** - `/api/cache`

| HTTP Method | Endpoint | کاربرد |
|-------------|----------|---------|
| `GET` | `/stats` | آمار کش |
| `GET` | `/pools` | استخرهای کش |
| `GET` | `/user-attempts/:userId/:examId` | آمار تلاش‌های کاربر |
| `DELETE` | `/clear` | پاک کردن کل کش |
| `DELETE` | `/clear/:category` | پاک کردن کش دسته‌ای |
| `POST` | `/warmup` | گرم کردن کش |

---

## ⚡ **عملکرد سیستم (Performance)** - `/api/performance`

| HTTP Method | Endpoint | کاربرد |
|-------------|----------|---------|
| `GET` | `/system` | عملکرد سیستم |
| `GET` | `/indexes` | آمار استفاده از ایندکس‌ها |
| `GET` | `/ab-tests/:testId` | عملکرد تست A/B |
| `GET` | `/optimizations` | پیشنهادات بهینه‌سازی |
| `POST` | `/optimizations/:suggestionId/apply` | اعمال بهینه‌سازی |

---

## 📈 **مقیاس‌پذیری (Scalability)** - `/api/scalability`

| HTTP Method | Endpoint | کاربرد |
|-------------|----------|---------|
| `GET` | `/overview` | نمای کلی مقیاس‌پذیری |
| `GET` | `/indexes` | مدیریت ایندکس‌ها |
| `POST` | `/indexes` | ایجاد ایندکس جدید |
| `DELETE` | `/indexes/:id` | حذف ایندکس |
| `GET` | `/suggestions` | پیشنهادات بهینه‌سازی |
| `POST` | `/suggestions/generate` | تولید پیشنهادات |
| `POST` | `/suggestions/:id/implement` | پیاده‌سازی پیشنهاد |
| `POST` | `/suggestions/:id/reject` | رد پیشنهاد |
| `GET` | `/performance` | متریک‌های عملکرد |

---

## 🏥 **بررسی سلامت (Health Check)** - `/api`

| HTTP Method | Endpoint | کاربرد |
|-------------|----------|---------|
| `GET` | `/health` | بررسی سلامت API |

---

## 📝 **خلاصه کلی:**

- **مجموع API های شناسایی شده:** بیش از **100 endpoint**
- **دسته‌بندی‌های اصلی:** 15 بخش مختلف
- **نوع عملیات‌ها:** CRUD کامل، آنالیتیک، مدیریت مالی، کش، عملکرد
- **سطح دسترسی:** عمومی، کاربر عادی، ادمین، کاربر خاص
- **ویژگی‌های امنیتی:** احراز هویت، مجوزها، اعتبارسنجی

تمام این API ها به صورت RESTful طراحی شده‌اند و از middleware های امنیتی، اعتبارسنجی و لاگ‌گیری استفاده می‌کنند.