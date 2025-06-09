# مستندات سیستم نقش‌ها (Roles System Documentation)

## فهرست مطالب

1. [معرفی کلی](#معرفی-کلی)
2. [ساختار نقش‌ها](#ساختار-نقش‌ها)
3. [مجوزها و دسترسی‌ها](#مجوزها-و-دسترسی‌ها)
4. [کامپوننت‌های UI](#کامپوننت‌های-ui)
5. [سرویس‌ها و API](#سرویس‌ها-و-api)
6. [مدیریت کیف پول](#مدیریت-کیف-پول)
7. [جستجوی پیشرفته](#جستجوی-پیشرفته)
8. [لاگ فعالیت‌ها](#لاگ-فعالیت‌ها)
9. [تست‌ها](#تست‌ها)
10. [راهنمای توسعه](#راهنمای-توسعه)

## معرفی کلی

سیستم نقش‌ها (Roles System) یک سیستم کنترل دسترسی مبتنی بر نقش (RBAC) است که امکان مدیریت کاربران، مجوزها، و دسترسی‌ها را در پلتفرم آموزشی فراهم می‌کند.

### ویژگی‌های کلیدی:
- ✅ کنترل دسترسی مبتنی بر نقش
- ✅ داشبورد اختصاصی برای هر نقش
- ✅ مدیریت کیف پول و تراکنش‌ها
- ✅ جستجوی پیشرفته در سیستم
- ✅ لاگ فعالیت‌های کاربران
- ✅ پشتیبانی کامل از RTL و فارسی
- ✅ طراحی ریسپانسیو
- ✅ تست‌های کامل Jest و Cypress

## ساختار نقش‌ها

### نقش‌های تعریف شده:

#### 1. مدیر سیستم (ADMIN)
```typescript
role: UserRole.ADMIN
displayName: "مدیر سیستم"
permissions: [
  Permission.MANAGE_SYSTEM,
  Permission.MANAGE_USERS,
  Permission.MANAGE_PAYMENTS,
  Permission.VIEW_ANALYTICS,
  Permission.MANAGE_CONTENT,
  Permission.VIEW_LOGS
]
```

**دسترسی‌ها:**
- مدیریت کامل سیستم
- مدیریت کاربران و نقش‌ها
- مدیریت مالی و پرداخت‌ها
- مشاهده آمار و گزارش‌ها
- مدیریت محتوا
- مشاهده لاگ فعالیت‌ها

#### 2. طراح محتوا (DESIGNER)
```typescript
role: UserRole.DESIGNER
displayName: "طراح محتوا"
permissions: [
  Permission.CREATE_CONTENT,
  Permission.EDIT_CONTENT,
  Permission.VIEW_ANALYTICS,
  Permission.MANAGE_OWN_CONTENT
]
```

**دسترسی‌ها:**
- ایجاد و ویرایش محتوا
- مدیریت محتوای شخصی
- مشاهده آمار محتوا
- دریافت درآمد از محتوا

#### 3. دانشجو (STUDENT)
```typescript
role: UserRole.STUDENT
displayName: "دانشجو"
permissions: [
  Permission.TAKE_EXAMS,
  Permission.VIEW_RESULTS,
  Permission.ACCESS_CONTENT,
  Permission.MANAGE_PROFILE
]
```

**دسترسی‌ها:**
- شرکت در آزمون‌ها
- مشاهده نتایج
- دسترسی به محتوا
- مدیریت پروفایل شخصی

#### 4. کارشناس (EXPERT)
```typescript
role: UserRole.EXPERT
displayName: "کارشناس"
permissions: [
  Permission.REVIEW_CONTENT,
  Permission.APPROVE_CONTENT,
  Permission.VIEW_ANALYTICS,
  Permission.PROVIDE_FEEDBACK
]
```

**دسترسی‌ها:**
- بررسی و تایید محتوا
- ارائه بازخورد
- مشاهده آمار کیفیت

#### 5. پشتیبانی (SUPPORT)
```typescript
role: UserRole.SUPPORT
displayName: "پشتیبانی"
permissions: [
  Permission.VIEW_USER_ISSUES,
  Permission.RESPOND_TO_TICKETS,
  Permission.VIEW_USER_PROFILES,
  Permission.BASIC_USER_MANAGEMENT
]
```

**دسترسی‌ها:**
- مشاهده مشکلات کاربران
- پاسخ به تیکت‌ها
- مشاهده پروفایل کاربران
- مدیریت محدود کاربران

## مجوزها و دسترسی‌ها

### لیست کامل مجوزها:

```typescript
enum Permission {
  // مجوزهای سیستم
  MANAGE_SYSTEM = 'manage_system',
  VIEW_LOGS = 'view_logs',
  MANAGE_SETTINGS = 'manage_settings',
  
  // مجوزهای کاربران
  MANAGE_USERS = 'manage_users',
  VIEW_USER_PROFILES = 'view_user_profiles',
  BASIC_USER_MANAGEMENT = 'basic_user_management',
  
  // مجوزهای محتوا
  CREATE_CONTENT = 'create_content',
  EDIT_CONTENT = 'edit_content',
  DELETE_CONTENT = 'delete_content',
  MANAGE_OWN_CONTENT = 'manage_own_content',
  REVIEW_CONTENT = 'review_content',
  APPROVE_CONTENT = 'approve_content',
  
  // مجوزهای آزمون
  TAKE_EXAMS = 'take_exams',
  CREATE_EXAMS = 'create_exams',
  GRADE_EXAMS = 'grade_exams',
  
  // مجوزهای مالی
  MANAGE_PAYMENTS = 'manage_payments',
  VIEW_FINANCIAL_REPORTS = 'view_financial_reports',
  PROCESS_REFUNDS = 'process_refunds',
  
  // مجوزهای آمار
  VIEW_ANALYTICS = 'view_analytics',
  EXPORT_DATA = 'export_data',
  
  // مجوزهای عمومی
  VIEW_RESULTS = 'view_results',
  ACCESS_CONTENT = 'access_content',
  MANAGE_PROFILE = 'manage_profile',
  PROVIDE_FEEDBACK = 'provide_feedback',
  VIEW_USER_ISSUES = 'view_user_issues',
  RESPOND_TO_TICKETS = 'respond_to_tickets'
}
```

### توابع کمکی مجوزها:

```typescript
// بررسی داشتن مجوز خاص
function hasPermission(userPermissions: Permission[], permission: Permission): boolean

// بررسی داشتن حداقل یکی از مجوزها
function hasAnyPermission(userPermissions: Permission[], permissions: Permission[]): boolean

// بررسی داشتن همه مجوزها
function hasAllPermissions(userPermissions: Permission[], permissions: Permission[]): boolean

// دریافت نام نمایشی نقش
function getRoleDisplayName(role: UserRole): string

// دریافت رنگ نقش
function getRoleColor(role: UserRole): string
```

## کامپوننت‌های UI

### 1. RoleBasedDashboard
داشبورد اصلی که بر اساس نقش کاربر محتوای مختلف نمایش می‌دهد.

```typescript
interface RoleBasedDashboardProps {
  className?: string;
}

// استفاده:
<RoleBasedDashboard />
```

**ویژگی‌ها:**
- تشخیص خودکار نقش کاربر
- نمایش داشبورد مناسب
- مدیریت حالت‌های loading و error
- پشتیبانی از React.memo برای بهینه‌سازی

### 2. AdminDashboard
داشبورد مخصوص مدیران سیستم.

```typescript
interface AdminDashboardProps {
  stats: AdminStats;
  onRefresh?: () => void;
}

// استفاده:
<AdminDashboard stats={adminStats} onRefresh={handleRefresh} />
```

**ویژگی‌ها:**
- نمایش آمار کلی سیستم
- دسترسی سریع به ماژول‌های مدیریتی
- نمایش فعالیت‌های اخیر
- کارت‌های آماری تعاملی

### 3. DesignerDashboard
داشبورد مخصوص طراحان محتوا.

```typescript
interface DesignerDashboardProps {
  stats: DesignerStats;
  onCreateContent?: () => void;
}

// استفاده:
<DesignerDashboard stats={designerStats} onCreateContent={handleCreate} />
```

**ویژگی‌ها:**
- نمایش آمار محتوای ایجاد شده
- مدیریت درآمد
- دسترسی به ابزارهای طراحی
- نمایش وضعیت بررسی محتوا

### 4. StudentDashboard
داشبورد مخصوص دانشجویان.

```typescript
interface StudentDashboardProps {
  stats: StudentStats;
  onTakeExam?: () => void;
}

// استفاده:
<StudentDashboard stats={studentStats} onTakeExam={handleTakeExam} />
```

**ویژگی‌ها:**
- نمایش پیشرفت تحصیلی
- دسترسی به آزمون‌ها
- مشاهده نتایج
- برنامه مطالعه شخصی

### 5. ActivityLogViewer
نمایش و فیلتر لاگ فعالیت‌های سیستم.

```typescript
interface ActivityLogViewerProps {
  className?: string;
  showFilters?: boolean;
}

// استفاده:
<ActivityLogViewer showFilters={true} />
```

**ویژگی‌ها:**
- فیلتر بر اساس نقش، نوع فعالیت، تاریخ
- صفحه‌بندی
- جستجو در توضیحات
- صادرات داده‌ها

### 6. WalletChargeManager
مدیریت شارژ و کسر کیف پول کاربران.

```typescript
interface WalletChargeManagerProps {
  className?: string;
  onTransactionComplete?: (transaction: WalletTransaction) => void;
}

// استفاده:
<WalletChargeManager onTransactionComplete={handleComplete} />
```

**ویژگی‌ها:**
- نمایش آمار کیف پول
- شارژ و کسر موجودی
- تاریخچه تراکنش‌ها
- فیلتر و جستجو در تراکنش‌ها

### 7. AdvancedSearchPanel
جستجوی پیشرفته در سیستم.

```typescript
interface AdvancedSearchPanelProps {
  className?: string;
  onResultSelect?: (result: SearchResult) => void;
}

// استفاده:
<AdvancedSearchPanel onResultSelect={handleSelect} />
```

**ویژگی‌ها:**
- جستجو در دسته‌بندی‌های مختلف
- فیلترهای پیشرفته
- نتایج تعاملی
- ذخیره جستجوهای محبوب

## سرویس‌ها و API

### 1. rolesService
سرویس اصلی مدیریت نقش‌ها.

```typescript
class RolesService {
  // دریافت نقش و مجوزهای کاربر
  async getUserRoles(): Promise<UserRoleData>
  
  // دریافت آمار داشبورد
  async getDashboardStats(role: UserRole): Promise<DashboardStats>
  
  // دریافت لاگ فعالیت‌ها
  async getActivityLogs(params: ActivityLogParams): Promise<ActivityLogResponse>
  
  // تغییر نقش کاربر
  async changeUserRole(userId: string, newRole: UserRole): Promise<void>
  
  // مدیریت مجوزها
  async updateUserPermissions(userId: string, permissions: Permission[]): Promise<void>
}
```

### 2. walletService
سرویس مدیریت کیف پول.

```typescript
class WalletService {
  // دریافت آمار کیف پول
  async getWalletStats(): Promise<WalletStats>
  
  // دریافت تراکنش‌ها
  async getWalletTransactions(params: TransactionParams): Promise<TransactionResponse>
  
  // شارژ کیف پول
  async chargeWallet(request: ChargeRequest): Promise<WalletTransaction>
  
  // کسر از کیف پول
  async deductFromWallet(request: DeductRequest): Promise<WalletTransaction>
  
  // اعتبارسنجی درخواست
  validateChargeRequest(request: ChargeRequest): string[]
  
  // فرمت کردن ارز
  formatCurrency(amount: number): string
}
```

### 3. searchService
سرویس جستجوی پیشرفته.

```typescript
class SearchService {
  // جستجوی عمومی
  async search(query: string, category?: SearchCategory): Promise<SearchResponse>
  
  // جستجو با فیلتر
  async searchWithFilters(params: SearchParams): Promise<SearchResponse>
  
  // دریافت پیشنهادات
  async getSuggestions(query: string): Promise<string[]>
  
  // ذخیره جستجو
  async saveSearch(query: string, filters: SearchFilters): Promise<void>
}
```

## مدیریت کیف پول

### ویژگی‌ها:
- ✅ شارژ و کسر موجودی
- ✅ تاریخچه کامل تراکنش‌ها
- ✅ آمار مالی
- ✅ فیلتر و جستجو
- ✅ صادرات گزارش‌ها

### نوع‌های تراکنش:

```typescript
enum TransactionType {
  CHARGE = 'charge',      // شارژ
  DEDUCT = 'deduct',      // کسر
  PURCHASE = 'purchase',  // خرید
  REFUND = 'refund',      // بازگشت وجه
  BONUS = 'bonus',        // جایزه
  PENALTY = 'penalty'     // جریمه
}

enum TransactionStatus {
  PENDING = 'pending',       // در انتظار
  COMPLETED = 'completed',   // تکمیل شده
  FAILED = 'failed',         // ناموفق
  CANCELLED = 'cancelled'    // لغو شده
}
```

### مثال استفاده:

```typescript
// شارژ کیف پول
const chargeRequest: ChargeRequest = {
  userId: 'user123',
  amount: 100000,
  description: 'شارژ حساب کاربر',
  type: TransactionType.CHARGE
};

const transaction = await walletService.chargeWallet(chargeRequest);

// کسر از کیف پول
const deductRequest: DeductRequest = {
  userId: 'user123',
  amount: 50000,
  description: 'خرید آزمون',
  type: TransactionType.PURCHASE
};

const deduction = await walletService.deductFromWallet(deductRequest);
```

## جستجوی پیشرفته

### دسته‌بندی‌های جستجو:

```typescript
enum SearchCategory {
  ALL = 'all',                    // همه موارد
  USERS = 'users',               // کاربران
  QUESTIONS = 'questions',       // سوالات
  EXAMS = 'exams',              // آزمون‌ها
  FLASHCARDS = 'flashcards',    // فلش‌کارت‌ها
  TRANSACTIONS = 'transactions', // تراکنش‌ها
  CONTENT = 'content'           // محتوا
}
```

### فیلترهای هر دسته:

#### کاربران:
- نقش کاربر
- وضعیت فعالیت
- تاریخ عضویت
- منطقه جغرافیایی

#### سوالات:
- سطح دشواری
- دسته‌بندی موضوعی
- نوع سوال
- وضعیت تایید

#### آزمون‌ها:
- نوع آزمون
- تاریخ برگزاری
- سطح دشواری
- تعداد شرکت‌کنندگان

### مثال استفاده:

```typescript
// جستجوی ساده
const results = await searchService.search('ریاضی', SearchCategory.QUESTIONS);

// جستجوی پیشرفته
const advancedResults = await searchService.searchWithFilters({
  query: 'ریاضی',
  category: SearchCategory.QUESTIONS,
  filters: {
    difficulty: 'medium',
    subject: 'algebra',
    approved: true
  },
  page: 1,
  limit: 20
});
```

## لاگ فعالیت‌ها

### نوع‌های فعالیت:

```typescript
enum ActivityType {
  LOGIN = 'login',                    // ورود
  LOGOUT = 'logout',                  // خروج
  CREATE = 'create',                  // ایجاد
  UPDATE = 'update',                  // به‌روزرسانی
  DELETE = 'delete',                  // حذف
  VIEW = 'view',                      // مشاهده
  DOWNLOAD = 'download',              // دانلود
  UPLOAD = 'upload',                  // آپلود
  PURCHASE = 'purchase',              // خرید
  PAYMENT = 'payment',                // پرداخت
  EXAM_START = 'exam_start',          // شروع آزمون
  EXAM_SUBMIT = 'exam_submit',        // ارسال آزمون
  CONTENT_APPROVE = 'content_approve', // تایید محتوا
  CONTENT_REJECT = 'content_reject'   // رد محتوا
}
```

### منابع قابل ردیابی:

```typescript
enum ResourceType {
  USER = 'user',           // کاربر
  QUESTION = 'question',   // سوال
  EXAM = 'exam',          // آزمون
  FLASHCARD = 'flashcard', // فلش‌کارت
  PAYMENT = 'payment',     // پرداخت
  CONTENT = 'content',     // محتوا
  SYSTEM = 'system'        // سیستم
}
```

### مثال ثبت فعالیت:

```typescript
const activity: ActivityLog = {
  userId: 'user123',
  userRole: UserRole.STUDENT,
  activityType: ActivityType.EXAM_START,
  resourceType: ResourceType.EXAM,
  resourceId: 'exam456',
  description: 'دانشجو آزمون ریاضی را شروع کرد',
  metadata: {
    examTitle: 'آزمون ریاضی پایه دهم',
    duration: 90
  }
};

await rolesService.logActivity(activity);
```

## تست‌ها

### تست‌های Jest

#### تست کامپوننت‌ها:
```bash
npm test -- --testPathPattern=roles.test.tsx
```

#### تست سرویس‌ها:
```bash
npm test -- --testPathPattern=services
```

#### تست کامل:
```bash
npm test
```

### تست‌های Cypress

#### اجرای تست‌های E2E:
```bash
npx cypress run --spec "src/__tests__/e2e/roles.cy.ts"
```

#### اجرای تعاملی:
```bash
npx cypress open
```

### پوشش تست:
```bash
npm run test:coverage
```

## راهنمای توسعه

### اضافه کردن نقش جدید:

1. **تعریف نقش در types/roles.ts:**
```typescript
enum UserRole {
  // ... نقش‌های موجود
  NEW_ROLE = 'new_role'
}
```

2. **اضافه کردن مجوزها:**
```typescript
const rolePermissions: Record<UserRole, Permission[]> = {
  // ... نقش‌های موجود
  [UserRole.NEW_ROLE]: [
    Permission.SPECIFIC_PERMISSION_1,
    Permission.SPECIFIC_PERMISSION_2
  ]
};
```

3. **ایجاد داشبورد اختصاصی:**
```typescript
const NewRoleDashboard: React.FC<NewRoleDashboardProps> = ({ stats }) => {
  return (
    <div className="space-y-6">
      {/* محتوای داشبورد */}
    </div>
  );
};
```

4. **اضافه کردن به RoleBasedDashboard:**
```typescript
const renderDashboard = () => {
  switch (userRole?.role) {
    // ... حالت‌های موجود
    case UserRole.NEW_ROLE:
      return <NewRoleDashboard stats={dashboardStats} />;
  }
};
```

### اضافه کردن مجوز جدید:

1. **تعریف در enum:**
```typescript
enum Permission {
  // ... مجوزهای موجود
  NEW_PERMISSION = 'new_permission'
}
```

2. **اضافه کردن به نقش‌های مربوطه:**
```typescript
const rolePermissions: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: [
    // ... مجوزهای موجود
    Permission.NEW_PERMISSION
  ]
};
```

3. **استفاده در کامپوننت‌ها:**
```typescript
const canDoSomething = hasPermission(userPermissions, Permission.NEW_PERMISSION);

if (canDoSomething) {
  // نمایش عملکرد مجاز
}
```

### بهینه‌سازی عملکرد:

1. **استفاده از React.memo:**
```typescript
export const MyComponent = React.memo<MyComponentProps>(({ prop1, prop2 }) => {
  // محتوای کامپوننت
});
```

2. **استفاده از useMemo و useCallback:**
```typescript
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);

const handleClick = useCallback(() => {
  // منطق کلیک
}, [dependency]);
```

3. **بهینه‌سازی React Query:**
```typescript
const { data, isLoading } = useQuery({
  queryKey: ['roles', userId],
  queryFn: () => rolesService.getUserRoles(),
  staleTime: 5 * 60 * 1000, // 5 دقیقه
  cacheTime: 10 * 60 * 1000, // 10 دقیقه
});
```

### رعایت اصول Clean Code:

1. **نام‌گذاری واضح:**
```typescript
// بد
const u = getUserData();

// خوب
const currentUser = getCurrentUserData();
```

2. **توابع کوچک و تک‌منظوره:**
```typescript
// بد
const processUserData = (user) => {
  // 50 خط کد مختلف
};

// خوب
const validateUser = (user) => { /* ... */ };
const formatUserData = (user) => { /* ... */ };
const saveUser = (user) => { /* ... */ };
```

3. **استفاده از TypeScript:**
```typescript
// تعریف واضح interface ها
interface UserRoleData {
  userId: string;
  role: UserRole;
  permissions: Permission[];
  displayName: string;
}
```

### مدیریت خطاها:

1. **Error Boundaries:**
```typescript
class RoleErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Role system error:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}
```

2. **مدیریت خطاهای API:**
```typescript
const { data, error, isLoading } = useQuery({
  queryKey: ['roles'],
  queryFn: rolesService.getUserRoles,
  onError: (error) => {
    toast.error('خطا در بارگذاری اطلاعات کاربر');
    console.error('Roles API error:', error);
  }
});
```

## نتیجه‌گیری

سیستم نقش‌ها یک راه‌حل کامل و مقیاس‌پذیر برای مدیریت دسترسی‌ها در پلتفرم آموزشی است. با رعایت اصول SOLID، Clean Code، و استفاده از تکنولوژی‌های مدرن، این سیستم قابلیت توسعه و نگهداری بالایی دارد.

### نکات مهم:
- همیشه از TypeScript برای type safety استفاده کنید
- تست‌های کامل برای هر ویژگی بنویسید
- عملکرد را با React.memo و useMemo بهینه کنید
- از React Query برای مدیریت state سرور استفاده کنید
- کد را clean و قابل خواندن نگه دارید
- مستندات را به‌روز نگه دارید

برای سوالات بیشتر یا گزارش مشکلات، لطفاً با تیم توسعه تماس بگیرید. 