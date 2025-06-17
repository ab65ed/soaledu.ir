# گزارش کامل ساختار درختی فرانت‌اند

## تاریخ گزارش: ${new Date().toLocaleDateString('fa-IR')}

## ساختار کلی پروژه فرانت‌اند

```
frontend/
├── 📁 .next/                          # فایل‌های بیلد Next.js (خودکار)
├── 📁 .swc/                           # کش کامپایلر SWC
├── 📁 coverage/                       # گزارش‌های پوشش تست
├── 📁 cypress/                        # تست‌های E2E
│   ├── 📁 e2e/
│   │   ├── 📄 course-exam.cy.ts
│   │   ├── 📄 expert-dashboard.cy.ts
│   │   └── 📄 student-dashboard.cy.ts
│   └── 📁 fixtures/
├── 📁 docs/                           # مستندات پروژه
│   ├── 📄 completion-roadmap.md
│   ├── 📄 critical-components-implementation-report.md
│   ├── 📄 final-completion-report.md
│   ├── 📄 institutional-discount-reports.md
│   ├── 📄 issues-report.md
│   ├── 📄 pages.md
│   ├── 📄 performance-report.md
│   ├── 📄 priority-2-completion-report.md
│   ├── 📄 progress-report.md
│   ├── 📄 test-exam-analytics-completion-report.md
│   └── 📄 test-report.md
├── 📁 frontend/                       # پوشه اضافی (احتمالاً قدیمی)
├── 📁 node_modules/                   # وابستگی‌های npm
├── 📁 public/                         # فایل‌های استاتیک
│   ├── 📁 fonts/
│   └── 📁 images/
└── 📁 src/                           # کد اصلی پروژه
    ├── 📁 app/                       # صفحات Next.js App Router
    │   ├── 📄 globals.css
    │   ├── 📄 layout.tsx
    │   ├── 📄 page.tsx
    │   ├── 📁 course-exam/
    │   │   └── 📄 page.tsx
    │   └── 📁 test/
    │       └── 📄 page.tsx
    ├── 📁 components/                # کامپوننت‌های React
    │   ├── 📁 admin/                 # کامپوننت‌های ادمین
    │   │   ├── 📁 institutional-discount/
    │   │   │   └── 📁 __tests__/
    │   │   ├── 📁 institutions/
    │   │   └── 📁 __tests__/
    │   ├── 📁 atoms/                 # کامپوننت‌های اتمی
    │   │   └── 📁 flashcard/
    │   ├── 📁 auth/                  # کامپوننت‌های احراز هویت
    │   │   └── 📁 __tests__/
    │   ├── 📁 contact/               # کامپوننت‌های تماس
    │   ├── 📁 course/                # کامپوننت‌های دوره
    │   │   ├── 📁 exams/
    │   │   │   └── 📁 __tests__/
    │   ├── 📁 designer/              # کامپوننت‌های طراح
    │   ├── 📁 expert/                # کامپوننت‌های کارشناس
    │   │   └── 📁 __tests__/
    │   ├── 📁 flashcard/             # کامپوننت‌های فلش کارت
    │   ├── 📁 layout/                # کامپوننت‌های لایه
    │   ├── 📁 learner/               # کامپوننت‌های یادگیرنده
    │   │   ├── 📁 molecules/
    │   │   └── 📁 organisms/
    │   ├── 📁 molecules/             # کامپوننت‌های مولکولی
    │   │   ├── 📁 flashcard/
    │   │   └── 📁 __tests__/
    │   ├── 📁 organisms/             # کامپوننت‌های ارگانیک
    │   │   ├── 📁 flashcard/
    │   │   └── 📁 __tests__/
    │   ├── 📁 questions/             # کامپوننت‌های سوال
    │   │   └── 📁 __tests__/
    │   ├── 📁 shared/                # کامپوننت‌های مشترک
    │   ├── 📁 student/               # کامپوننت‌های دانشجو
    │   │   └── 📁 __tests__/
    │   ├── 📁 support/               # کامپوننت‌های پشتیبانی
    │   ├── 📁 surveys/               # کامپوننت‌های نظرسنجی
    │   ├── 📁 test/                  # کامپوننت‌های تست
    │   │   ├── 📁 exams/
    │   │   │   └── 📁 __tests__/
    │   └── 📁 tickets/               # کامپوننت‌های تیکت
    │       └── 📁 __tests__/
    ├── 📁 docs/                      # مستندات داخلی
    │   ├── 📄 pages.md
    │   ├── 📄 progress-report.md
    │   ├── 📄 prompt-checklist.md
    │   └── 📄 test-report.md
    ├── 📁 hooks/                     # هوک‌های React
    │   ├── 📄 useAuth.ts
    │   ├── 📄 useBlog.ts
    │   ├── 📄 useDebounce.ts
    │   ├── 📄 useFlashcards.ts
    │   ├── 📄 useInstitutionalDiscount.ts
    │   └── 📄 useInstitution.ts
    ├── 📁 services/                  # سرویس‌های API
    │   ├── 📄 api.ts
    │   ├── 📄 flashcardService.ts
    │   ├── 📄 institutionalDiscountService.ts
    │   └── 📄 institutionService.ts
    ├── 📁 stores/                    # مدیریت state
    │   └── 📄 authStore.ts
    ├── 📁 test-utils/                # ابزارهای تست
    │   ├── 📁 __mocks__/
    │   │   └── 📄 fileMock.js
    │   └── 📄 setupTests.js
    ├── 📁 types/                     # تعریف انواع TypeScript
    │   ├── 📄 institutionalDiscount.ts
    │   └── 📄 institution.ts
    ├── 📁 utils/                     # ابزارهای کمکی
    │   └── 📄 cn.ts
    └── 📄 theme.js                   # تنظیمات تم
```

## فایل‌های کانفیگ اصلی

```
📄 .eslintrc.json                     # کانفیگ ESLint
📄 .gitignore                         # فایل‌های نادیده گرفته شده Git
📄 eslint.config.mjs                  # کانفیگ جدید ESLint
📄 jest.config.js                     # کانفیگ Jest برای تست
📄 next.config.ts                     # کانفیگ Next.js
📄 next-env.d.ts                      # تعریف انواع Next.js
📄 package.json                       # وابستگی‌ها و اسکریپت‌ها
📄 postcss.config.js                  # کانفیگ PostCSS
📄 postcss.config.mjs                 # کانفیگ جدید PostCSS
📄 README.md                          # راهنمای پروژه
📄 tsconfig.json                      # کانفیگ TypeScript
```

## آمار کلی پروژه

### تعداد فایل‌ها بر اساس نوع:
- **TypeScript/TSX**: ~40+ فایل
- **JavaScript/JSX**: ~5 فایل
- **Markdown**: ~15 فایل
- **JSON**: ~5 فایل
- **CSS**: ~2 فایل

### ساختار معماری:
- **Atomic Design**: استفاده از atoms, molecules, organisms
- **Feature-based**: تقسیم‌بندی بر اساس نقش‌ها (admin, student, expert, etc.)
- **Next.js App Router**: استفاده از ساختار جدید Next.js 13+
- **TypeScript**: پشتیبانی کامل از TypeScript

### پوشه‌های اصلی:
1. **src/app/**: صفحات اصلی برنامه
2. **src/components/**: کامپوننت‌های قابل استفاده مجدد
3. **src/hooks/**: هوک‌های سفارشی React
4. **src/services/**: سرویس‌های API و ارتباط با بک‌اند
5. **src/stores/**: مدیریت state سراسری
6. **src/types/**: تعریف انواع TypeScript
7. **src/utils/**: توابع کمکی
8. **docs/**: مستندات کامل پروژه
9. **cypress/**: تست‌های End-to-End

## نکات مهم:
- پروژه از معماری Atomic Design استفاده می‌کند
- تست‌های کامل با Jest و Cypress پیاده‌سازی شده
- مستندات جامع در پوشه docs موجود است
- پشتیبانی کامل از TypeScript
- استفاده از Next.js 13+ با App Router
- پیاده‌سازی نقش‌های مختلف کاربری (Admin, Student, Expert, etc.)

---
*این گزارش در تاریخ ${new Date().toLocaleDateString('fa-IR')} تولید شده است.* 