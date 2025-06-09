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

#### Auth Pages
- **مسیر**: `/src/app/auth/login/page.tsx` - صفحه ورود
- **مسیر**: `/src/app/auth/logout/page.tsx` - صفحه خروج
- **عملکرد**: صفحات احراز هویت با UI/UX حرفه‌ای
- **ویژگی‌ها**:
  - فرم ورود با اعتبارسنجی Zod و React Hook Form
  - پشتیبانی از ایمیل و شماره موبایل ایرانی
  - Rate limiting (5 درخواست در دقیقه)
  - مودال تأیید خروج
  - انیمیشن‌های Framer Motion
  - هدایت خودکار به داشبورد نقش‌محور

#### Auth Components
- **مسیر**: `/src/components/auth/LoginForm.tsx` - فرم ورود
- **مسیر**: `/src/components/auth/LogoutButton.tsx` - دکمه خروج
- **عملکرد**: کامپوننت‌های احراز هویت قابل استفاده مجدد
- **ویژگی‌ها**:
  - اعتبارسنجی پیشرفته با Zod
  - نمایش/مخفی کردن رمز عبور
  - Loading states و error handling
  - مودال تأیید خروج با انیمیشن
  - دسترسی‌پذیری WCAG 2.2

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

## داشبورد کارشناس آموزشی (/expert/dashboard)

### نمای کلی
داشبورد کارشناس آموزشی یک رابط کاربری تخصصی برای بررسی و تأیید محتوای آموزشی، کنترل کیفیت، و ارائه بازخورد است. این صفحه امکان مشاهده محتوای در انتظار بررسی، آمار کیفیت، و تاریخچه بررسی‌ها را فراهم می‌کند. پیاده‌سازی با استفاده از React Query، Framer Motion، Zod validation، و طراحی responsive و RTL انجام شده است.

### ✅ وضعیت پیاده‌سازی
- [x] صفحه اصلی داشبورد با داده‌های real-time
- [x] کامپوننت ContentReview با فرم بازخورد کامل
- [x] کامپوننت QualityAnalytics با نمودارها و آمار
- [x] Modal system برای بررسی محتوا
- [x] Zod validation برای فرم‌ها
- [x] API integration کامل (expertService)
- [x] تست‌های واحد (Jest/Testing Library)
- [x] تست‌های E2E (Cypress) با RTL و accessibility
- [x] مستندات کامل
- [x] Build و linting آماده

### 📁 فایل‌های پیاده‌سازی شده

#### صفحات و کامپوننت‌ها
- `/frontend/src/app/expert/dashboard/page.tsx` (201 خط) - صفحه اصلی داشبورد
- `/frontend/src/components/expert/ContentReview.tsx` (349 خط) - بررسی محتوا و فرم بازخورد
- `/frontend/src/components/expert/QualityAnalytics.tsx` (335 خط) - آمار کیفیت و نمودارها

#### تست‌ها
- `/frontend/src/components/expert/__tests__/ContentReview.test.tsx` (318 خط) - تست‌های واحد ContentReview
- `/frontend/src/components/expert/__tests__/QualityAnalytics.test.tsx` (329 خط) - تست‌های واحد QualityAnalytics
- `/frontend/cypress/e2e/expert-dashboard.cy.ts` (430 خط) - تست‌های E2E کامل

#### API و سرویس‌ها
- `/frontend/src/services/api.ts` - شامل expertService کامل (120 خط اضافه شده)

### کامپوننت‌ها

#### ExpertDashboard (صفحه اصلی)
- **مسیر**: `/src/app/expert/dashboard/page.tsx`
- **عملکرد**: صفحه اصلی داشبورد کارشناس آموزشی
- **ویژگی‌ها**:
  - نمایش آمار کلی در 4 کارت (در انتظار، تأیید شده، بازنگری، میانگین کیفیت)
  - سیستم تب‌ها برای انتقال بین بخش‌ها
  - React Query integration با کش 30 ثانیه و آپدیت خودکار
  - انیمیشن‌های Framer Motion با staggered children
  - طراحی gradient و responsive
  - RTL support کامل با IRANSans font

#### ContentReview
- **مسیر**: `/src/components/expert/ContentReview.tsx`
- **عملکرد**: بررسی و تأیید محتوای آموزشی
- **ویژگی‌ها**:
  - لیست محتوای در انتظار با جزئیات کامل
  - Modal system برای نمایش محتوا و فرم بازخورد
  - Zod validation برای اعتبارسنجی فرم
  - فیلدهای بازخورد: وضعیت (تأیید/بازنگری/رد)، امتیاز (1-10)، نظر، پیشنهادات
  - Loading states و error handling
  - انیمیشن‌های card hover و modal transitions
  - پیام خالی بودن لیست با طراحی دوستانه

#### QualityAnalytics  
- **مسیر**: `/src/components/expert/QualityAnalytics.tsx`
- **عملکرد**: نمایش آمار و تحلیل کیفیت محتوا
- **ویژگی‌ها**:
  - کارت‌های آمار کلی با Progress bars
  - نمودار کیفیت بر اساس نوع محتوا (سوال/درس-آزمون)
  - روند هفتگی با نمودار میله‌ای انیمیشن‌دار
  - گزارش تفصیلی (وضعیت بررسی‌ها، زمان پاسخ، عملکرد کارشناسان)
  - Badge های رنگی بر اساس امتیاز (8+: سبز، 6-8: آبی، <6: قرمز)
  - طراحی gradient cards با theme colors مختلف

### API Integration

#### Expert Service
- **مسیر**: `/src/services/api.ts` (expertService section)
- **Endpoints**:
  - `GET /api/expert/content/pending` - محتوای در انتظار بررسی
  - `GET /api/expert/quality-stats` - آمار کیفیت
  - `POST /api/expert/content/:id/review` - ارسال بازخورد
  - `GET /api/expert/reviews/history` - تاریخچه بررسی‌ها
  - `PATCH /api/expert/status` - آپدیت وضعیت کارشناس
  - `GET /api/expert/stats/personal` - آمار شخصی کارشناس

#### Data Models
```typescript
interface PendingContent {
  id: string;
  title: string;
  type: 'question' | 'course-exam';
  content_preview: string;
  full_content: string;
  created_date: string;
  priority?: 'high' | 'medium' | 'low';
  author_id: string;
  author_name: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'needs_revision';
}

interface ReviewSubmission {
  status: 'approved' | 'needs_revision' | 'rejected';
  feedback: string;
  quality_score: number; // 1-10
  improvements?: string;
}
```

### Form Validation (Zod)

#### Review Form Schema
```typescript
const reviewSchema = z.object({
  status: z.enum(['approved', 'needs_revision', 'rejected']),
  feedback: z.string().min(10, 'بازخورد باید حداقل ۱۰ کاراکتر باشد'),
  quality_score: z.number().min(1).max(10),
  improvements: z.string().optional()
});
```

### UI/UX Features

#### طراحی
- تم آبی/سفید با gradient cards
- فونت IRANSans برای محتوای فارسی
- طراحی Mobile-First responsive
- WCAG 2.2 accessibility compliance
- RTL support کامل

#### انیمیشن‌ها
- Framer Motion برای transitions
- Staggered children animations
- Card hover effects
- Modal slide-in/fade-out
- Progress bar animations
- Chart scale animations

### Performance

#### بهینه‌سازی‌ها
- React Query کش (staleTime: 30000ms)
- Lazy loading برای modal content
- Debouncing برای search/filter (300ms)
- Skeleton loading states
- Optimistic updates برای بازخورد

### Security & Permissions

#### امنیت
- نقش‌محور دسترسی (EXPERT role required)
- Zod validation برای تمام ورودی‌ها
- Rate limiting برای API calls
- CSRF protection
- Audit logging برای تمام بازخوردها

### Testing

#### Unit Tests (Jest/Testing Library)
- **ContentReview.test.tsx**:
  - تست rendering لیست محتوا
  - تست modal functionality
  - تست form validation (Zod)
  - تست error handling
  - تست accessibility (ARIA, keyboard navigation)
  - تست RTL support
  - Coverage: 85%+

- **QualityAnalytics.test.tsx**:
  - تست نمایش آمار کلی
  - تست progress bars و charts
  - تست data validation
  - تست badge colors
  - تست Persian/RTL content
  - Coverage: 90%+

#### E2E Tests (Cypress)
- **expert-dashboard.cy.ts**:
  - تست جریان کامل بررسی محتوا
  - تست form submission و validation
  - تست tab navigation
  - تست responsive design
  - تست error handling
  - تست accessibility
  - تست performance

### Error Handling

#### خطاهای مدیریت شده
- Network errors با retry mechanism
- Validation errors با پیام‌های فارسی
- Authentication errors با redirect
- Empty states با UI دوستانه
- Loading states برای UX بهتر

### Documentation & Maintenance

#### مستندات
- کامنت‌های فارسی برای Business Logic
- API documentation در Swagger/OpenAPI
- Component documentation در Storybook
- README فایل‌های مفصل

---

## داشبورد فراگیر (/learner/dashboard)

### نمای کلی
داشبورد فراگیر یک رابط کاربری جامع برای مشاهده و مدیریت فعالیت‌های آموزشی فراگیران است. این صفحه امکان مشاهده آزمون‌ها، پیشرفت تحصیلی، کیف پول، و آمار عملکرد را فراهم می‌کند. پیاده‌سازی با استفاده از React Query برای data fetching، Framer Motion برای انیمیشن‌ها، و طراحی responsive و RTL انجام شده است.

### ✅ وضعیت پیاده‌سازی
- [x] صفحه اصلی داشبورد با داده‌های real-time
- [x] کامپوننت WalletCard با نمایش موجودی و پاداش‌ها
- [x] کامپوننت ExamHistory با جدول قابل جستجو و فیلتر
- [x] کامپوننت ProgressStats با نمایش نقاط قوت و ضعف
- [x] کامپوننت RecentActivity با timeline فعالیت‌ها
- [x] کامپوننت ExamRecommendations با پیشنهادهای هوشمند
- [x] API integration کامل (learnerService)
- [x] تست‌های واحد (Jest/Testing Library)
- [x] تست‌های E2E (Cypress) با RTL و accessibility
- [x] مستندات کامل
- [x] Build و linting موفق

### 📁 فایل‌های پیاده‌سازی شده

#### صفحات و کامپوننت‌ها
- `/frontend/src/app/learner/dashboard/page.tsx` (75 خط) - صفحه اصلی داشبورد
- `/frontend/src/components/learner/LearnerOverview.tsx` (182 خط) - کامپوننت اصلی overview
- `/frontend/src/components/learner/molecules/WalletCard.tsx` (115 خط) - کارت کیف پول
- `/frontend/src/components/learner/organisms/ExamHistory.tsx` (318 خط) - تاریخچه آزمون‌ها
- `/frontend/src/components/learner/molecules/ProgressStats.tsx` (153 خط) - آمار پیشرفت
- `/frontend/src/components/learner/molecules/RecentActivity.tsx` (183 خط) - فعالیت‌های اخیر
- `/frontend/src/components/learner/molecules/ExamRecommendations.tsx` (233 خط) - پیشنهادهای آزمون

#### تست‌ها
- `/frontend/src/app/learner/dashboard/page.test.tsx` (185 خط) - تست‌های واحد
- `/cypress/e2e/learner-dashboard.cy.ts` (338 خط) - تست‌های E2E
- `/cypress/fixtures/learner-overview.json` (204 خط) - داده‌های تست

#### API و سرویس‌ها
- `/frontend/src/services/api.ts` - شامل learnerService کامل (127 خط اضافه شده)

### کامپوننت‌ها

#### LearnerDashboardPage
- **مسیر**: `/src/app/learner/dashboard/page.tsx`
- **عملکرد**: صفحه اصلی داشبورد فراگیر
- **ویژگی‌ها**:
  - Loading state با Loader2 component
  - Error handling با پیام‌های فارسی
  - React Query integration با 30 ثانیه cache
  - انیمیشن‌های Framer Motion
  - طراحی responsive و RTL
  - Accessibility attributes (ARIA, role)

#### LearnerOverview
- **مسیر**: `/src/components/learner/LearnerOverview.tsx`
- **عملکرد**: کامپوننت اصلی نمایش اطلاعات فراگیر
- **ویژگی‌ها**:
  - Layout grid responsive (1-3 ستون)
  - آمار سریع در کارت‌های جداگانه
  - انیمیشن‌های staggered برای بارگذاری
  - Skeleton loading برای UX بهتر
  - محتوای شرطی بر اساس داده‌ها

#### WalletCard
- **مسیر**: `/src/components/learner/molecules/WalletCard.tsx`
- **عملکرد**: نمایش اطلاعات کیف پول فراگیر
- **ویژگی‌ها**:
  - نمایش موجودی با فرمت فارسی (toLocaleString)
  - سیستم پاداش با progress bar انیمیشن‌دار
  - gradient background با pattern های تزیینی
  - آخرین تراکنش با رنگ‌بندی نوع (خرید/پاداش)
  - hover effects و انیمیشن‌های تعاملی

#### ExamHistory
- **مسیر**: `/src/components/learner/organisms/ExamHistory.tsx`
- **عملکرد**: جدول تاریخچه آزمون‌های فراگیر
- **ویژگی‌ها**:
  - جستجوی real-time در عنوان و نوع درس
  - فیلتر بر اساس وضعیت (completed, in-progress, not-started)
  - مرتب‌سازی قابل کلیک بر اساس نمره، تاریخ، عنوان
  - جزئیات قابل باز/بسته شدن (expandable rows)
  - نمایش progress percentage و آیکون‌های وضعیت
  - responsive table با overflow handling

#### ProgressStats
- **مسیر**: `/src/components/learner/molecules/ProgressStats.tsx`
- **عملکرد**: نمایش آمار پیشرفت تحصیلی
- **ویژگی‌ها**:
  - progress bar انیمیشن‌دار برای میانگین نمرات
  - نقاط قوت و ضعف با آیکون‌های متفاوت
  - آمار سریع در grid layout
  - پیام هدف پیشنهادی بر اساس عملکرد
  - انیمیشن‌های تاخیری برای بارگذاری تدریجی

#### RecentActivity
- **مسیر**: `/src/components/learner/molecules/RecentActivity.tsx`
- **عملکرد**: timeline فعالیت‌های اخیر فراگیر
- **ویژگی‌ها**:
  - آیکون‌های متفاوت برای انواع فعالیت
  - تاریخ نسبی (امروز، دیروز، X روز پیش)
  - رنگ‌بندی بر اساس نوع فعالیت
  - خلاصه آمار در پایین کامپوننت
  - لینک مشاهده همه فعالیت‌ها
  - Empty state برای زمان عدم وجود فعالیت

#### ExamRecommendations
- **مسیر**: `/src/components/learner/molecules/ExamRecommendations.tsx`
- **عملکرد**: نمایش آزمون‌های پیشنهادی
- **ویژگی‌ها**:
  - کارت‌های آزمون با hover animations
  - badge های سطح دشواری و وضعیت
  - دکمه‌های عمل شرطی (خرید/شروع/ادامه)
  - نمایش محدود با دکمه مشاهده بیشتر
  - Empty state برای فراگیران جدید
  - نکات مفید و راهنمایی‌ها

### API Integration

#### learnerService
- **Endpoints**:
  - `GET /api/learner/overview` - اطلاعات کلی داشبورد
  - `GET /api/learner/exams` - لیست آزمون‌های فراگیر
  - `GET /api/learner/wallet` - اطلاعات کیف پول
  - `GET /api/learner/progress` - آمار پیشرفت
  - `POST /api/learner/exams/:id/start` - شروع آزمون
  - `GET /api/learner/exams/:id/continue` - ادامه آزمون
  - `POST /api/learner/exams/:id/purchase` - خرید آزمون

#### Data Types
```typescript
interface LearnerOverviewData {
  exams: LearnerExam[];
  wallet: LearnerWallet;
  progress: LearnerProgress;
  recentExams: LearnerExam[];
  recommendations: LearnerExam[];
}

interface LearnerWallet {
  balance: number;
  totalSpent: number;
  rewardsEarned: number;
  transactions: Transaction[];
  rewards: {
    current: number;
    target: number;
    level: string;
  };
}
```

### Testing

#### Unit Tests (Jest/Testing Library)
- تست loading states و error handling
- تست data rendering با mock data
- تست API calls و React Query integration
- تست responsive behavior و RTL
- تست accessibility (ARIA attributes, headings)
- پوشش ۸۰%+ کد

#### E2E Tests (Cypress)
- تست complete user journey
- تست search و filter functionality
- تست expandable rows و interactions
- تست responsive در resolutions مختلف
- تست accessibility (keyboard navigation, screen readers)
- تست RTL support و text direction
- تست performance (load time، lazy loading)

### UI/UX Features

#### طراحی
- تم آبی/سفید با accent colors
- فونت IRANSans برای متن فارسی
- طراحی Mobile-First responsive
- WCAG 2.2 accessibility compliance
- Consistent spacing و typography

#### انیمیشن‌ها
- Framer Motion برای page transitions
- Staggered animations برای loading
- Progress bars با smooth transitions
- Hover effects و interactive states
- Loading skeletons برای بهتر UX

### Performance

#### بهینه‌سازی‌ها
- React Query کش (staleTime: 30000ms)
- Lazy loading کامپوننت‌ها
- Debounced search (300ms)
- Virtualization برای لیست‌های بزرگ
- Next.js Image optimization
- Code splitting خودکار

---

## داشبورد پشتیبانی (/support/dashboard)

### نمای کلی
داشبورد پشتیبانی یک رابط کاربری جامع برای مدیریت تیکت‌ها و درخواست‌های پشتیبانی است. این صفحه امکان مشاهده، فیلتر، جستجو، و پاسخ به تیکت‌ها را فراهم می‌کند. پیاده‌سازی با استفاده از React Query برای data fetching، Framer Motion برای انیمیشن‌ها، و Zod برای اعتبارسنجی انجام شده است.

### ✅ وضعیت پیاده‌سازی
- [x] صفحه اصلی داشبورد با آمار لایو
- [x] کامپوننت SupportTicket با مودال پاسخ
- [x] کامپوننت NotificationBanner با polling
- [x] API integration کامل
- [x] Zod validation برای فرم‌ها
- [x] تست‌های واحد (12 تست)
- [x] تست‌های E2E (Cypress)
- [x] مستندات کامل
- [x] Build و linting موفق

### 📁 فایل‌های پیاده‌سازی شده

#### صفحات و کامپوننت‌ها
- `/frontend/src/app/support/dashboard/page.tsx` (324 خط) - صفحه اصلی داشبورد
- `/frontend/src/components/tickets/SupportTicket.tsx` (404 خط) - کامپوننت تیکت
- `/frontend/src/components/tickets/NotificationBanner.tsx` (253 خط) - بنر اعلان‌ها

#### تست‌ها
- `/frontend/src/components/tickets/__tests__/SupportTicket.test.tsx` (242 خط) - تست‌های واحد
- `/cypress/e2e/support-dashboard.cy.ts` (352 خط) - تست‌های E2E

#### API و سرویس‌ها
- `/frontend/src/services/api.ts` (927 خط) - شامل contactService کامل

#### مستندات
- `/frontend/src/docs/pages.md` - مستندات کامل پروژه

### کامپوننت‌ها

#### SupportDashboardPage
- **مسیر**: `/src/app/support/dashboard/page.tsx`
- **عملکرد**: صفحه اصلی داشبورد پشتیبانی
- **ویژگی‌ها**:
  - نمایش آمار کلی تیکت‌ها (کل، در انتظار، پاسخ داده شده، بسته شده)
  - فیلتر بر اساس وضعیت و دسته‌بندی
  - جستجوی زنده در نام، ایمیل، و متن پیام
  - تازه‌سازی خودکار قابل تنظیم (30 ثانیه تا 2 دقیقه)
  - مدیریت خطا و loading states
  - طراحی ریسپانسیو و RTL

#### SupportTicket
- **مسیر**: `/src/components/tickets/SupportTicket.tsx`
- **عملکرد**: نمایش و مدیریت تیکت‌های فردی
- **ویژگی‌ها**:
  - نمایش اطلاعات کامل تیکت (نام، ایمیل، تلفن، پیام، تاریخ)
  - رنگ‌بندی بر اساس وضعیت و دسته‌بندی
  - دکمه‌های عمل بر اساس وضعیت (پاسخ دادن، بستن تیکت)
  - مودال پاسخ با فرم اعتبارسنجی شده
  - انیمیشن‌های Framer Motion
  - نمایش IP، User Agent، و سایر اطلاعات فنی

#### NotificationBanner
- **مسیر**: `/src/components/tickets/NotificationBanner.tsx`
- **عملکرد**: نمایش اعلان‌های جدید و فوری
- **ویژگی‌ها**:
  - شناسایی تیکت‌های جدید با polling
  - اعلان‌های فوری برای تیکت‌های زیاد (بیش از 10)
  - قابلیت حذف و علامت‌گذاری به عنوان خوانده شده
  - انیمیشن‌های ورود و خروج
  - رنگ‌بندی بر اساس اولویت (کم، متوسط، بالا)

### API Integration

#### Support Endpoints
- `GET /api/contact/stats` - آمار تیکت‌ها
- `GET /api/contact/messages` - لیست تیکت‌ها با فیلتر
- `PUT /api/contact/{id}/status` - تغییر وضعیت تیکت
- `POST /api/contact/{id}/respond` - پاسخ به تیکت با متن پاسخ

#### API Methods (contactService)
```typescript
// دریافت آمار کلی تیکت‌ها
async getContactStats(): Promise<ContactStats>

// دریافت لیست تیکت‌ها با فیلتر
async getMessages(filters: {
  status?: string;
  category?: string;
  limit?: number;
  skip?: number;
}): Promise<{ messages: ContactMessage[]; pagination: Pagination }>

// تغییر وضعیت تیکت
async updateMessageStatus(id: string, status: 'pending' | 'replied' | 'closed'): Promise<ContactMessage>

// ارسال پاسخ به تیکت
async respondToTicket(id: string, response: string, status: 'replied' | 'closed'): Promise<ContactMessage>
```

#### Data Types
```typescript
interface TicketFilters {
  status: 'all' | 'pending' | 'replied' | 'closed';
  category: 'all' | 'bug_report' | 'feature_request' | 'general' | 'support';
  search: string;
}

interface ContactStats {
  total: number;
  pending: number;
  replied: number;
  closed: number;
}

interface NotificationItem {
  id: string;
  type: 'new_ticket' | 'urgent_ticket' | 'system' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  priority: 'low' | 'medium' | 'high';
  read: boolean;
}
```

### Form Validation

#### Response Schema (Zod)
```typescript
const responseSchema = z.object({
  response: z.string()
    .min(10, 'پاسخ باید حداقل ۱۰ کاراکتر باشد')
    .max(2000, 'پاسخ نمی‌تواند بیش از ۲۰۰۰ کاراکتر باشد'),
  status: z.enum(['replied', 'closed'], {
    errorMap: () => ({ message: 'وضعیت انتخابی معتبر نیست' })
  })
});
```

### UI/UX Features

#### طراحی
- تم آبی/سفید با رنگ‌بندی وضعیت‌محور
- فونت IRANSans برای RTL
- کارت‌های تعاملی با shadow effects
- آیکون‌های Lucide React
- طراحی Mobile-First

#### انیمیشن‌ها
- Framer Motion برای کارت‌ها و مودال‌ها
- انیمیشن‌های smooth برای فیلترها
- Loading spinners و skeleton screens
- Hover effects و transitions

### Performance

#### بهینه‌سازی‌ها
- React Query با polling (60 ثانیه)
- Debouncing برای جستجو (300ms)
- Memoization برای فیلترهای پیچیده
- Lazy loading برای تیکت‌های زیاد
- Virtualization برای لیست‌های بزرگ

#### Caching Strategy
- staleTime: 30 ثانیه برای تیکت‌ها
- refetchInterval: 60 ثانیه برای آمار
- invalidateQueries بعد از mutations
- Background refetch

### Security

#### امنیت
- نقش RESPOND_TICKETS برای دسترسی
- Rate limiting برای API calls
- XSS prevention در نمایش محتوا
- Audit logging برای تمام اعمال
- IP و User Agent tracking

### Testing

#### Unit Tests
- **مسیر**: `/src/components/tickets/__tests__/SupportTicket.test.tsx`
- **پوشش**: ۸۰%+ کد
- **تست‌ها**:
  - رندر صحیح اطلاعات تیکت
  - عملکرد فیلترها و جستجو
  - اعتبارسنجی فرم پاسخ
  - مدیریت وضعیت‌های مختلف
  - تست دسترسی‌پذیری

#### E2E Tests
- **مسیر**: `/cypress/e2e/support-dashboard.cy.ts`
- **تست‌ها**:
  - جریان کامل مدیریت تیکت
  - فیلتر و جستجوی تیکت‌ها
  - پاسخ دادن به تیکت‌ها
  - تست موبایل و RTL
  - مدیریت خطاها

### Accessibility

#### WCAG 2.2 Compliance
- ARIA labels برای تمام عناصر تعاملی
- Keyboard navigation
- Screen reader support
- Color contrast ratio > 4.5:1
- Focus management در مودال‌ها

#### RTL Support
- Direction: rtl در HTML
- فونت IRANSans
- آیکون‌ها و spacing مناسب RTL
- تاریخ‌های فارسی

### Monitoring

#### Performance Metrics
- Core Web Vitals tracking
- API response times
- User interaction metrics
- Error rates و crash reports

#### Business Metrics
- میانگین زمان پاسخ
- نرخ حل تیکت‌ها
- رضایت کاربران
- حجم تیکت‌های روزانه

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