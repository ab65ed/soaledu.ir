// نوع‌ها و رابط‌های مورد نیاز برای سیستم سوال و آزمون

// رابط اختیارات کوئری برای مدل سوال
export interface QuestionOptions {
  limit?: number;
  skip?: number;
  sort?: string;
  sortBy?: string;
  publishedOnly?: boolean;
  authorId?: string;
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  search?: string;
  tags?: string[];
  include?: string[];
  type?: string;
}

// رابط اختیارات کوئری برای مدل آزمون تست
export interface TestExamOptions {
  limit?: number;
  skip?: number;
  status?: 'draft' | 'published' | 'archived';
  type?: 'practice' | 'final' | 'midterm' | 'quiz';
  search?: string;
  authorId?: string;
  grade?: string;
  subject?: string;
}

// رابط اختیارات کوئری برای مدل آزمون درس
export interface CourseExamOptions {
  limit?: number;
  skip?: number;
  sort?: string;
  sortBy?: string;
  authorId?: string;
  grade?: string;
  group?: string;
  isPublished?: boolean;
  difficulty?: 'easy' | 'medium' | 'hard';
  search?: string;
  category?: string;
  include?: string[];
  courseType?: string;
  publishedOnly?: boolean;
  tags?: string[];
  priceRange?: {
    min?: number;
    max?: number;
  };
}

// رابط اختیارات جستجو
export interface SearchOptions {
  limit?: number;
  skip?: number;
  sort?: string;
  search?: string;
  publishedOnly?: boolean;
}

// رابط درخواست احراز هویت شده
export interface AuthenticatedRequest {
  user?: any;
  userId?: string;
  userRole?: string;
  body?: any;
  params?: any;
  query?: any;
  headers?: any;
  method?: string;
  url?: string;
  path?: string;
}

// انواع اجازه‌ها
export enum Permission {
  // اجازه‌های کاربر
  VIEW_PROFILE = 'VIEW_PROFILE',
  EDIT_PROFILE = 'EDIT_PROFILE',
  
  // اجازه‌های سوال
  CREATE_QUESTION = 'CREATE_QUESTION',
  EDIT_QUESTION = 'EDIT_QUESTION',
  DELETE_QUESTION = 'DELETE_QUESTION',
  VIEW_QUESTION = 'VIEW_QUESTION',
  PUBLISH_QUESTION = 'PUBLISH_QUESTION',
  
  // اجازه‌های آزمون
  CREATE_EXAM = 'CREATE_EXAM',
  EDIT_EXAM = 'EDIT_EXAM',
  DELETE_EXAM = 'DELETE_EXAM',
  VIEW_EXAM = 'VIEW_EXAM',
  CONDUCT_EXAM = 'CONDUCT_EXAM',
  
  // اجازه‌های مالی
  VIEW_FINANCIAL_REPORTS = 'VIEW_FINANCIAL_REPORTS',
  MANAGE_PAYMENTS = 'MANAGE_PAYMENTS',
  PROCESS_REFUNDS = 'PROCESS_REFUNDS',
  VIEW_USER_PROFILES = 'VIEW_USER_PROFILES',
  EXPORT_DATA = 'EXPORT_DATA',
  
  // اجازه‌های مدیریت
  ADMIN = 'ADMIN',
  MANAGE_USERS = 'MANAGE_USERS',
  MANAGE_SYSTEM = 'MANAGE_SYSTEM',
  VIEW_ANALYTICS = 'VIEW_ANALYTICS'
}

// انواع فعالیت برای لاگ
export enum ActivityType {
  READ = 'READ',
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  DUPLICATE = 'DUPLICATE',
  AUTO_SAVE = 'AUTO_SAVE',
  READ_STATS = 'READ_STATS',
  BULK_CREATE = 'BULK_CREATE',
  BULK_UPDATE = 'BULK_UPDATE',
  BULK_DELETE = 'BULK_DELETE',
  SEARCH_TAGS = 'SEARCH_TAGS',
  TOGGLE_ACTIVE = 'TOGGLE_ACTIVE',
  PUBLISH_TO_TEST_EXAM = 'PUBLISH_TO_TEST_EXAM',
  READ_PUBLISHED = 'READ_PUBLISHED',
  LINK_COURSE_EXAM = 'LINK_COURSE_EXAM'
}

// انواع منابع
export enum PermissionResource {
  QUESTION = 'QUESTION',
  EXAM = 'EXAM',
  USER = 'USER',
  SYSTEM = 'SYSTEM'
}

// انواع عمل
export enum PermissionAction {
  CREATE = 'CREATE',
  READ = 'READ',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  PUBLISH = 'PUBLISH'
}

// رابط پاسخ API
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: string[];
}

// رابط اعتبارسنجی
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// نوع‌های مربوط به کیف پول و مالی
export interface WalletTransaction {
  id: string;
  amount: number;
  type: 'debit' | 'credit';
  description: string;
  timestamp: Date;
  referenceId?: string;
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  requestDate: Date;
  processedDate?: Date;
  adminNotes?: string;
} 