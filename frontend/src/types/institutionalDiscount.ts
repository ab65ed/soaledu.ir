/**
 * Types for Institutional Discount System
 * انواع داده‌های سیستم تخفیف سازمانی
 */

// Interface for Tiered Discount (تخفیف پلکانی)
export interface TieredDiscount {
  count: number; // تعداد کاربران
  discountPercentage?: number; // درصد تخفیف
  discountAmount?: number; // مبلغ ثابت تخفیف
}

export interface InstitutionalDiscountGroup {
  _id: string;
  groupName?: string;
  discountPercentage?: number;
  discountAmount?: number;
  
  // فیلدهای جدید برای تخفیف‌های زمان‌دار
  startDate?: string; // تاریخ شروع اعتبار تخفیف
  endDate?: string; // تاریخ پایان اعتبار تخفیف
  
  // فیلد جدید برای تخفیف‌های پلکانی
  tiers?: TieredDiscount[]; // آرایه تخفیف‌های پلکانی
  
  uploadedBy: {
    _id: string;
    name: string;
    email: string;
  };
  uploadDate: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  totalUsersInFile: number;
  matchedUsersCount: number;
  unmatchedUsersCount: number;
  invalidDataCount: number;
  errorLog: string[];
  fileName?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  
  // Virtual fields
  isTimeValid?: boolean; // آیا تخفیف از نظر زمانی معتبر است
}

export interface InstitutionalDiscountGroupsResponse {
  success: boolean;
  data: {
    groups: InstitutionalDiscountGroup[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  };
}

export interface InstitutionalDiscountGroupResponse {
  success: boolean;
  data: InstitutionalDiscountGroup;
}

export interface UploadDiscountFileRequest {
  file: File;
  groupName?: string;
  discountPercentage?: number;
  discountAmount?: number;
  
  // فیلدهای جدید برای تخفیف‌های زمان‌دار
  startDate?: Date;
  endDate?: Date;
  
  // فیلد جدید برای تخفیف‌های پلکانی
  tiers?: TieredDiscount[];
}

export interface UploadDiscountFileResponse {
  success: boolean;
  message: string;
  data: {
    groupId: string;
    status: string;
    fileName: string;
  };
}

export interface DeleteDiscountGroupResponse {
  success: boolean;
  message: string;
}

// فیلتر جستجو
export interface DiscountGroupFilters {
  page?: number;
  limit?: number;
  status?: 'pending' | 'processing' | 'completed' | 'failed';
  // فیلترهای جدید برای تخفیف‌های زمان‌دار
  activeOnly?: boolean; // فقط تخفیف‌های فعال از نظر زمانی
  expiredOnly?: boolean; // فقط تخفیف‌های منقضی شده
}

// آمار کلی
export interface DiscountStats {
  totalGroups: number;
  activeGroups: number;
  totalDiscountedUsers: number;
  processingGroups: number;
  failedGroups: number;
  // آمار جدید برای تخفیف‌های زمان‌دار
  expiredGroups: number;
  scheduledGroups: number; // تخفیف‌هایی که هنوز شروع نشده‌اند
  tieredGroups: number; // تعداد گروه‌های با تخفیف پلکانی
}

// نوع داده‌های اکسل
export interface ExcelRowData {
  nationalCode?: string;
  phoneNumber?: string;
  rowIndex: number;
}

// نتیجه پردازش
export interface ProcessingResult {
  totalRows: number;
  matchedUsers: number;
  unmatchedRows: number;
  invalidRows: number;
  errors: string[];
}

// فرم اضافه کردن تخفیف پلکانی
export interface TieredDiscountFormData {
  count: number;
  discountType: 'percentage' | 'amount';
  discountPercentage?: number;
  discountAmount?: number;
}

// نوع تخفیف
export type DiscountType = 'simple' | 'tiered';

// وضعیت زمانی تخفیف
export type TimeStatus = 'not_started' | 'active' | 'expired' | 'no_time_limit';

// =================== Types مربوط به گزارش‌گیری پیشرفته ===================

export interface UsageReportItem {
  groupId: string;
  institutionId?: string;
  groupName?: string;
  institutionName?: string;
  usageCount: number;
  uniqueUsersCount: number;
  totalDiscountAmount: number;
  totalOriginalAmount: number;
  totalPaidAmount: number;
  avgDiscountPercentage: number;
  savingsPercentage: number;
  conversionRate: number;
}

export interface UsageReportResponse {
  success: boolean;
  data: {
    reports: UsageReportItem[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  };
  message: string;
}

export interface RevenueReportPeriod {
  _id: {
    year: number;
    month?: number;
    week?: number;
    day?: number;
  };
  totalRevenue: number;
  totalDiscountGiven: number;
  totalOriginalAmount: number;
  transactionCount: number;
  uniqueUsersCount: number;
  avgTransactionAmount: number;
  discountRate: number;
  revenuePerUser: number;
}

export interface RevenueReportResponse {
  success: boolean;
  data: {
    period: 'daily' | 'weekly' | 'monthly' | 'yearly';
    revenueData: RevenueReportPeriod[];
    summary: {
      totalPeriods: number;
      totalRevenue: number;
      totalDiscountGiven: number;
      totalTransactions: number;
      avgRevenuePerPeriod: number;
    };
  };
  message: string;
}

export interface ConversionReportItem {
  _id: string;
  groupName?: string;
  discountPercentage?: number;
  discountAmount?: number;
  totalEligibleUsers: number;
  totalTransactions: number;
  uniqueUsers: number;
  totalRevenue: number;
  totalDiscountGiven: number;
  conversionRate: number;
  avgTransactionsPerUser: number;
  avgRevenuePerUser: number;
}

export interface ConversionReportResponse {
  success: boolean;
  data: {
    conversionData: ConversionReportItem[];
    summary: {
      totalGroups: number;
      avgConversionRate: number;
      bestPerforming: ConversionReportItem | null;
      totalEligibleUsers: number;
      totalActiveUsers: number;
    };
  };
  message: string;
}

export interface ComparisonReportItem {
  _id: string;
  groupName?: string;
  discountPercentage?: number;
  discountAmount?: number;
  uploadDate: string;
  fileName?: string;
  totalEligibleUsers: number;
  totalTransactions: number;
  uniqueUsers: number;
  totalRevenue: number;
  totalDiscountGiven: number;
  totalOriginalAmount: number;
  conversionRate: number;
  avgRevenuePerUser: number;
  discountEfficiency: number; // نسبت درآمد به تخفیف داده شده
  roi: number; // بازده سرمایه‌گذاری
}

export interface ComparisonReportResponse {
  success: boolean;
  data: {
    comparisonData: ComparisonReportItem[];
    summary: {
      totalGroups: number;
      topPerformer: ComparisonReportItem | null;
      totalRevenue: number;
      totalDiscountGiven: number;
      avgConversionRate: number;
      totalEligibleUsers: number;
      totalActiveUsers: number;
    };
  };
  message: string;
}

// فیلترهای گزارش‌گیری
export interface ReportFilters {
  groupId?: string;
  institutionId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  period?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  metric?: 'revenue' | 'conversionRate' | 'usageCount' | 'discountEfficiency' | 'roi';
}

// آمار کلی داشبورد
export interface DashboardStats {
  totalActiveGroups: number;
  totalEligibleUsers: number;
  totalActiveUsers: number;
  totalRevenue: number;
  totalDiscountGiven: number;
  avgConversionRate: number;
  topPerformingGroup: ComparisonReportItem | null;
} 