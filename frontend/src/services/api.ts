/**
 * API Service Layer
 * لایه سرویس API برای ارتباط با بک‌اند
 */

import Parse from 'parse';
import { QueryClient } from '@tanstack/react-query';

// تنظیمات React Query
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 دقیقه
      gcTime: 1000 * 60 * 30, // 30 دقیقه
      retry: (failureCount, error: unknown) => {
        // در صورت خطای 401 یا 403 retry نکن
        if (error && typeof error === 'object' && 'status' in error) {
          const statusError = error as { status: number };
          if (statusError.status === 401 || statusError.status === 403) {
            return false;
          }
        }
        return failureCount < 3;
      },
    },
    mutations: {
      retry: false,
    },
  },
});

// تنظیمات Parse Server
Parse.initialize(
  process.env.NEXT_PUBLIC_PARSE_APP_ID || 'soaledu-app-id',
  process.env.NEXT_PUBLIC_PARSE_JS_KEY || 'soaledu-js-key'
);

Parse.serverURL = process.env.NEXT_PUBLIC_PARSE_SERVER_URL || 'http://localhost:1337/parse';

// Base API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337/api';

/**
 * Generic API response interface
 * رابط کلی پاسخ API
 */
interface ApiResponse<T = unknown> {
  status: 'success' | 'error';
  message: string;
  data?: T;
  errors?: Array<{ field: string; message: string }>;
  statusCode?: number;
}

/**
 * Generic API request function
 * تابع کلی درخواست API
 */
export const apiRequest = async <T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = localStorage.getItem('token');
  
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
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

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  const data: ApiResponse<T> = await response.json();
  
  if (data.status === 'error') {
    throw new Error(data.message || 'خطا در درخواست');
  }

  return data.data as T;
};

// ===================
// Auth Services
// ===================

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  async register(data: RegisterData): Promise<{ user: User; token: string }> {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getProfile(): Promise<User> {
    return apiRequest('/auth/profile');
  },

  async logout(): Promise<void> {
    localStorage.removeItem('token');
    queryClient.clear();
  },
};

// ===================
// CourseExam Services
// ===================

export interface CourseExam {
  id: string;
  title: string;
  courseType: string;
  grade: string;
  group: string;
  description: string;
  tags: string[];
  isPublished: boolean;
  isDraft: boolean;
  questionCount: number;
  totalSales: number;
  revenue: number;
  difficulty: string;
  estimatedTime: number;
  price: number;
  authorId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CourseExamFilters {
  search?: string;
  grade?: string;
  courseType?: string;
  difficulty?: string;
  isPublished?: boolean;
  limit?: number;
  skip?: number;
}

export const courseExamService = {
  async fetchCourseExams(filters: CourseExamFilters = {}): Promise<{
    exams: CourseExam[];
    pagination: {
      total: number;
      count: number;
      limit: number;
      skip: number;
    };
  }> {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    return apiRequest(`/courseExam?${queryParams.toString()}`);
  },

  async getCourseExamById(id: string): Promise<CourseExam> {
    return apiRequest(`/courseExam/${id}`);
  },

  // درس-آزمون‌های محبوب برای صفحه خانه
  async getPopularCourseExams(): Promise<CourseExam[]> {
    return apiRequest('/courseExam/popular', {
      method: 'GET',
    });
  },

  async createCourseExam(data: Partial<CourseExam>): Promise<CourseExam> {
    return apiRequest('/courseExam', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateCourseExam(id: string, data: Partial<CourseExam>): Promise<CourseExam> {
    return apiRequest(`/courseExam/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteCourseExam(id: string): Promise<void> {
    await apiRequest(`/courseExam/${id}`, {
      method: 'DELETE',
    });
  },
};

// ===================
// Question Services
// ===================

export interface Question {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'essay' | 'fill-blank';
  text: string;
  options?: string[];
  correctOptions?: number[];
  correctAnswer?: string | number;
  allowMultipleCorrect?: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  points?: number;
  explanation?: string;
  category?: string;
  lesson?: string;
  tags?: string[];
  timeLimit?: number;
  sourcePage?: string;
  sourceBook?: string;
  sourceChapter?: string;
  isDraft?: boolean;
  isPublished?: boolean;
  authorId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuestionFilters {
  search?: string;
  category?: string;
  difficulty?: string;
  type?: string;
  isPublished?: boolean;
  authorId?: string;
  limit?: number;
  skip?: number;
}

export const questionService = {
  async fetchQuestions(filters: QuestionFilters = {}): Promise<{
    questions: Question[];
    pagination: {
      total: number;
      count: number;
      limit: number;
      skip: number;
    };
  }> {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    return apiRequest(`/questions?${queryParams.toString()}`);
  },

  async searchQuestions(searchText: string): Promise<Question[]> {
    return apiRequest(`/questions/search?q=${encodeURIComponent(searchText)}`);
  },

  async getQuestionById(id: string): Promise<Question> {
    return apiRequest(`/questions/${id}`);
  },

  async createQuestion(data: Partial<Question>): Promise<Question> {
    return apiRequest('/questions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateQuestion(id: string, data: Partial<Question>): Promise<Question> {
    return apiRequest(`/questions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteQuestion(id: string): Promise<void> {
    return apiRequest(`/questions/${id}`, {
      method: 'DELETE',
    });
  },

  async publishQuestion(id: string): Promise<Question> {
    return apiRequest(`/questions/${id}/publish`, {
      method: 'POST',
    });
  },

  async unpublishQuestion(id: string): Promise<Question> {
    return apiRequest(`/questions/${id}/unpublish`, {
      method: 'POST',
    });
  },
};

// ===================
// Parse Server Services
// ===================

/**
 * Parse Server object utilities
 * ابزارهای Parse Server
 */
export const parseService = {
  async fetchParseObjects<T = Record<string, unknown>>(className: string, options: {
    limit?: number;
    skip?: number;
    where?: Record<string, unknown>;
    include?: string[];
    select?: string[];
    order?: string;
  } = {}): Promise<T[]> {
    const query = new Parse.Query(className);
    
    if (options.limit) query.limit(options.limit);
    if (options.skip) query.skip(options.skip);
    if (options.where) {
      Object.entries(options.where).forEach(([key, value]) => {
        query.equalTo(key, value);
      });
    }
    if (options.include) {
      options.include.forEach(field => query.include(field));
    }
    if (options.select) query.select(options.select);
    if (options.order) {
      const isDescending = options.order.startsWith('-');
      const field = isDescending ? options.order.slice(1) : options.order;
      if (isDescending) {
        query.descending(field);
      } else {
        query.ascending(field);
      }
    }

    const results = await query.find();
    return results.map(obj => obj.toJSON()) as T[];
  },

  async getParseObjectById<T = Record<string, unknown>>(className: string, id: string): Promise<T> {
    const query = new Parse.Query(className);
    const result = await query.get(id);
    return result.toJSON() as T;
  },

  async createParseObject(className: string, data: Record<string, unknown>): Promise<Record<string, unknown>> {
    const ParseClass = Parse.Object.extend(className);
    const obj = new ParseClass();
    
    Object.entries(data).forEach(([key, value]) => {
      obj.set(key, value);
    });

    const result = await obj.save();
    return result.toJSON();
  },

  async updateParseObject(className: string, id: string, data: Record<string, unknown>): Promise<Record<string, unknown>> {
    const query = new Parse.Query(className);
    const obj = await query.get(id);
    
    Object.entries(data).forEach(([key, value]) => {
      obj.set(key, value);
    });

    const result = await obj.save();
    return result.toJSON();
  },

  async deleteParseObject(className: string, id: string): Promise<void> {
    const query = new Parse.Query(className);
    const obj = await query.get(id);
    await obj.destroy();
  },
};

// ===================
// Contact Services
// ===================

export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  message: string;
  phone?: string;
  category?: 'bug_report' | 'feature_request' | 'general' | 'support';
  status?: 'pending' | 'replied' | 'closed';
  userAgent?: string;
  ipAddress?: string;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ContactStats {
  total: number;
  pending: number;
  replied: number;
  closed: number;
}

export const contactService = {
  async sendMessage(data: Omit<ContactMessage, 'id' | 'createdAt' | 'updatedAt'>): Promise<ContactMessage> {
    // افزودن اطلاعات اضافی
    const enrichedData = {
      ...data,
      userAgent: navigator.userAgent,
      ipAddress: 'client-ip', // این در بک‌اند تعیین خواهد شد
      category: data.category || 'general',
      status: 'pending' as const,
    };

    return apiRequest('/contact', {
      method: 'POST',
      body: JSON.stringify(enrichedData),
    });
  },

  async getContactStats(): Promise<ContactStats> {
    return apiRequest('/contact/stats');
  },

  async getMessages(filters: {
    status?: string;
    category?: string;
    limit?: number;
    skip?: number;
  } = {}): Promise<{
    messages: ContactMessage[];
    pagination: {
      total: number;
      count: number;
      limit: number;
      skip: number;
    };
  }> {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    return apiRequest(`/contact/messages?${queryParams.toString()}`);
  },

  async updateMessageStatus(id: string, status: 'pending' | 'replied' | 'closed'): Promise<ContactMessage> {
    return apiRequest(`/contact/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  async respondToTicket(id: string, response: string, status: 'replied' | 'closed'): Promise<ContactMessage> {
    return apiRequest(`/contact/tickets/${id}/respond`, {
      method: 'POST',
      body: JSON.stringify({ response, status }),
    });
  },
};

// ===================
// Testimonials Services - نظرات کاربران
// ===================

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  message: string;
  rating: number;
  avatar?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export const testimonialService = {
  async getPublishedTestimonials(): Promise<Testimonial[]> {
    return apiRequest('/testimonials', {
      method: 'GET',
    });
  },
};

// ===================
// Blog Services
// ===================

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage?: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  categoryId: string;
  categoryName: string;
  tags: string[];
  viewCount: number;
  likeCount: number;
  isPublished: boolean;
  isDraft: boolean;
  publishedAt?: string;
  readTime: number; // تخمین زمان مطالعه به دقیقه
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  postCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BlogComment {
  id: string;
  postId: string;
  authorName: string;
  authorEmail: string;
  authorAvatar?: string;
  content: string;
  parentId?: string; // برای پاسخ به کامنت
  isApproved: boolean;
  userId?: string;
  replies?: BlogComment[];
  createdAt: string;
  updatedAt: string;
}

export interface BlogFilters {
  search?: string;
  categoryId?: string;
  authorId?: string;
  tags?: string[];
  isPublished?: boolean;
  sortBy?: 'newest' | 'oldest' | 'popular' | 'trending';
  limit?: number;
  skip?: number;
}

export interface BlogStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalViews: number;
  totalComments: number;
  categoriesCount: number;
}

export const blogService = {
  // دریافت لیست مقالات بلاگ با فیلتر
  async getBlogPosts(filters: BlogFilters = {}): Promise<{
    posts: BlogPost[];
    pagination: {
      total: number;
      count: number;
      limit: number;
      skip: number;
    };
  }> {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          queryParams.append(key, value.join(','));
        } else {
          queryParams.append(key, value.toString());
        }
      }
    });

    return apiRequest(`/blog/posts?${queryParams.toString()}`);
  },

  // دریافت مقاله بلاگ با slug
  async getBlogPostBySlug(slug: string): Promise<BlogPost> {
    return apiRequest(`/blog/posts/${slug}`);
  },

  // دریافت مقالات پربازدید
  async getPopularBlogPosts(limit = 5): Promise<BlogPost[]> {
    return apiRequest(`/blog/posts/popular?limit=${limit}`);
  },

  // دریافت مقالات مرتبط
  async getRelatedBlogPosts(postId: string, limit = 3): Promise<BlogPost[]> {
    return apiRequest(`/blog/posts/${postId}/related?limit=${limit}`);
  },

  // ایجاد مقاله جدید (برای Admin/Designer)
  async createBlogPost(data: Partial<BlogPost>): Promise<BlogPost> {
    return apiRequest('/blog/posts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // ویرایش مقاله
  async updateBlogPost(id: string, data: Partial<BlogPost>): Promise<BlogPost> {
    return apiRequest(`/blog/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // حذف مقاله
  async deleteBlogPost(id: string): Promise<void> {
    return apiRequest(`/blog/posts/${id}`, {
      method: 'DELETE',
    });
  },

  // انتشار/عدم انتشار مقاله
  async publishBlogPost(id: string, publish: boolean): Promise<BlogPost> {
    return apiRequest(`/blog/posts/${id}/publish`, {
      method: 'PATCH',
      body: JSON.stringify({ isPublished: publish }),
    });
  },

  // افزایش تعداد بازدید
  async incrementViewCount(slug: string): Promise<void> {
    return apiRequest(`/blog/posts/${slug}/view`, {
      method: 'POST',
    });
  },

  // دریافت دسته‌بندی‌های بلاگ
  async getBlogCategories(): Promise<BlogCategory[]> {
    return apiRequest('/blog/categories');
  },

  // ایجاد دسته‌بندی جدید
  async createBlogCategory(data: Partial<BlogCategory>): Promise<BlogCategory> {
    return apiRequest('/blog/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // دریافت نظرات مقاله
  async getBlogComments(postId: string, approved = true): Promise<BlogComment[]> {
    return apiRequest(`/blog/posts/${postId}/comments?approved=${approved}`);
  },

  // ارسال نظر جدید
  async createBlogComment(data: {
    postId: string;
    authorName: string;
    authorEmail: string;
    content: string;
    parentId?: string;
  }): Promise<BlogComment> {
    return apiRequest('/blog/comments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // تأیید/رد نظر (برای Admin)
  async approveBlogComment(id: string, approved: boolean): Promise<BlogComment> {
    return apiRequest(`/blog/comments/${id}/approve`, {
      method: 'PATCH',
      body: JSON.stringify({ isApproved: approved }),
    });
  },

  // حذف نظر
  async deleteBlogComment(id: string): Promise<void> {
    return apiRequest(`/blog/comments/${id}`, {
      method: 'DELETE',
    });
  },

  // دریافت آمار بلاگ
  async getBlogStats(): Promise<BlogStats> {
    return apiRequest('/blog/stats');
  },

  // جستجوی مقالات
  async searchBlogPosts(query: string): Promise<BlogPost[]> {
    return apiRequest(`/blog/search?q=${encodeURIComponent(query)}`);
  },
};

// ===================
// Admin Services
// ===================

export interface AdminStats {
  users: {
    total: number;
    active: number;
    newThisMonth: number;
    students: number;
    teachers: number;
    admins: number;
  };
  courseExams: {
    total: number;
    published: number;
    drafts: number;
    totalSales: number;
  };
  questions: {
    total: number;
    published: number;
    drafts: number;
  };
  finance: {
    totalRevenue: number;
    monthlyRevenue: number;
    avgOrderValue: number;
    pendingPayments: number;
  };
  activity: {
    totalLogins: number;
    activeToday: number;
    averageSessionTime: number;
  };
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  lastLogin: string;
  registeredAt: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  description: string;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error';
}

export interface FinanceData {
  revenue: {
    total: number;
    monthly: number;
    weekly: number;
    daily: number;
  };
  discounts: {
    active: number;
    totalUsed: number;
    totalSavings: number;
  };
  pricing: {
    averagePrice: number;
    minPrice: number;
    maxPrice: number;
  };
  transactions: Array<{
    id: string;
    amount: number;
    type: 'sale' | 'refund' | 'discount';
    date: string;
    description: string;
    status: 'completed' | 'pending' | 'failed';
  }>;
}

export const adminService = {
  // دریافت آمار کلی سیستم
  async getAdminStats(): Promise<AdminStats> {
    return apiRequest('/admin/stats');
  },

  // دریافت لیست کاربران
  async getUsers(filters: {
    role?: string;
    isActive?: boolean;
    search?: string;
    limit?: number;
    skip?: number;
  } = {}): Promise<{
    users: AdminUser[];
    pagination: {
      total: number;
      count: number;
      limit: number;
      skip: number;
    };
  }> {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    return apiRequest(`/admin/users?${queryParams.toString()}`);
  },

  // دریافت داده‌های مالی
  async getFinanceData(): Promise<FinanceData> {
    return apiRequest('/admin/finance');
  },

  // دریافت لاگ‌های فعالیت
  async getActivityLogs(filters: {
    userId?: string;
    action?: string;
    level?: string;
    startDate?: string;
    endDate?: string;
    limit?: number;
    skip?: number;
  } = {}): Promise<{
    logs: ActivityLog[];
    pagination: {
      total: number;
      count: number;
      limit: number;
      skip: number;
    };
  }> {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    return apiRequest(`/admin/logs?${queryParams.toString()}`);
  },

  // تغییر وضعیت کاربر
  async updateUserStatus(userId: string, isActive: boolean): Promise<AdminUser> {
    return apiRequest(`/admin/users/${userId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ isActive }),
    });
  },

  // تغییر نقش کاربر
  async updateUserRole(userId: string, role: string): Promise<AdminUser> {
    return apiRequest(`/admin/users/${userId}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    });
  },

  // حذف کاربر
  async deleteUser(userId: string): Promise<void> {
    return apiRequest(`/admin/users/${userId}`, {
      method: 'DELETE',
    });
  },
};

// ===================
// Learner Services
// ===================

export interface LearnerExam {
  id: string;
  title: string;
  courseType: string;
  grade: string;
  score?: number;
  maxScore: number;
  completedAt?: string;
  status: 'completed' | 'in-progress' | 'not-started';
  timeSpent?: number;
  correctAnswers?: number;
  totalQuestions: number;
  difficulty: string;
  price: number;
}

export interface LearnerWallet {
  balance: number;
  totalSpent: number;
  rewardsEarned: number;
  transactions: Array<{
    id: string;
    type: 'purchase' | 'reward' | 'refund';
    amount: number;
    description: string;
    date: string;
    status: 'completed' | 'pending' | 'failed';
  }>;
  rewards: {
    current: number;
    target: number;
    level: string;
  };
}

export interface LearnerProgress {
  totalExamsCompleted: number;
  totalTimeSpent: number;
  averageScore: number;
  strongSubjects: string[];
  weakSubjects: string[];
  recentActivity: Array<{
    type: 'exam_completed' | 'exam_started' | 'purchase';
    title: string;
    date: string;
    details?: string;
  }>;
}

export interface LearnerOverviewData {
  exams: LearnerExam[];
  wallet: LearnerWallet;
  progress: LearnerProgress;
  recentExams: LearnerExam[];
  recommendations: LearnerExam[];
}

export const learnerService = {
  /**
   * دریافت اطلاعات کلی داشبورد فراگیر
   * Get learner overview data
   */
  async getLearnerOverview(): Promise<LearnerOverviewData> {
    return apiRequest('/learner/overview');
  },

  /**
   * دریافت لیست آزمون‌های فراگیر
   * Get learner's exams list
   */
  async getLearnerExams(filters: {
    status?: 'completed' | 'in-progress' | 'not-started';
    limit?: number;
    skip?: number;
  } = {}): Promise<{
    exams: LearnerExam[];
    pagination: {
      total: number;
      count: number;
      limit: number;
      skip: number;
    };
  }> {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    return apiRequest(`/learner/exams?${queryParams.toString()}`);
  },

  /**
   * دریافت اطلاعات کیف پول فراگیر
   * Get learner's wallet information
   */
  async getLearnerWallet(): Promise<LearnerWallet> {
    return apiRequest('/learner/wallet');
  },

  /**
   * دریافت پیشرفت تحصیلی فراگیر
   * Get learner's progress data
   */
  async getLearnerProgress(): Promise<LearnerProgress> {
    return apiRequest('/learner/progress');
  },

  /**
   * شروع آزمون جدید
   * Start a new exam
   */
  async startExam(examId: string): Promise<{ examSessionId: string; startTime: string }> {
    return apiRequest(`/learner/exams/${examId}/start`, {
      method: 'POST',
    });
  },

  /**
   * ادامه آزمون
   * Continue exam
   */
  async continueExam(examId: string): Promise<{
    examSessionId: string;
    currentQuestionIndex: number;
    timeRemaining: number;
    answers: Record<string, unknown>;
  }> {
    return apiRequest(`/learner/exams/${examId}/continue`);
  },

  /**
   * خرید آزمون
   * Purchase exam
   */
  async purchaseExam(examId: string): Promise<{
    success: boolean;
    transactionId: string;
    newBalance: number;
  }> {
    return apiRequest(`/learner/exams/${examId}/purchase`, {
      method: 'POST',
    });
  },
};

// ===================
// Expert Services
// ===================

export interface PendingContent {
  id: string;
  title: string;
  type: 'question' | 'course-exam';
  content_preview: string;
  full_content: string;
  created_date: string;
  priority?: 'high' | 'medium' | 'low';
  author_id: string;
  author_name: string;
  category?: string;
  tags?: string[];
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'needs_revision';
}

export interface QualityStats {
  overall_average: number;
  approved_today: number;
  needs_revision: number;
  average_quality: number;
  today_reviews: number;
  today_trend: number;
  high_quality_percentage: number;
  active_experts: number;
  content_type_quality: Array<{
    type: string;
    average: number;
    count: number;
    improvement: number;
  }>;
  weekly_trend: Array<{
    day_name: string;
    average: number;
  }>;
  status_breakdown: {
    approved: number;
    needs_revision: number;
    rejected: number;
  };
  response_time: {
    average: number;
    min: number;
    max: number;
  };
  top_expert: {
    name: string;
    score: number;
  };
  expert_performance: {
    daily_average: number;
  };
  satisfaction_rate: number;
}

export interface ReviewSubmission {
  status: 'approved' | 'needs_revision' | 'rejected';
  feedback: string;
  quality_score: number;
  improvements?: string;
}

export const expertService = {
  // دریافت محتوای در انتظار بررسی
  async getPendingContent(): Promise<{
    items: PendingContent[];
    total: number;
    pagination: {
      total: number;
      count: number;
      limit: number;
      skip: number;
    };
  }> {
    return apiRequest('/expert/content/pending');
  },

  // دریافت آمار کیفیت
  async getQualityStats(): Promise<QualityStats> {
    return apiRequest('/expert/quality-stats');
  },

  // ارسال بازخورد
  async submitReview(itemId: string, review: ReviewSubmission): Promise<{
    success: boolean;
    message: string;
    updatedItem: PendingContent;
  }> {
    return apiRequest(`/expert/content/${itemId}/review`, {
      method: 'POST',
      body: JSON.stringify(review),
    });
  },

  // دریافت تاریخچه بررسی‌ها
  async getReviewHistory(filters: {
    startDate?: string;
    endDate?: string;
    status?: string;
    limit?: number;
    skip?: number;
  } = {}): Promise<{
    reviews: Array<{
      id: string;
      contentId: string;
      contentTitle: string;
      status: string;
      quality_score: number;
      feedback: string;
      reviewed_at: string;
      expert_name: string;
    }>;
    pagination: {
      total: number;
      count: number;
      limit: number;
      skip: number;
    };
  }> {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    return apiRequest(`/expert/reviews/history?${queryParams.toString()}`);
  },

  // آپدیت وضعیت کارشناس (فعال/غیرفعال)
  async updateExpertStatus(isActive: boolean): Promise<{
    success: boolean;
    message: string;
  }> {
    return apiRequest('/expert/status', {
      method: 'PATCH',
      body: JSON.stringify({ isActive }),
    });
  },

  // دریافت آمار عملکرد شخصی کارشناس
  async getPersonalStats(): Promise<{
    total_reviews: number;
    average_quality_score: number;
    reviews_this_month: number;
    ranking: number;
    total_experts: number;
    response_time_average: number;
    satisfaction_rating: number;
    specialties: string[];
    monthly_trend: Array<{
      month: string;
      reviews: number;
      average_score: number;
    }>;
  }> {
    return apiRequest('/expert/stats/personal');
  },
};

const apiServices = {
  authService,
  courseExamService,
  questionService,
  parseService,
  contactService,
  testimonialService,
  blogService,
  adminService,
  queryClient,
};

export default apiServices; 