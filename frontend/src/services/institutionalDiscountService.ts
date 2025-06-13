/**
 * Service for Institutional Discount API calls
 * سرویس تماس با API سیستم تخفیف سازمانی
 */

import {
  InstitutionalDiscountGroupsResponse,
  InstitutionalDiscountGroupResponse,
  UploadDiscountFileRequest,
  UploadDiscountFileResponse,
  DeleteDiscountGroupResponse,
  DiscountGroupFilters,
  UsageReportResponse,
  RevenueReportResponse,
  ConversionReportResponse,
  ComparisonReportResponse,
  DashboardStats,
  ReportFilters,
} from '@/types/institutionalDiscount';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const INSTITUTIONAL_DISCOUNT_BASE = `${BASE_URL}/admin/institutional-discounts`;

// Helper function for making authenticated requests
async function makeRequest<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('token');
  
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    defaultHeaders.Authorization = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: 'خطای ناشناخته رخ داد'
    }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

export const institutionalDiscountService = {
  /**
   * بارگذاری فایل اکسل تخفیف‌های سازمانی
   */
  async uploadDiscountFile(data: UploadDiscountFileRequest): Promise<UploadDiscountFileResponse> {
    const formData = new FormData();
    formData.append('file', data.file);
    
    if (data.groupName) {
      formData.append('groupName', data.groupName);
    }
    
    if (data.discountPercentage) {
      formData.append('discountPercentage', data.discountPercentage.toString());
    }
    
    if (data.discountAmount) {
      formData.append('discountAmount', data.discountAmount.toString());
    }

    const token = localStorage.getItem('token');
    const response = await fetch(`${INSTITUTIONAL_DISCOUNT_BASE}/upload`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: 'خطا در بارگذاری فایل'
      }));
      throw new Error(error.message || 'خطا در بارگذاری فایل');
    }

    return response.json();
  },

  /**
   * دریافت لیست گروه‌های تخفیف سازمانی
   */
  async getDiscountGroups(filters: DiscountGroupFilters = {}): Promise<InstitutionalDiscountGroupsResponse> {
    const queryParams = new URLSearchParams();
    
    if (filters.page) {
      queryParams.append('page', filters.page.toString());
    }
    
    if (filters.limit) {
      queryParams.append('limit', filters.limit.toString());
    }
    
    if (filters.status) {
      queryParams.append('status', filters.status);
    }

    const url = `${INSTITUTIONAL_DISCOUNT_BASE}/groups${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    return makeRequest<InstitutionalDiscountGroupsResponse>(url);
  },

  /**
   * دریافت جزئیات یک گروه تخفیف
   */
  async getDiscountGroupById(id: string): Promise<InstitutionalDiscountGroupResponse> {
    return makeRequest<InstitutionalDiscountGroupResponse>(
      `${INSTITUTIONAL_DISCOUNT_BASE}/groups/${id}`
    );
  },

  /**
   * حذف (غیرفعال کردن) گروه تخفیف
   */
  async deleteDiscountGroup(id: string): Promise<DeleteDiscountGroupResponse> {
    return makeRequest<DeleteDiscountGroupResponse>(
      `${INSTITUTIONAL_DISCOUNT_BASE}/groups/${id}`,
      {
        method: 'DELETE',
      }
    );
  },

  /**
   * دریافت آمار کلی تخفیف‌های سازمانی
   */
  async getDiscountStats(): Promise<{
    success: boolean;
    data: {
      totalGroups: number;
      activeGroups: number;
      totalDiscountedUsers: number;
      processingGroups: number;
      failedGroups: number;
    };
  }> {
    return makeRequest(`${INSTITUTIONAL_DISCOUNT_BASE}/stats`);
  },

  /**
   * دانلود نمونه فایل اکسل
   */
  async downloadSampleFile(): Promise<Blob> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${INSTITUTIONAL_DISCOUNT_BASE}/sample-file`, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      throw new Error('خطا در دانلود فایل نمونه');
    }

    return response.blob();
  },

  /**
   * دریافت گزارش استفاده از تخفیف‌های سازمانی
   */
  async getUsageReport(filters: ReportFilters): Promise<UsageReportResponse> {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    const response = await fetch(`${BASE_URL}/institutional-discounts/reports/usage?${queryParams}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'خطا در دریافت گزارش استفاده');
    }

    return response.json();
  },

  /**
   * دریافت گزارش درآمد از تخفیف‌های سازمانی
   */
  async getRevenueReport(filters: ReportFilters): Promise<RevenueReportResponse> {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    const response = await fetch(`${BASE_URL}/institutional-discounts/reports/revenue?${queryParams}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'خطا در دریافت گزارش درآمد');
    }

    return response.json();
  },

  /**
   * دریافت گزارش نرخ تبدیل
   */
  async getConversionReport(filters: ReportFilters): Promise<ConversionReportResponse> {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    const response = await fetch(`${BASE_URL}/institutional-discounts/reports/conversion?${queryParams}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'خطا در دریافت گزارش نرخ تبدیل');
    }

    return response.json();
  },

  /**
   * دریافت گزارش مقایسه‌ای گروه‌های تخفیف
   */
  async getComparisonReport(filters: ReportFilters): Promise<ComparisonReportResponse> {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    const response = await fetch(`${BASE_URL}/institutional-discounts/reports/comparison?${queryParams}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'خطا در دریافت گزارش مقایسه‌ای');
    }

    return response.json();
  },

  /**
   * دریافت آمار کلی داشبورد
   */
  async getDashboardStats(): Promise<DashboardStats> {
    const [, conversionReport, comparisonReport] = await Promise.all([
      this.getUsageReport({ limit: 1, sortBy: 'usageCount', sortOrder: 'desc' }),
      this.getConversionReport({}),
      this.getComparisonReport({ metric: 'revenue', limit: 1 })
    ]);

    return {
      totalActiveGroups: conversionReport.data.summary.totalGroups,
      totalEligibleUsers: conversionReport.data.summary.totalEligibleUsers,
      totalActiveUsers: conversionReport.data.summary.totalActiveUsers,
      totalRevenue: comparisonReport.data.summary.totalRevenue,
      totalDiscountGiven: comparisonReport.data.summary.totalDiscountGiven,
      avgConversionRate: conversionReport.data.summary.avgConversionRate,
      topPerformingGroup: comparisonReport.data.summary.topPerformer
    };
  }
}; 