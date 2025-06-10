# صفحات پروژه

## صفحات پیاده‌سازی شده

### 1. صفحه آزمون‌های تستی (`/test-exams`)

**مسیر**: `/frontend/src/app/test-exams/page.tsx`

**توضیحات**: صفحه اصلی آزمون‌های تستی که شامل لیست آزمون‌ها، جستجو، فیلتر و امکان شرکت در آزمون است.

**ویژگی‌های کلیدی**:
- جستجو و فیلتر بر اساس پایه تحصیلی، نوع درس و سطح سختی
- نمایش کارت‌های آزمون با اطلاعات کامل (قیمت، زمان، تعداد سوال)
- توزیع سختی سوالات (حداکثر ۲۰٪ آسان، ۳۰٪ متوسط، بقیه سخت)
- پشتیبانی از RTL و فونت IRANSans
- انیمیشن‌های Framer Motion
- طراحی واکنش‌گرا (Mobile-First)

**کامپوننت‌های مرتبط**:

#### 1.1. GraphicalTimer
**مسیر**: `/frontend/src/components/test/exams/GraphicalTimer.tsx`

**توضیحات**: تایمر گرافیکی دایره‌ای با انیمیشن SVG

**ویژگی‌ها**:
- تایمر دایره‌ای با نوار پیشرفت
- هشدارهای رنگی (آبی → زرد → قرمز)
- حالت هشدار در ۲۵٪ زمان باقی‌مانده
- حالت بحرانی در ۱۰٪ زمان باقی‌مانده
- فرمت اعداد فارسی
- انیمیشن‌های تپش در حالت بحرانی
- پشتیبانی از Pause/Resume

#### 1.2. ExamQuestions
**مسیر**: `/frontend/src/components/test/exams/ExamQuestions.tsx`

**توضیحات**: کامپوننت نمایش سوالات آزمون

**ویژگی‌ها**:
- نمایش سوال فعلی با گزینه‌های چهارگانه
- ناوبری بین سوالات (قبلی/بعدی)
- نمای کلی سوالات (Question Overview)
- نشان‌گذاری سوالات پاسخ داده شده
- نمایش متادیتای سوال (سختی، فصل، زمان تخمینی)
- نوار پیشرفت آزمون
- رنگ‌بندی بر اساس سطح سختی

#### 1.3. PaymentModal
**مسیر**: `/frontend/src/components/test/exams/PaymentModal.tsx`

**توضیحات**: مودال پرداخت آزمون

**ویژگی‌ها**:
- نمایش جزئیات آزمون و قیمت‌گذاری
- انتخاب روش پرداخت (کارت/کیف پول)
- اعمال کد تخفیف
- نمایش توزیع سختی سوالات
- مدیریت خطاها و حالت‌های لودینگ
- انیمیشن‌های ورود/خروج

**API Services مرتبط**:

#### testExamService
- `getTestExams()`: دریافت لیست آزمون‌ها
- `getTestExamById(id)`: دریافت جزئیات آزمون
- `getTestExamQuestions(examId)`: دریافت سوالات آزمون
- `startTestExam(examId)`: شروع آزمون جدید
- `resumeTestExam(sessionId)`: ادامه آزمون
- `saveAnswer(sessionId, questionId, answer)`: ذخیره پاسخ
- `submitTestExam(sessionId)`: ارسال نهایی آزمون
- `getTestExamResult(sessionId)`: دریافت نتیجه آزمون

#### financeService
- `getTestExamPricing(examId)`: دریافت قیمت آزمون
- `purchaseTestExam(data)`: خرید آزمون
- `verifyTestExamPayment(paymentId)`: تایید پرداخت
- `getAvailableDiscounts()`: دریافت تخفیف‌های موجود
- `applyDiscountCode(code)`: اعمال کد تخفیف

**تست‌ها**:
- تست‌های واحد برای همه کامپوننت‌ها
- پوشش تست بالای ۸۰٪
- تست‌های دسترسی (WCAG 2.2)
- تست‌های واکنش‌گرا

**مسائل حل شده**:
- پیاده‌سازی کامل صفحه `/test-exams`
- ایجاد کامپوننت‌های GraphicalTimer، ExamQuestions، PaymentModal
- اضافه کردن سرویس‌های API مرتبط
- تست‌های جامع برای همه کامپوننت‌ها

**مسائل باقی‌مانده**:
- اتصال به API واقعی (در حال حاضر Mock Data)
- تست‌های E2E با Cypress
- بهینه‌سازی عملکرد QuestionSelector

---

### 2. صفحه ایجاد درس-آزمون (`/course-exam`)

**مسیر**: `/frontend/src/app/course-exam/page.tsx`

**توضیحات**: صفحه ایجاد درس-آزمون جدید با فرم چندمرحله‌ای و انتخاب هوشمند سوالات.

**ویژگی‌های کلیدی**:
- فرم ۵ مرحله‌ای (نوع درس، مقطع، گروه، جزئیات، سوالات)
- ۴ dropdown برای انتخاب (نوع، مقطع، گروه، نام)
- قیمت پیش‌فرض ۳۰ تومان
- اعتبارسنجی کامل با Zod
- انیمیشن‌های Framer Motion
- طراحی RTL با فونت IRANSans
- تم آبی/سفید

**کامپوننت‌های مرتبط**:

#### 2.1. NewCourseExamForm
**مسیر**: `/frontend/src/components/course/exams/NewCourseExamForm.tsx`

**توضیحات**: فرم چندمرحله‌ای برای ایجاد درس-آزمون

**ویژگی‌ها**:
- ۵ مرحله با Progress Bar
- اعتبارسنجی مرحله‌ای
- ناوبری بین مراحل
- ذخیره خودکار پیشرفت
- انیمیشن‌های انتقال بین مراحل

#### 2.2. QuestionSelector
**مسیر**: `/frontend/src/components/questions/QuestionSelector.tsx`

**توضیحات**: انتخاب هوشمند سوالات با A/B Testing

**ویژگی‌ها**:
- A/B Testing (نمایش کامل vs خلاصه)
- Virtualization برای بهینه‌سازی عملکرد
- جستجو با Debounce (۳۰۰ms)
- فیلترهای پیشرفته
- انتخاب چندگانه سوالات
- نمایش آمار انتخاب

#### 2.3. StarRating
**مسیر**: `/frontend/src/components/molecules/StarRating.tsx`

**توضیحات**: نظرسنجی ۵ ستاره

**ویژگی‌ها**:
- انیمیشن‌های تعاملی
- فیدبک متنی اختیاری
- مودال زیبا با backdrop
- انیمیشن‌های ورود/خروج

**API Services مرتبط**:

#### courseExamService
- `createCourseExam(data)`: ایجاد درس-آزمون جدید
- `fetchCourseExams(filters)`: دریافت لیست درس-آزمون‌ها
- `getCourseExamById(id)`: دریافت جزئیات درس-آزمون
- `updateCourseExam(id, data)`: ویرایش درس-آزمون
- `deleteCourseExam(id)`: حذف درس-آزمون

#### questionService
- `fetchQuestions(filters)`: دریافت سوالات با فیلتر
- `searchQuestions(query)`: جستجو در سوالات

**تست‌ها**:
- تست‌های واحد کامل برای همه کامپوننت‌ها
- تست‌های تعامل فرم چندمرحله‌ای
- تست‌های اعتبارسنجی
- تست‌های A/B Testing
- پوشش تست بالای ۸۰٪

**مسائل حل شده**:
- پیاده‌سازی کامل صفحه `/course-exam`
- ایجاد فرم چندمرحله‌ای با اعتبارسنجی
- پیاده‌سازی QuestionSelector با A/B Testing
- ایجاد کامپوننت StarRating
- اضافه کردن hook useDebounce
- تست‌های جامع

**مسائل باقی‌مانده**:
- اتصال کامل به API واقعی
- تست‌های E2E با Cypress
- بهینه‌سازی بیشتر عملکرد

## صفحات در حال توسعه

### 3. صفحه سوالات (`/questions`)
**وضعیت**: در حال توسعه
**اولویت**: بالا

### 4. صفحه تماس (`/contact`)
**وضعیت**: برنامه‌ریزی شده
**اولویت**: متوسط

---

## معماری کلی

**فریمورک**: Next.js 14 با App Router
**زبان**: TypeScript
**استایل**: Tailwind CSS
**انیمیشن**: Framer Motion
**مدیریت State**: React Query + Zustand
**تست**: Jest + React Testing Library + Cypress
**دسترسی**: WCAG 2.2
**طراحی**: Mobile-First Responsive

**ساختار فایل‌ها**:
```
frontend/src/
├── app/
│   └── test-exams/
│       └── page.tsx
├── components/
│   └── test/
│       └── exams/
│           ├── GraphicalTimer.tsx
│           ├── ExamQuestions.tsx
│           ├── PaymentModal.tsx
│           └── __tests__/
├── services/
│   └── api.ts
└── docs/
    ├── pages.md
    ├── progress-report.md
    └── test-report.md
``` 