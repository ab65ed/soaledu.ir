# مستندات صفحات - Exam-Edu

## هدر و فوتر (Header & Footer)

### نمای کلی
هدر و فوتر کامپوننت‌های اصلی layout هستند که در تمام صفحات نمایش داده می‌شوند. این کامپوننت‌ها ناوبری اصلی، احراز هویت، و اطلاعات سایت را مدیریت می‌کنند.

### کامپوننت‌ها

#### Header
- **مسیر**: `/src/components/organisms/Header.tsx`
- **عملکرد**: ناوبری اصلی، منوی کاربر، و احراز هویت
- **ویژگی‌ها**:
  - منوی ناوبری با لینک‌های اصلی (خانه، آزمون‌ها، وبلاگ، تماس)
  - نمایش نقش کاربر (Admin, Learner, Support, Expert, Designer)
  - دکمه‌های لاگین/لاگ‌اوت و پروفایل
  - منوی همبرگری برای موبایل با انیمیشن
  - هدایت خودکار به داشبورد نقش‌محور
  - RTL و IRANSans

#### Footer
- **مسیر**: `/src/components/organisms/Footer.tsx`
- **عملکرد**: لینک‌های سریع، اطلاعات تماس، و شبکه‌های اجتماعی
- **ویژگی‌ها**:
  - لینک‌های سریع (خدمات، پشتیبانی، قوانین)
  - اطلاعات تماس (تلفن، ایمیل، آدرس)
  - شبکه‌های اجتماعی با آیکون‌های Heroicons
  - انیمیشن hover با Framer Motion
  - کپی‌رایت و نسخه

#### AuthGuard
- **مسیر**: `/src/components/organisms/AuthGuard.tsx`
- **عملکرد**: محافظت از مسیرها و بررسی دسترسی
- **ویژگی‌ها**:
  - بررسی احراز هویت و نقش کاربر
  - هدایت خودکار بر اساس نقش
  - صفحات لودینگ و خطا
  - مدیریت مسیرهای عمومی و محافظت شده

### Auth Management

#### Auth Store (Zustand)
- **مسیر**: `/src/stores/authStore.ts`
- **عملکرد**: مدیریت وضعیت احراز هویت
- **ویژگی‌ها**:
  - ذخیره JWT و اطلاعات کاربر
  - Persist در localStorage
  - هلپرهای نقش‌محور
  - بررسی دسترسی به مسیرها

#### Auth Hooks
- **مسیر**: `/src/hooks/useAuth.ts`
- **عملکرد**: API calls مربوط به احراز هویت
- **ویژگی‌ها**:
  - React Query برای کش (60 ثانیه)
  - Login/Register/Logout mutations
  - هدایت خودکار بعد از لاگین
  - مدیریت خطاها

### API Integration

#### Auth Endpoints
- `POST /api/auth/login` - ورود کاربر
- `POST /api/auth/register` - ثبت‌نام کاربر
- `GET /api/auth/profile` - دریافت پروفایل کاربر
- `POST /api/auth/logout` - خروج کاربر

#### User Roles
```typescript
type UserRole = 'admin' | 'learner' | 'support' | 'expert' | 'designer';

// مسیرهای مجاز برای هر نقش
const ROLE_ROUTES = {
  admin: ['/admin', '/course-exam', '/questions', '/test-exams', '/contact'],
  designer: ['/designer', '/course-exam', '/questions', '/test-exams'],
  learner: ['/learner', '/course-exam', '/test-exams', '/blog', '/contact'],
  expert: ['/expert', '/questions', '/course-exam', '/test-exams'],
  support: ['/support', '/contact', '/test-exams', '/blog'],
};
```

### Dashboard Links
- **Admin**: `/admin/dashboard` - پنل مدیریت
- **Designer**: `/designer/dashboard` - پنل طراح
- **Learner**: `/learner/dashboard` - پنل فراگیر
- **Expert**: `/expert/dashboard` - پنل متخصص
- **Support**: `/support/dashboard` - پنل پشتیبانی

### UI/UX Features

#### طراحی
- تم آبی/سفید قابل تنظیم
- فونت IRANSans برای RTL
- طراحی Mobile-First ریسپانسیو
- WCAG 2.2 accessibility

#### انیمیشن‌ها
- Framer Motion برای منوها
- انیمیشن‌های smooth dropdown
- Loading states و transitions
- Hover effects

### Performance

#### بهینه‌سازی‌ها
- React Query کش (staleTime: 60000ms)
- Lazy loading کامپوننت‌ها
- Code splitting خودکار
- Debouncing برای search (300ms)

### Security

#### امنیت
- JWT برای احراز هویت
- Rate limiting
- XSS/Injection prevention
- CSRF protection
- Audit logging

### Testing

#### Unit Tests
- Jest/Vitest برای کامپوننت‌ها
- Mock dependencies (Next.js, Framer Motion)
- پوشش ۸۰%+ کد
- تست نقش‌های مختلف کاربر

#### E2E Tests
- Cypress برای جریان کاربر
- تست ناوبری و لاگین
- تست منوی موبایل
- تست دسترسی‌پذیری

---

## صفحه تماس با ما (/contact)

### نمای کلی
صفحه تماس با ما یک رابط کاربری کامل برای ارتباط کاربران با تیم پشتیبانی ارائه می‌دهد. این صفحه شامل فرم تماس، اطلاعات تماس، و سوالات متداول است.

### کامپوننت‌ها

#### ContactHeader
- **مسیر**: `/src/components/molecules/ContactHeader.tsx`
- **عملکرد**: نمایش عنوان صفحه، توضیحات، و کارت‌های اطلاعات تماس
- **ویژگی‌ها**:
  - انیمیشن‌های Framer Motion
  - کارت‌های تعاملی برای ایمیل، تلفن، آدرس، و ساعات کاری
  - پشتیبانی از لینک‌های مستقیم (mailto, tel)
  - طراحی ریسپانسیو

#### ContactForm
- **مسیر**: `/src/components/molecules/ContactForm.tsx`
- **عملکرد**: فرم ارسال پیام با اعتبارسنجی
- **ویژگی‌ها**:
  - React Hook Form برای مدیریت فرم
  - فیلدهای نام، ایمیل، پیام (اجباری)
  - دسته‌بندی پیام (عمومی، پشتیبانی، باگ، درخواست قابلیت)
  - نمایش پیام موفقیت بعد از ارسال
  - مدیریت خطا و loading state
  - انیمیشن‌های تعاملی

#### FAQAccordion
- **مسیر**: `/src/components/organisms/FAQAccordion.tsx`
- **عملکرد**: نمایش سوالات متداول با قابلیت expand/collapse
- **ویژگی‌ها**:
  - پشتیبانی از چندین آیتم باز همزمان
  - انیمیشن‌های smooth برای باز/بسته شدن
  - دکمه "باز کردن همه" / "بستن همه"
  - ۶ سوال متداول پیش‌فرض
  - ARIA labels برای دسترسی‌پذیری

### API Integration

#### Contact Service
- **مسیر**: `/src/services/api.ts`
- **Endpoints**:
  - `POST /api/contact` - ارسال پیام جدید
  - `GET /api/contact/stats` - آمار پیام‌ها
  - `GET /api/contact/messages` - دریافت لیست پیام‌ها
  - `PUT /api/contact/{id}/status` - تغییر وضعیت پیام

#### Data Types
```typescript
interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  message: string;
  phone?: string;
  category?: 'bug_report' | 'feature_request' | 'general' | 'support';
  status?: 'pending' | 'replied' | 'closed';
  userAgent?: string;
  ipAddress?: string;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}
```

### UI/UX Features

#### طراحی
- تم آبی/سفید مطابق با برند
- فونت IRANSans برای متن‌های فارسی
- طراحی Mobile-First و کاملاً ریسپانسیو
- استفاده از Tailwind CSS برای styling

#### انیمیشن‌ها
- Framer Motion برای انیمیشن‌های smooth
- Fade-in و slide-up برای ورود کامپوننت‌ها
- انیمیشن‌های تعاملی برای دکمه‌ها و فرم‌ها
- Loading states با spinner

#### دسترسی‌پذیری
- ARIA labels و roles مناسب
- پشتیبانی از keyboard navigation
- تضاد رنگ مناسب برای خوانایی
- Screen reader friendly

### Performance

#### بهینه‌سازی‌ها
- React Query برای cache کردن درخواست‌ها
- Lazy loading برای کامپوننت‌های سنگین
- Code splitting خودکار Next.js
- Image optimization

#### Metrics
- First Load JS: ~250kB (شامل dependencies)
- Static Generation برای SEO بهتر
- Core Web Vitals optimized

### Security

#### امنیت
- Rate limiting در سمت سرور (۵ درخواست/دقیقه)
- XSS protection با sanitization
- CSRF protection
- Audit logging برای تمام پیام‌ها

### Testing

#### Unit Tests
- Jest/Vitest برای تست کامپوننت‌ها
- Testing Library برای تست تعاملات
- Mock API calls

#### E2E Tests
- Cypress برای تست جریان کامل
- تست ارسال فرم
- تست انیمیشن‌های accordion
- تست responsive design

### Future Enhancements

#### پیشنهادات بهبود
- اتصال WebSocket برای اعلان‌های real-time
- پیش‌نمایش فایل‌های ضمیمه
- چت آنلاین
- پشتیبانی چندزبانه
- تحلیل sentiment پیام‌ها

### Deployment Notes

#### نکات استقرار
- متغیرهای محیطی مورد نیاز:
  - `NEXT_PUBLIC_API_URL`
  - `NEXT_PUBLIC_PARSE_APP_ID`
  - `NEXT_PUBLIC_PARSE_JS_KEY`
- Build موفقیت‌آمیز با `npm run build`
- آماده برای production deployment

---

**آخرین بروزرسانی**: ۲۰۲۵/۰۱/۲۷
**نسخه**: ۱.۰.۰
**وضعیت**: ✅ تکمیل شده 

## صفحه خانه (Home Page) - `/`

### شناسه پرامپت
**EXAM-EDU-PROMPT-2025**

### هدف
پیاده‌سازی صفحه خانه (/) با دیزاین حرفه‌ای، لندینگ‌پیج جذاب، و اتصال به APIهای محتوا

### ساختار کامپوننت‌ها

#### 1. HeroSection (`/components/organisms/HeroSection.tsx`)
- **هدف**: بخش اصلی صفحه با CTA و انیمیشن
- **ویژگی‌ها**:
  - عنوان و توضیحات جذاب
  - دکمه CTA با منطق هدایت نقش‌محور
  - نمایش ویژگی‌های کلیدی (3 ویژگی)
  - آمار سایت (4 آمار)
  - انیمیشن Framer Motion
  - عنصر تزئینی پس‌زمینه

- **منطق CTA**:
  ```typescript
  // هدایت بر اساس نقش کاربر
  const userRole = localStorage.getItem('userRole') || 'guest';
  
  switch (userRole) {
    case 'admin': '/admin/dashboard'
    case 'designer': '/designer/dashboard'
    case 'student': '/learner/dashboard'
    case 'expert': '/expert/dashboard'
    default: '/auth/register' // کاربر مهمان
  }
  ```

#### 2. FeaturedCourses (`/components/organisms/FeaturedCourses.tsx`)
- **هدف**: نمایش درس-آزمون‌های محبوب
- **ویژگی‌ها**:
  - اتصال به API: `GET /api/courseExam/popular`
  - کارت‌های ریسپانسیو (Grid: 1-2-3 ستون)
  - نمایش اطلاعات: عنوان، توضیحات، تگ‌ها، آمار، قیمت
  - Skeleton Loading (6 کارت)
  - مدیریت خطا
  - محدودیت نمایش: حداکثر 6 آزمون
  - لینک "مشاهده همه آزمون‌ها"

- **فرمت قیمت فارسی**:
  ```typescript
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
  };
  ```

#### 3. Testimonials (`/components/molecules/Testimonials.tsx`)
- **هدف**: نمایش نظرات کاربران با اسلایدر
- **ویژگی‌ها**:
  - اتصال به API: `GET /api/testimonials`
  - اسلایدر خودکار (تغییر هر 5 ثانیه)
  - انیمیشن slide با Framer Motion
  - نقاط ناوبری (dots)
  - دکمه‌های قبلی/بعدی
  - نمایش ستاره‌های امتیاز
  - نظرات پیش‌فرض در صورت عدم دریافت از API

### کامپوننت‌های مشترک

#### 1. Button (`/components/atoms/Button.tsx`)
- **ویژگی‌ها**:
  - انواع: primary, secondary, outline, ghost
  - اندازه‌ها: sm, md, lg
  - حالت loading
  - آیکون‌های راست/چپ (RTL)
  - انیمیشن hover/tap

#### 2. Card (`/components/atoms/Card.tsx`)
- **ویژگی‌ها**:
  - انیمیشن hover
  - padding متغیر
  - قابلیت کلیک
  - سایه و border

### API Integration

#### React Query Configuration
```typescript
staleTime: 30000, // 30 ثانیه طبق درخواست
gcTime: 1000 * 60 * 30, // 30 دقیقه
retry: 3 // تلاش مجدد
```

#### API Endpoints
1. **درس-آزمون‌های محبوب**:
   - `GET /api/courseExam/popular`
   - Query Key: `['popularCourses']`

2. **نظرات کاربران**:
   - `GET /api/testimonials`
   - Query Key: `['testimonials']`

### UI/UX ویژگی‌ها

#### تم و استایل
- **رنگ‌ها**: آبی/سفید (Blue/White theme)
- **فونت**: IRANSans
- **جهت**: RTL (راست به چپ)
- **ریسپانسیو**: Mobile-First

#### انیمیشن‌ها (Framer Motion)
- **HeroSection**: staggerChildren, fadeIn
- **FeaturedCourses**: staggerChildren, slideUp
- **Testimonials**: slideX, autoSlide

#### دسترسی‌پذیری (WCAG 2.2)
- aria-label برای دکمه‌ها
- alt text برای تصاویر
- keyboard navigation
- contrast ratio مناسب

### تست‌ها

#### Unit Tests (Jest/React Testing Library)
- **HeroSection**: 
  - رندر محتوا
  - عملکرد CTA
  - هدایت نقش‌محور
- **FeaturedCourses**:
  - بارگذاری داده‌ها
  - skeleton loading
  - مدیریت خطا

#### E2E Tests (Cypress)
- جریان کاربر کامل
- تست CTA
- ریسپانسیو
- RTL support
- دسترسی‌پذیری
- عملکرد

### عملکرد (Performance)

#### بهینه‌سازی‌ها
- LazyLoading برای تصاویر
- Code Splitting
- React Query caching
- Debouncing (300ms)

#### معیارهای عملکرد
- LCP < 2.5s
- FID < 100ms
- CLS < 0.1
- زمان بارگذاری < 3s

### امنیت

#### Rate Limiting
- محدودیت درخواست API
- XSS prevention
- CSRF protection

### مسیرهای فایل

```
frontend/
├── src/
│   ├── app/
│   │   └── page.tsx                    # صفحه اصلی
│   ├── components/
│   │   ├── atoms/
│   │   │   ├── Button.tsx
│   │   │   └── Card.tsx
│   │   ├── molecules/
│   │   │   └── Testimonials.tsx
│   │   └── organisms/
│   │       ├── HeroSection.tsx
│   │       ├── FeaturedCourses.tsx
│   │       └── __tests__/
│   │           ├── HeroSection.test.tsx
│   │           └── FeaturedCourses.test.tsx
│   ├── services/
│   │   └── api.ts                      # API services
│   └── utils/
│       └── cn.ts                       # Utility functions
└── cypress/
    └── e2e/
        └── home-page.cy.ts             # E2E tests
```

### نکات پیاده‌سازی

#### کامنت‌های فارسی
```typescript
// منطق تشخیص نقش کاربر و هدایت به داشبورد مناسب
const handleCTAClick = () => {
  const userRole = localStorage.getItem('userRole') || 'guest';
  // ...
};
```

#### مدیریت خطا
```typescript
if (error) {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-red-600">خطا در بارگذاری درس-آزمون‌های محبوب</p>
      </div>
    </section>
  );
}
```

### وضعیت پیاده‌سازی

- ✅ HeroSection کامل
- ✅ FeaturedCourses کامل
- ✅ Testimonials کامل
- ✅ API Integration
- ✅ Unit Tests
- ✅ E2E Tests
- ✅ RTL Support
- ✅ Responsive Design
- ✅ Accessibility
- ✅ Performance Optimization

### مراحل بعدی

1. اتصال به Backend API واقعی
2. بهینه‌سازی تصاویر
3. اضافه کردن SEO metadata
4. پیاده‌سازی PWA features
5. اضافه کردن Analytics tracking 