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

const apiServices = {
  authService,
  courseExamService,
  questionService,
  parseService,
  contactService,
  queryClient,
};

export default apiServices; 