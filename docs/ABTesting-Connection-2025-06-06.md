# مستندات اتصال A/B Testing به سیستم درس-آزمون
## تاریخ: ۱۴۰۳/۰۹/۱۶ (۲۰۲۵-۰۶-۰۶)

### خلاصه پروژه
این مستند شرح کاملی از پیاده‌سازی سیستم A/B Testing و اتصال آن به سیستم درس-آزمون و انتخاب سوالات ارائه می‌دهد.

## 🎯 اهداف پروژه

### اهداف اصلی
- پیاده‌سازی سیستم A/B Testing کامل برای بهبود UI/UX
- اتصال تست‌های A/B به سیستم درس-آزمون
- بهینه‌سازی فرآیند انتخاب سوالات بر اساس نتایج تست‌ها
- ارائه آنالیز آماری و توصیه‌های هوشمند

### اهداف فرعی
- بهبود نرخ تبدیل (Conversion Rate) در انتخاب سوالات
- کاهش زمان انتخاب سوال توسط کاربران
- افزایش رضایت کاربران از رابط کاربری
- جمع‌آوری داده‌های رفتاری کاربران

## 🏗️ معماری سیستم

### Frontend Architecture
```
frontend/src/
├── components/
│   ├── admin/
│   │   └── ABTestResults.tsx          # نمایش نتایج تست‌های A/B
│   └── molecules/
│       └── QuestionSelector.tsx       # انتخابگر سوالات با A/B testing
├── hooks/
│   └── useABTesting.ts               # هوک‌های React Query برای A/B testing
├── services/
│   └── abTestingApi.ts               # سرویس‌های API
├── types/
│   └── ab-test.ts                    # تایپ‌های TypeScript
└── __tests__/
    ├── ab-testing-connection.test.tsx # تست‌های integration
    └── e2e/
        └── ab-testing-connection.cy.ts # تست‌های E2E
```

### Backend Architecture
```
backend/src/
├── controllers/
│   └── ab-test.ts                    # کنترلر A/B testing
├── models/
│   └── ab-test.ts                    # مدل‌های دیتابیس
├── routes/
│   └── ab-test.ts                    # مسیرهای API
└── middleware/
    └── roles.ts                      # میدلور نقش‌ها
```

## 🔧 کامپوننت‌های پیاده‌سازی شده

### 1. ABTestResults Component
**مسیر:** `frontend/src/components/admin/ABTestResults.tsx`

**ویژگی‌ها:**
- نمایش آمار کلی تست (شرکت‌کنندگان، تبدیل‌ها، نرخ تبدیل)
- نمایش variants با رنگ‌بندی و نوار پیشرفت
- سه نمای مختلف: overview، detailed، timeline
- توصیه‌های عمل بر اساس نتایج آماری
- UI فارسی با RTL و فونت IRANSans

**کد نمونه:**
```tsx
const ABTestResults = React.memo(({ testId }: { testId: string }) => {
  const { data: results, isLoading } = useABTestResults(testId);
  
  if (isLoading) return <LoadingSpinner />;
  
  return (
    <div className="space-y-6 font-IRANSans" dir="rtl">
      {/* آمار کلی */}
      <OverviewStats results={results} />
      
      {/* نمایش variants */}
      <VariantsComparison variants={results.variants} />
      
      {/* توصیه‌های عمل */}
      <ActionRecommendations results={results} />
    </div>
  );
});
```

### 2. useABTesting Hooks
**مسیر:** `frontend/src/hooks/useABTesting.ts`

**هوک‌های موجود:**
- `useABTests()` - دریافت لیست تست‌ها
- `useABTest(testId)` - دریافت یک تست خاص
- `useABTestResults(testId)` - دریافت نتایج تست
- `useCreateABTest()` - ایجاد تست جدید
- `useUpdateABTest()` - بروزرسانی تست
- `useDeleteABTest()` - حذف تست
- `useStartABTest()` - شروع تست
- `usePauseABTest()` - متوقف کردن تست
- `useStopABTest()` - پایان تست
- `useAssignUserToVariant()` - تخصیص variant
- `useRecordConversion()` - ثبت conversion
- `useABTestingForComponent()` - integration در کامپوننت‌ها
- `useQuestionSelectorABTest()` - ویژه برای QuestionSelector

**مثال استفاده:**
```tsx
const { data: tests, isLoading } = useABTests({
  status: 'running',
  targetType: 'exam'
});

const createTest = useCreateABTest();
const handleCreate = (data) => {
  createTest.mutate(data, {
    onSuccess: () => toast.success('تست ایجاد شد')
  });
};
```

### 3. QuestionSelector Enhancement
**مسیر:** `frontend/src/components/molecules/QuestionSelector.tsx`

**بهبودهای اعمال شده:**
- اتصال به سیستم A/B testing
- تخصیص خودکار variant به کاربران
- ثبت conversion بر اساس انتخاب سوالات
- نمایش وضعیت اتصال به درس-آزمون
- بهینه‌سازی performance با memoization

**Props جدید:**
```tsx
interface QuestionSelectorProps {
  // ... props موجود
  userId?: string;
  enableABTesting?: boolean;
  courseExamId?: string;
}
```

### 4. API Services
**مسیر:** `frontend/src/services/abTestingApi.ts`

**سرویس‌های موجود:**
- `getABTests()` - دریافت لیست تست‌ها
- `getABTestById()` - دریافت تست خاص
- `createABTest()` - ایجاد تست
- `updateABTest()` - بروزرسانی تست
- `deleteABTest()` - حذف تست
- `assignUserToVariant()` - تخصیص variant
- `recordConversion()` - ثبت conversion
- `getABTestAnalytics()` - دریافت آنالیتیکس
- `getActiveABTestForPath()` - یافتن تست فعال

## 📊 تایپ‌های TypeScript

### ABTest Interface
```typescript
interface ABTest {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'running' | 'paused' | 'completed';
  targetType: 'form' | 'dashboard' | 'flashcard' | 'exam';
  targetPath: string;
  variants: ABTestVariant[];
  participants: any[];
  startDate: Date;
  endDate?: Date;
  minSampleSize: number;
  confidenceLevel: number;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  metrics?: ABTestMetrics;
}
```

### ABTestVariant Interface
```typescript
interface ABTestVariant {
  id: string;
  name: string;
  description: string;
  percentage: number;
  config: Record<string, any>;
  isControl: boolean;
}
```

### QuestionABTestConfig Interface
```typescript
interface QuestionABTestConfig {
  courseExamId?: string;
  questionIds?: string[];
  selectionMethod: 'smart' | 'random' | 'non-repetitive';
  uiVariant: 'default' | 'enhanced' | 'minimal';
  showProgress: boolean;
  enableFilters: boolean;
}
```

## 🧪 تست‌ها

### Jest Integration Tests
**مسیر:** `frontend/src/__tests__/ab-testing-connection.test.tsx`

**تست‌های موجود:**
- تست اتصال کامپوننت‌ها
- تست hooks و API calls
- تست props passing و state management
- تست performance و memory management

**مثال تست:**
```tsx
describe('AB Testing Connection', () => {
  it('should assign variant and record conversion', async () => {
    const { result } = renderHook(() => useQuestionSelectorABTest('exam-123', 'user-456'));
    
    await waitFor(() => {
      expect(result.current.assignedVariant).toBeDefined();
    });
    
    act(() => {
      result.current.recordConversion('question_selected');
    });
    
    expect(mockRecordConversion).toHaveBeenCalledWith(
      expect.any(String),
      'user-456',
      result.current.assignedVariant.id,
      'question_selected',
      1
    );
  });
});
```

### Cypress E2E Tests
**مسیر:** `frontend/src/__tests__/e2e/ab-testing-connection.cy.ts`

**سناریوهای تست:**
- جریان کامل کاربر: ایجاد تست → انتخاب سوال → مشاهده نتایج
- تست responsive design
- مدیریت خطاها و error handling
- Performance و accessibility testing

## 🚀 نحوه استفاده

### 1. ایجاد تست A/B جدید
```tsx
const CreateABTest = () => {
  const createTest = useCreateABTest();
  
  const handleSubmit = (data) => {
    createTest.mutate({
      name: 'Question Selector UI Test',
      description: 'Testing different UI variants for question selection',
      targetType: 'exam',
      targetPath: '/course-exam',
      variants: [
        {
          name: 'Control',
          description: 'Original UI',
          percentage: 50,
          config: { uiVariant: 'default' },
          isControl: true
        },
        {
          name: 'Enhanced',
          description: 'Enhanced UI with better filters',
          percentage: 50,
          config: { uiVariant: 'enhanced' },
          isControl: false
        }
      ],
      minSampleSize: 100,
      confidenceLevel: 95
    });
  };
  
  return <ABTestForm onSubmit={handleSubmit} />;
};
```

### 2. استفاده در QuestionSelector
```tsx
const ExamPage = () => {
  const userId = useCurrentUser()?.id;
  
  return (
    <QuestionSelector
      courseExamId="exam-123"
      questionsCount={40}
      userId={userId}
      enableABTesting={true}
      onQuestionsChange={handleQuestionsChange}
      onCountChange={handleCountChange}
    />
  );
};
```

### 3. مشاهده نتایج
```tsx
const ABTestDashboard = () => {
  const { data: tests } = useABTests({ status: 'running' });
  
  return (
    <div>
      {tests?.map(test => (
        <div key={test.id}>
          <h3>{test.name}</h3>
          <ABTestResults testId={test.id} />
        </div>
      ))}
    </div>
  );
};
```

## 📈 آنالیز و گزارش‌گیری

### متریک‌های اندازه‌گیری
- **Conversion Rate:** نرخ تبدیل انتخاب سوالات
- **Time to Selection:** زمان انتخاب سوال
- **User Satisfaction:** رضایت کاربر از رابط
- **Error Rate:** نرخ خطا در انتخاب
- **Bounce Rate:** نرخ ترک صفحه

### گزارش‌های موجود
- گزارش عملکرد تست‌ها
- آنالیز رفتار کاربران
- مقایسه variants
- توصیه‌های بهبود

### نمونه گزارش
```typescript
const report = {
  summary: {
    totalTests: 5,
    activeTests: 2,
    completedTests: 3,
    averageConversionRate: 0.23
  },
  topPerformingTests: [
    {
      id: 'test-1',
      name: 'Question Selector Enhancement',
      conversionRate: 0.31,
      improvement: '+15%'
    }
  ],
  recommendations: [
    'ادامه تست Enhanced variant به دلیل نتایج بهتر',
    'بررسی عوامل موثر در کاهش زمان انتخاب'
  ]
};
```

## 🔒 امنیت و مجوزها

### کنترل دسترسی
- فقط ادمین‌ها می‌توانند تست ایجاد کنند
- مشاهده نتایج نیاز به نقش مناسب دارد
- تخصیص variant به صورت خودکار انجام می‌شود

### حفاظت از داده‌ها
- رمزنگاری اطلاعات حساس
- Audit trail برای تمام عملیات
- Backup خودکار نتایج تست‌ها

## 🐛 مشکلات شناخته شده

### مشکلات حل شده
- ✅ خطاهای TypeScript در errorTracking.ts
- ✅ مشکلات import در abTestingApi.ts
- ✅ بهبود QuestionSelector component

### مشکلات باقی‌مانده
- ⚠️ خطاهای Cypress در فایل‌های تست E2E
- ⚠️ نیاز به تنظیمات اضافی برای production
- ⚠️ بهینه‌سازی performance در حجم بالای داده

## 🔄 بروزرسانی‌های آینده

### نسخه بعدی (v2.0)
- پشتیبانی از Multi-variate testing
- Machine Learning برای پیش‌بینی نتایج
- Real-time analytics dashboard
- Integration با Google Analytics

### بهبودهای پیشنهادی
- Cache بهتر برای نتایج تست‌ها
- UI/UX بهتر برای مدیریت تست‌ها
- گزارش‌گیری پیشرفته‌تر
- پشتیبانی از تست‌های چندمرحله‌ای

## 📚 منابع و مراجع

### مستندات فنی
- [React Query Documentation](https://tanstack.com/query/latest)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)

### مقالات A/B Testing
- [A/B Testing Best Practices](https://vwo.com/ab-testing/)
- [Statistical Significance in A/B Testing](https://blog.optimizely.com/2015/01/20/statistics-for-the-internet-age-the-story-behind-optimizelys-new-stats-engine/)

### ابزارها و کتابخانه‌ها
- Jest برای Unit Testing
- Cypress برای E2E Testing
- React Query برای State Management
- Tailwind CSS برای Styling

---

**تاریخ آخرین بروزرسانی:** ۱۴۰۳/۰۹/۱۶  
**نسخه مستند:** 1.0  
**نویسنده:** تیم توسعه Exam-Edu 