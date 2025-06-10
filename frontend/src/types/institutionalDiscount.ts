/**
 * Types for Institutional Discount System
 * انواع داده‌های سیستم تخفیف سازمانی
 */

export interface InstitutionalDiscountGroup {
  _id: string;
  groupName?: string;
  discountPercentage?: number;
  discountAmount?: number;
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
}

// آمار کلی
export interface DiscountStats {
  totalGroups: number;
  activeGroups: number;
  totalDiscountedUsers: number;
  processingGroups: number;
  failedGroups: number;
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