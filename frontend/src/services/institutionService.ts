/**
 * Service for Institution API calls
 * سرویس تماس با API سیستم مدیریت موسسات
 */

import {
  IInstitution,
  InstitutionFormData,
  InstitutionFilters,
  InstitutionsResponse,
  InstitutionResponse,
  InstitutionStatsResponse,
} from '@/types/institution';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const INSTITUTIONS_BASE = `${BASE_URL}/institutions`;

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

export const institutionService = {
  /**
   * دریافت لیست موسسات با فیلتر
   */
  async getInstitutions(filters: InstitutionFilters): Promise<InstitutionsResponse> {
    const queryParams = new URLSearchParams();
    
    if (filters.page) queryParams.append('page', filters.page.toString());
    if (filters.limit) queryParams.append('limit', filters.limit.toString());
    if (filters.search) queryParams.append('search', filters.search);
    if (filters.type) queryParams.append('type', filters.type);
    if (filters.isActive !== undefined) queryParams.append('isActive', filters.isActive.toString());
    if (filters.contractStatus) queryParams.append('contractStatus', filters.contractStatus);
    if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
    if (filters.sortOrder) queryParams.append('sortOrder', filters.sortOrder);

    const url = `${INSTITUTIONS_BASE}?${queryParams.toString()}`;
    return makeRequest<InstitutionsResponse>(url);
  },

  /**
   * دریافت جزئیات یک موسسه
   */
  async getInstitutionById(id: string): Promise<InstitutionResponse> {
    return makeRequest<InstitutionResponse>(`${INSTITUTIONS_BASE}/${id}`);
  },

  /**
   * ایجاد موسسه جدید
   */
  async createInstitution(data: InstitutionFormData): Promise<InstitutionResponse> {
    return makeRequest<InstitutionResponse>(`${INSTITUTIONS_BASE}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * بروزرسانی موسسه
   */
  async updateInstitution(id: string, data: Partial<InstitutionFormData>): Promise<InstitutionResponse> {
    return makeRequest<InstitutionResponse>(`${INSTITUTIONS_BASE}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /**
   * حذف موسسه
   */
  async deleteInstitution(id: string): Promise<{ success: boolean; message: string }> {
    return makeRequest<{ success: boolean; message: string }>(`${INSTITUTIONS_BASE}/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * دریافت آمار کلی موسسات
   */
  async getInstitutionStats(): Promise<InstitutionStatsResponse> {
    return makeRequest<InstitutionStatsResponse>(`${INSTITUTIONS_BASE}/stats`);
  },

  /**
   * دریافت لیست دانش‌آموزان یک موسسه
   */
  async getInstitutionStudents(
    id: string, 
    page: number = 1, 
    limit: number = 20
  ): Promise<{
    success: boolean;
    data: {
      students: {
        _id: string;
        name: string;
        email: string;
        nationalCode: string;
        phoneNumber: string;
        institutionalDiscountPercentage?: number;
        institutionalDiscountAmount?: number;
        enrollmentCode?: string;
        createdAt: string;
      }[];
      pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
      };
      institution: {
        name: string;
        uniqueId: string;
      };
    };
  }> {
    const url = `${INSTITUTIONS_BASE}/${id}/students?page=${page}&limit=${limit}`;
    return makeRequest(url);
  },

  /**
   * یافتن موسسه با کد ثبت‌نام
   */
  async getInstitutionByEnrollmentCode(code: string): Promise<InstitutionResponse> {
    return makeRequest<InstitutionResponse>(`${INSTITUTIONS_BASE}/enrollment-code/${code}`);
  },

  /**
   * بازیابی موسسه (فعال کردن مجدد)
   */
  async restoreInstitution(id: string): Promise<{ success: boolean; message: string; data: IInstitution }> {
    return makeRequest<{ success: boolean; message: string; data: IInstitution }>(`${INSTITUTIONS_BASE}/${id}/restore`, {
      method: 'PATCH',
    });
  },
}; 