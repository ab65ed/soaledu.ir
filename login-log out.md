# 🚀 پرامپت حرفه‌ای توسعه صفحه لاگین/خروج - SoalEdu.ir

## 📋 مقدمه پروژه

سامانه **SoalEdu.ir** یک پلتفرم جامع آزمون‌ساز و جامعه طراحان سوال است که شامل:
- **35+ API Endpoint** فعال و تست شده
- **99.5% موفقیت تست‌ها** (186/187)
- **Backend کاملاً آماده** با Parse Server و MongoDB
- **5 نقش کاربری** مختلف با داشبوردهای اختصاصی

---

## 🎯 هدف: ایجاد صفحه لاگین/خروج حرفه‌ای

### 📱 نیازمندی‌های کلی
- **صفحه لاگین**: فرم ورود با پشتیبانی تمام نقش‌ها
- **صفحه خروج**: مودال تأیید خروج امن
- **هدایت هوشمند**: انتقال خودکار به داشبورد مناسب
- **UI/UX مدرن**: طراحی جذاب، ریسپانسیو و حرفه‌ای
- **امنیت بالا**: Rate limiting، XSS prevention، CSRF protection

---

## 👥 نقش‌های کاربری و مسیرهای هدایت

### 1. **مدیر سیستم (Admin)**
- **نقش**: `admin`
- **مسیر هدایت**: `/admin/dashboard`
- **دسترسی‌ها**: مدیریت کامل سیستم، کاربران، آمار، مالی

### 2. **طراح سوال (Designer)**
- **نقش**: `designer`
- **مسیر هدایت**: `/designer/dashboard`
- **دسترسی‌ها**: طراحی سوالات، مدیریت آزمون‌ها، مشاهده درآمد

### 3. **فراگیر/دانش‌آموز (Learner)**
- **نقش**: `learner` یا `student`
- **مسیر هدایت**: `/learner/dashboard`
- **دسترسی‌ها**: شرکت در آزمون‌ها، مشاهده نتایج، کیف پول

### 4. **کارشناس آموزش (Expert)**
- **نقش**: `expert`
- **مسیر هدایت**: `/expert/dashboard`
- **دسترسی‌ها**: بررسی محتوا، تأیید سوالات، مشاوره

### 5. **پشتیبان (Support)**
- **نقش**: `support`
- **مسیر هدایت**: `/support/dashboard`
- **دسترسی‌ها**: پاسخ‌گویی، مدیریت تیکت‌ها، راهنمایی کاربران

---

## 🔗 API Endpoints موجود

### Authentication APIs
```javascript
// Base URL: http://localhost:5000/api/v1/auth

// 1. ورود کاربر
POST /auth/login
{
  "email": "user@example.com", // یا شماره موبایل
  "password": "securePassword123"
}

// Response:
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "name": "نام کاربر",
      "email": "user@example.com",
      "role": "admin|designer|learner|expert|support"
    },
    "tokens": {
      "accessToken": "jwt_access_token",
      "refreshToken": "jwt_refresh_token"
    }
  }
}

// 2. خروج کاربر
POST /auth/logout

// 3. دریافت پروفایل
GET /auth/me

// 4. تجدید توکن
POST /auth/refresh-token
```

---

## 🎨 مشخصات طراحی UI/UX

### 🌟 Theme و استایل
```css
/* فونت اصلی */
font-family: 'YekanBakh', 'IRANSans', 'Tahoma', 'Arial', sans-serif;

/* رنگ‌بندی اصلی */
--primary: #3B82F6;        /* آبی اصلی */
--secondary: #6B7280;      /* خاکستری */
--accent: #8B5CF6;         /* بنفش */
--success: #10B981;        /* سبز */
--warning: #F59E0B;        /* نارنجی */
--danger: #EF4444;         /* قرمز */
--background: #F8FAFC;     /* پس‌زمینه */
--card: #FFFFFF;           /* کارت */
```

### 📱 طراحی ریسپانسیو
- **Mobile First**: شروع از 320px
- **Tablet**: 768px به بالا
- **Desktop**: 1024px به بالا

### 🎭 انیمیشن‌ها
```javascript
// انیمیشن ورود
const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};
```

### 🔤 تایپوگرافی فارسی
- **جهت**: `dir="rtl"` برای تمام متون فارسی
- **عنوان اصلی**: `text-3xl font-bold`
- **متن اصلی**: `text-base font-normal`

---

## 🔧 مشخصات فنی

### ⚙️ Technology Stack
- **Framework**: Next.js 15 با App Router
- **Language**: TypeScript کامل
- **Styling**: TailwindCSS + CSS Variables
- **State Management**: Zustand
- **API Management**: React Query
- **Animation**: Framer Motion
- **Form Handling**: React Hook Form + Zod
- **Icons**: Lucide React

### 🔒 امنیت
- **Rate Limiting**: 5 درخواست در دقیقه برای login
- **XSS Prevention**: sanitization تمام ورودی‌ها
- **Input Validation**: Zod schema validation

### 🚀 بهینه‌سازی عملکرد
- **React.memo**: برای کامپوننت‌های سنگین
- **useMemo**: برای محاسبات پیچیده
- **useCallback**: برای event handlers

---

## �� نیازمندی‌های جزئی

### 🔐 صفحه لاگین
#### کامپوننت‌های مورد نیاز:
1. `LoginForm.tsx` - فرم اصلی ورود
2. `LoginHeader.tsx` - هدر صفحه با لوگو
3. `LoginFooter.tsx` - فوتر با لینک‌های مفید
4. `LoadingSpinner.tsx` - نمایش بارگذاری
5. `ErrorAlert.tsx` - نمایش خطاها

#### ویژگی‌های فرم ورود:
- **ورودی‌ها**: ایمیل/موبایل + رمز عبور
- **اعتبارسنجی**: Zod schema با پیام‌های فارسی
- **نمایش رمز**: toggle برای نمایش/مخفی کردن
- **Remember Me**: چک‌باکس یادآوری
- **Loading State**: اسپینر در حین درخواست

#### Validation Rules:
```typescript
const loginSchema = z.object({
  email: z.string()
    .email("ایمیل معتبر وارد کنید")
    .or(z.string().regex(/^09\d{9}$/, "شماره موبایل معتبر وارد کنید")),
  password: z.string()
    .min(8, "رمز عبور حداقل 8 کاراکتر باشد"),
  remember: z.boolean().optional()
});
```

### 🚪 صفحه خروج
#### کامپوننت‌های مورد نیاز:
1. `LogoutModal.tsx` - مودال تأیید خروج
2. `LogoutButton.tsx` - دکمه خروج
3. `SessionInfo.tsx` - نمایش اطلاعات جلسه

#### ویژگی‌های مودال خروج:
- **Modal Design**: مودال مرکزی با overlay
- **Confirmation**: دو دکمه تأیید/لغو
- **Secure Logout**: پاک کردن تمام داده‌ها

---

## 🌐 دسترسی‌پذیری (Accessibility)

### WCAG 2.2 Compliance
- **Keyboard Navigation**: پشتیبانی کامل Tab/Shift+Tab
- **Screen Readers**: ARIA labels مناسب
- **Color Contrast**: نسبت 4.5:1 برای متن
- **Focus Management**: مدیریت focus در modal ها

---

## 📱 نمونه UI Layout

### صفحه لاگین
```
┌─────────────────────────────────────┐
│              Header                 │
│           [Logo] SoalEdu           │
├─────────────────────────────────────┤
│                                     │
│        ┌─────────────────┐         │
│        │   ورود به حساب   │         │
│        │                 │         │
│        │ [ایمیل/موبایل]    │         │
│        │ [رمز عبور]       │         │
│        │ □ مرا به خاطر بسپار │         │
│        │                 │         │
│        │   [دکمه ورود]     │         │
│        └─────────────────┘         │
│                                     │
├─────────────────────────────────────┤
│              Footer                 │
│        © 2024 SoalEdu.ir           │
└─────────────────────────────────────┘
```

### مودال خروج
```
┌─────────────────────────────────────┐
│             Overlay                 │
│                                     │
│    ┌─────────────────────────┐     │
│    │      تأیید خروج          │     │
│    │                         │     │
│    │ آیا مطمئن هستید که می‌خواهید │     │
│    │ از حساب کاربری خود خارج شوید؟ │     │
│    │                         │     │
│    │   [لغو]     [خروج]       │     │
│    └─────────────────────────┘     │
│                                     │
└─────────────────────────────────────┘
```

---

## 📤 نحوه تحویل کد

### 1. ساختار فایل‌ها
```
login-logout-components/
├── components/
│   ├── atoms/
│   │   ├── LoginButton.tsx
│   │   ├── LogoutButton.tsx
│   │   ├── InputField.tsx
│   │   └── LoadingSpinner.tsx
│   ├── molecules/
│   │   ├── LoginForm.tsx
│   │   ├── LogoutModal.tsx
│   │   └── SessionInfo.tsx
│   └── organisms/
│       ├── LoginPage.tsx
│       └── LogoutPage.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useLogin.ts
│   └── useLogout.ts
├── services/
│   └── authService.ts
├── stores/
│   └── authStore.ts
└── types/
    └── auth.ts
```

### 2. گزارش کامپوننت‌ها
لطفاً فایل `component-report.md` ایجاد کنید که شامل:
- لیست تمام کامپوننت‌های ایجاد شده
- dependencies هر کامپوننت
- نحوه استفاده و props

### 3. فایل تکست کدها
تمام کدها را در فایل `login-logout-codes.txt` ذخیره کنید

---

## 🎯 معیارهای موفقیت

### ✅ Checklist تکمیل
- [ ] فرم لاگین کامل با validation
- [ ] مودال خروج با تأیید
- [ ] هدایت صحیح بر اساس نقش
- [ ] Error handling کامل
- [ ] Loading states مناسب
- [ ] Accessibility WCAG 2.2
- [ ] RTL support کامل
- [ ] انیمیشن‌های نرم
- [ ] Mobile responsive
- [ ] Persian localization

---

**نکته مهم**: این پرامپت برای استفاده در Lovable طراحی شده و تمام استانداردهای پروژه SoalEdu.ir را در نظر گرفته است.

🚀 **موفق باشید!**
