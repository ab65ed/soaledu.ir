/**
 * Metadata Types
 * انواع داده‌های متادیتا
 */

export interface CourseType {
  value: string;
  label: string;
  description: string;
  examples: string;
  usage: string;
  isActive: boolean;
}

export interface Grade {
  value: string;
  label: string;
  description: string;
  ageRange: string;
  duration: string;
  nextLevel: string;
  category: 'school-levels' | 'university-levels';
  isActive: boolean;
}

export interface FieldOfStudy {
  value: string;
  label: string;
  category: 'high-school' | 'engineering' | 'basic-science' | 'humanities' | 'medical' | 'art' | 'agriculture' | 'other';
  categoryLabel: string;
  categoryDescription: string;
  isActive: boolean;
}

export interface CourseCategory {
  value: 'academic' | 'specialized' | 'general';
  label: string;
}

// API Response Types
export interface CourseTypesResponse {
  success: boolean;
  message: string;
  data: {
    courseTypes: CourseType[];
    total: number;
  };
}

export interface GradesResponse {
  success: boolean;
  message: string;
  data: {
    grades: Grade[];
    total: number;
  };
}

export interface FieldsOfStudyResponse {
  success: boolean;
  message: string;
  data: {
    fields: FieldOfStudy[];
    total: number;
  };
} 