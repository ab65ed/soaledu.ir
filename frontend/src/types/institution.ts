/**
 * Institution Types
 * انواع داده‌های مربوط به موسسات
 */

// Interface for contact information
export interface IContactInfo {
  email: string;
  phone: string;
  address?: string;
  website?: string;
  contactPersonName?: string;
  contactPersonPhone?: string;
}

// Interface for default discount settings
export interface IDefaultDiscountSettings {
  defaultDiscountPercentage: number;
  maxDiscountPercentage: number;
  autoApplyDiscount: boolean;
  discountStartDate?: string;
  discountEndDate?: string;
}

// Interface for enrollment settings
export interface IEnrollmentSettings {
  enrollmentCode: string;
  maxCapacity?: number;
  currentCapacity: number;
  autoEnrollment: boolean;
  requireApproval: boolean;
  enrollmentStartDate?: string;
  enrollmentEndDate?: string;
}

// Main Institution interface
export interface IInstitution {
  _id: string;
  name: string;
  nameEn?: string;
  type: 'school' | 'university' | 'institute' | 'organization' | 'other';
  description?: string;
  contactInfo: IContactInfo;
  defaultDiscountSettings: IDefaultDiscountSettings;
  enrollmentSettings: IEnrollmentSettings;
  isActive: boolean;
  establishedYear?: number;
  studentCount?: number;
  logo?: string;
  features: string[];
  contractStartDate?: string;
  contractEndDate?: string;
  contractTerms?: string;
  notes?: string;
  createdBy: string;
  lastModifiedBy?: string;
  createdAt: string;
  updatedAt: string;
  totalStudents?: number;
  activeStudents?: number;
}

// Institution form data
export interface InstitutionFormData {
  name: string;
  nameEn?: string;
  type: 'school' | 'university' | 'institute' | 'organization' | 'other';
  description?: string;
  contactInfo: IContactInfo;
  defaultDiscountSettings: IDefaultDiscountSettings;
  enrollmentSettings: Omit<IEnrollmentSettings, 'enrollmentCode' | 'currentCapacity'>;
  establishedYear?: number;
  logo?: string;
  features: string[];
  contractStartDate?: string;
  contractEndDate?: string;
  contractTerms?: string;
  notes?: string;
}

// Filters for institution list
export interface InstitutionFilters {
  page?: number;
  limit?: number;
  search?: string;
  type?: 'school' | 'university' | 'institute' | 'organization' | 'other';
  isActive?: boolean;
  contractStatus?: 'active' | 'expired' | 'expiring_soon';
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Response from API
export interface InstitutionsResponse {
  success: boolean;
  data: {
    institutions: IInstitution[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}

export interface InstitutionResponse {
  success: boolean;
  data: IInstitution;
}

// Institution stats
export interface InstitutionStats {
  totalInstitutions: number;
  activeInstitutions: number;
  inactiveInstitutions: number;
  totalStudents: number;
  activeStudents: number;
  contractsExpiring: number;
  byType: {
    school: number;
    university: number;
    institute: number;
    organization: number;
    other: number;
  };
  recentInstitutions: IInstitution[];
}

export interface InstitutionStatsResponse {
  success: boolean;
  data: InstitutionStats;
} 