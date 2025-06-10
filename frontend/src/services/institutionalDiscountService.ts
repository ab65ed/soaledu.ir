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
}; 