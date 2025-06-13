# گزارش‌گیری پیشرفته تخفیف‌های سازمانی

## خلاصه

این سیستم برای پایش و تحلیل عملکرد تخفیف‌های سازمانی طراحی شده و شامل چهار نوع گزارش اصلی است:

1. **گزارش استفاده (Usage Report)**: تحلیل میزان استفاده از تخفیف‌ها
2. **گزارش درآمد (Revenue Report)**: تحلیل درآمد حاصل از تخفیف‌ها
3. **گزارش نرخ تبدیل (Conversion Report)**: تحلیل نرخ تبدیل کاربران واجد شرایط
4. **گزارش مقایسه‌ای (Comparison Report)**: مقایسه عملکرد گروه‌های مختلف

## معماری Backend

### مدل‌های جدید

#### WalletTransaction Model
```typescript
export interface IWalletTransaction extends Document {
  userId: mongoose.Types.ObjectId;
  type: TransactionType;
  amount: number;
  description: string;
  status: TransactionStatus;
  
  // فیلدهای جدید برای تخفیف‌های سازمانی
  institutionalDiscountGroupId?: mongoose.Types.ObjectId;
  institutionId?: mongoose.Types.ObjectId;
  discountAmount?: number;
  discountPercentage?: number;
  originalAmount?: number; // مبلغ اصلی قبل از اعمال تخفیف
  isInstitutionalDiscount?: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}
```

### API Endpoints

#### 1. گزارش استفاده
```
GET /api/admin/institutional-discounts/reports/usage
```

**Query Parameters:**
- `groupId` (optional): شناسه گروه تخفیف
- `institutionId` (optional): شناسه سازمان
- `startDate` (optional): تاریخ شروع
- `endDate` (optional): تاریخ پایان
- `page` (default: 1): شماره صفحه
- `limit` (default: 20): تعداد آیتم در هر صفحه
- `sortBy` (default: 'usageCount'): فیلد مرتب‌سازی
- `sortOrder` (default: 'desc'): نوع مرتب‌سازی

**Response:**
```json
{
  "success": true,
  "data": {
    "reports": [
      {
        "groupId": "...",
        "groupName": "دانشگاه تهران",
        "usageCount": 150,
        "uniqueUsersCount": 120,
        "totalDiscountAmount": 5000000,
        "totalOriginalAmount": 8000000,
        "totalPaidAmount": 3000000,
        "avgDiscountPercentage": 62.5,
        "savingsPercentage": 62.5,
        "conversionRate": 80
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 100,
      "itemsPerPage": 20
    }
  }
}
```

#### 2. گزارش درآمد
```
GET /api/admin/institutional-discounts/reports/revenue
```

**Query Parameters:**
- `groupId` (optional): شناسه گروه تخفیف
- `institutionId` (optional): شناسه سازمان
- `startDate` (optional): تاریخ شروع
- `endDate` (optional): تاریخ پایان
- `period` (default: 'monthly'): دوره زمانی ('daily', 'weekly', 'monthly', 'yearly')

**Response:**
```json
{
  "success": true,
  "data": {
    "period": "monthly",
    "revenueData": [
      {
        "_id": {
          "year": 2025,
          "month": 1
        },
        "totalRevenue": 10000000,
        "totalDiscountGiven": 3000000,
        "totalOriginalAmount": 13000000,
        "transactionCount": 250,
        "uniqueUsersCount": 180,
        "avgTransactionAmount": 40000,
        "discountRate": 23.08,
        "revenuePerUser": 55556
      }
    ],
    "summary": {
      "totalPeriods": 12,
      "totalRevenue": 120000000,
      "totalDiscountGiven": 36000000,
      "totalTransactions": 3000,
      "avgRevenuePerPeriod": 10000000
    }
  }
}
```

#### 3. گزارش نرخ تبدیل
```
GET /api/admin/institutional-discounts/reports/conversion
```

**Response:**
```json
{
  "success": true,
  "data": {
    "conversionData": [
      {
        "_id": "...",
        "groupName": "دانشگاه شریف",
        "totalEligibleUsers": 500,
        "totalTransactions": 300,
        "uniqueUsers": 250,
        "totalRevenue": 8000000,
        "totalDiscountGiven": 2400000,
        "conversionRate": 50,
        "avgTransactionsPerUser": 1.2,
        "avgRevenuePerUser": 32000
      }
    ],
    "summary": {
      "totalGroups": 15,
      "avgConversionRate": 45.6,
      "bestPerforming": {...},
      "totalEligibleUsers": 5000,
      "totalActiveUsers": 2280
    }
  }
}
```

#### 4. گزارش مقایسه‌ای
```
GET /api/admin/institutional-discounts/reports/comparison
```

**Query Parameters:**
- `startDate` (optional): تاریخ شروع
- `endDate` (optional): تاریخ پایان
- `metric` (default: 'revenue'): متریک مقایسه ('revenue', 'conversionRate', 'usageCount', 'discountEfficiency', 'roi')

**Response:**
```json
{
  "success": true,
  "data": {
    "comparisonData": [
      {
        "_id": "...",
        "groupName": "دانشگاه امیرکبیر",
        "totalEligibleUsers": 300,
        "totalTransactions": 180,
        "uniqueUsers": 150,
        "totalRevenue": 6000000,
        "totalDiscountGiven": 1800000,
        "totalOriginalAmount": 7800000,
        "conversionRate": 50,
        "avgRevenuePerUser": 40000,
        "discountEfficiency": 3.33,
        "roi": 233.33
      }
    ],
    "summary": {
      "totalGroups": 20,
      "topPerformer": {...},
      "totalRevenue": 150000000,
      "totalDiscountGiven": 45000000,
      "avgConversionRate": 48.2,
      "totalEligibleUsers": 8000,
      "totalActiveUsers": 3856
    }
  }
}
```

## معماری Frontend

### Services

#### institutionalDiscountService.ts
```typescript
const institutionalDiscountService = {
  async getUsageReport(filters: ReportFilters): Promise<UsageReportResponse>,
  async getRevenueReport(filters: ReportFilters): Promise<RevenueReportResponse>,
  async getConversionReport(filters: ReportFilters): Promise<ConversionReportResponse>,
  async getComparisonReport(filters: ReportFilters): Promise<ComparisonReportResponse>,
  async getDashboardStats(): Promise<DashboardStats>
};
```

### Hooks

#### useInstitutionalDiscount.ts
```typescript
export const useUsageReport = (filters: ReportFilters);
export const useRevenueReport = (filters: ReportFilters);
export const useConversionReport = (filters: ReportFilters);
export const useComparisonReport = (filters: ReportFilters);
export const useDashboardStats = ();
```

### Components

#### صفحه گزارش‌گیری اصلی
`/app/(dashboard)/admin/institutional-discounts/reports/page.tsx`

**ویژگی‌های کلیدی:**
- داشبورد آماری با کارت‌های رنگی
- فیلترهای پیشرفته (تاریخ، دوره، مرتب‌سازی)
- تب‌های مختلف برای انواع گزارش‌ها
- نمایش داده‌ها با جداول و نمودارها
- قابلیت export گزارش‌ها
- طراحی responsive با animations

## متریک‌های کلیدی

### 1. نرخ تبدیل (Conversion Rate)
```
نرخ تبدیل = (تعداد کاربران فعال / تعداد کاربران واجد شرایط) × 100
```

### 2. بازده سرمایه‌گذاری (ROI)
```
ROI = ((درآمد خالص - تخفیف داده شده) / تخفیف داده شده) × 100
```

### 3. کارایی تخفیف (Discount Efficiency)
```
کارایی تخفیف = درآمد کل / تخفیف داده شده
```

### 4. درصد صرفه‌جویی (Savings Percentage)
```
درصد صرفه‌جویی = (تخفیف داده شده / مبلغ اصلی) × 100
```

## Aggregation Pipelines

### Pipeline گزارش استفاده
```javascript
[
  // فیلتر تراکنش‌های تخفیف سازمانی
  {
    $match: {
      isInstitutionalDiscount: true,
      status: 'COMPLETED',
      // سایر فیلترها
    }
  },
  
  // گروه‌بندی بر اساس گروه تخفیف
  {
    $group: {
      _id: {
        groupId: '$institutionalDiscountGroupId',
        institutionId: '$institutionId'
      },
      usageCount: { $sum: 1 },
      totalDiscountAmount: { $sum: '$discountAmount' },
      totalOriginalAmount: { $sum: '$originalAmount' },
      totalPaidAmount: { $sum: '$amount' },
      uniqueUsers: { $addToSet: '$userId' },
      avgDiscountPercentage: { $avg: '$discountPercentage' }
    }
  },
  
  // محاسبه فیلدهای اضافی
  {
    $addFields: {
      uniqueUsersCount: { $size: '$uniqueUsers' },
      savingsPercentage: {
        $multiply: [
          { $divide: ['$totalDiscountAmount', '$totalOriginalAmount'] },
          100
        ]
      }
    }
  },
  
  // Join با جداول مرتبط
  {
    $lookup: {
      from: 'institutionaldiscountgroups',
      localField: '_id.groupId',
      foreignField: '_id',
      as: 'groupInfo'
    }
  }
]
```

## بهینه‌سازی و Performance

### ایندکس‌های پایگاه داده
```javascript
// WalletTransaction indexes
WalletTransactionSchema.index({ userId: 1, createdAt: -1 });
WalletTransactionSchema.index({ type: 1, status: 1 });
WalletTransactionSchema.index({ institutionalDiscountGroupId: 1, status: 1 });
WalletTransactionSchema.index({ institutionId: 1, status: 1 });
WalletTransactionSchema.index({ isInstitutionalDiscount: 1, status: 1, createdAt: -1 });
WalletTransactionSchema.index({ createdAt: -1 });
```

### Caching Strategy
- **Dashboard Stats**: 10 دقیقه cache
- **گزارش‌ها**: 5 دقیقه cache
- **Auto-refresh**: هر 5 دقیقه برای dashboard stats

## نمونه استفاده

### فراخوانی گزارش استفاده
```typescript
const { data: usageReport, isLoading } = useUsageReport({
  startDate: '2025-01-01',
  endDate: '2025-01-31',
  groupId: 'specific-group-id',
  sortBy: 'conversionRate',
  sortOrder: 'desc',
  page: 1,
  limit: 20
});
```

### نمایش آمار داشبورد
```typescript
const { data: dashboardStats } = useDashboardStats();

return (
  <div>
    <h3>کل گروه‌های فعال: {dashboardStats?.totalActiveGroups}</h3>
    <h3>کل درآمد: {formatCurrency(dashboardStats?.totalRevenue)}</h3>
    <h3>میانگین نرخ تبدیل: {dashboardStats?.avgConversionRate}%</h3>
  </div>
);
```

## تست و کیفیت کد

### Unit Tests
- تست aggregation pipelines
- تست محاسبه متریک‌ها
- تست validation فیلترها

### Integration Tests
- تست API endpoints
- تست React hooks
- تست frontend components

### Performance Tests
- تست سرعت aggregation queries
- تست load testing برای حجم داده بالا
- تست memory usage

## نکات امنیتی

1. **Authentication**: تمام endpoint ها نیاز به token دارند
2. **Authorization**: فقط admin ها دسترسی دارند
3. **Input Validation**: تمام ورودی‌ها validate می‌شوند
4. **Rate Limiting**: محدودیت تعداد درخواست
5. **Data Privacy**: عدم نمایش اطلاعات حساس کاربران

## مستندات API کامل

برای جزئیات بیشتر در مورد تمام endpoint ها، به فایل `APIs-Complete-List.md` مراجعه کنید. 