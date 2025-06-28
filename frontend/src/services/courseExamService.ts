/**
 * Course Exam API Service
 * سرویس API برای درس-آزمون
 */

import { apiRequest } from './api';
import {
  CourseExam,
  CourseExamFormData,
  CourseExamResponse,
  Question,
  QuestionsResponse,
  QuestionFilters,
  CourseExamAnalytics,
  PerformanceMetrics
} from '@/types/courseExam';

class CourseExamService {
  private readonly baseUrl = '/course-exams';

  /**
   * Create a new course exam
   * ایجاد درس-آزمون جدید
   */
  async createCourseExam(data: CourseExamFormData): Promise<CourseExam> {
    const startTime = performance.now();
    
    try {
      const response = await apiRequest<CourseExam>(`${this.baseUrl}`, {
        method: 'POST',
        body: JSON.stringify(data),
      });

      // Track performance
      this.trackPerformance('create_course_exam', performance.now() - startTime);
      
      return response;
    } catch (error) {
      this.trackError('create_course_exam', error);
      throw error;
    }
  }

  /**
   * Get course exams list
   * دریافت لیست درس-آزمون‌ها
   */
  async getCourseExams(filters: {
    search?: string;
    courseType?: string;
    grade?: string;
    group?: string;
    limit?: number;
    skip?: number;
  } = {}): Promise<{
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
      if (value !== undefined) {
        queryParams.append(key, String(value));
      }
    });

    const response = await apiRequest<{
      exams: CourseExam[];
      pagination: {
        total: number;
        count: number;
        limit: number;
        skip: number;
      };
    }>(`${this.baseUrl}?${queryParams.toString()}`);

    return response;
  }

  /**
   * Get course exam by ID
   * دریافت درس-آزمون با شناسه
   */
  async getCourseExamById(id: string): Promise<CourseExam> {
    return apiRequest<CourseExam>(`${this.baseUrl}/${id}`);
  }

  /**
   * Update course exam
   * ویرایش درس-آزمون
   */
  async updateCourseExam(id: string, data: Partial<CourseExamFormData>): Promise<CourseExam> {
    return apiRequest<CourseExam>(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * Delete course exam
   * حذف درس-آزمون
   */
  async deleteCourseExam(id: string): Promise<void> {
    await apiRequest(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Publish course exam
   * انتشار درس-آزمون
   */
  async publishCourseExam(id: string): Promise<CourseExam> {
    return apiRequest<CourseExam>(`${this.baseUrl}/${id}/publish`, {
      method: 'POST',
    });
  }

  /**
   * Get questions for course exam
   * دریافت سوالات برای درس-آزمون
   */
  async getQuestions(filters: QuestionFilters = {}): Promise<{
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
      if (value !== undefined) {
        if (Array.isArray(value)) {
          value.forEach(v => queryParams.append(key, String(v)));
        } else {
          queryParams.append(key, String(value));
        }
      }
    });

    return apiRequest<{
      questions: Question[];
      pagination: {
        total: number;
        count: number;
        limit: number;
        skip: number;
      };
    }>(`/questions?${queryParams.toString()}`);
  }

  /**
   * Search questions
   * جستجو در سوالات
   */
  async searchQuestions(query: string, filters: QuestionFilters = {}): Promise<Question[]> {
    const searchFilters = { ...filters, search: query };
    const response = await this.getQuestions(searchFilters);
    return response.questions;
  }

  /**
   * Auto-save form data
   * ذخیره خودکار داده‌های فرم
   */
  async autoSave(data: Partial<CourseExamFormData>): Promise<void> {
    // Save to localStorage as fallback
    localStorage.setItem('courseExamFormData', JSON.stringify({
      ...data,
      lastSaved: new Date().toISOString()
    }));

    // Optionally save to server
    try {
      await apiRequest('/course-exams/auto-save', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.warn('Auto-save to server failed, using localStorage fallback');
    }
  }

  /**
   * Load auto-saved data
   * بارگذاری داده‌های ذخیره شده خودکار
   */
  loadAutoSavedData(): Partial<CourseExamFormData> | null {
    try {
      const saved = localStorage.getItem('courseExamFormData');
      if (saved) {
        const data = JSON.parse(saved);
        // Check if data is not too old (24 hours)
        const lastSaved = new Date(data.lastSaved);
        const now = new Date();
        const hoursDiff = (now.getTime() - lastSaved.getTime()) / (1000 * 60 * 60);
        
        if (hoursDiff < 24) {
          return data;
        }
      }
    } catch (error) {
      console.warn('Failed to load auto-saved data:', error);
    }
    return null;
  }

  /**
   * Clear auto-saved data
   * پاک کردن داده‌های ذخیره شده خودکار
   */
  clearAutoSavedData(): void {
    localStorage.removeItem('courseExamFormData');
  }

  /**
   * Rate course exam
   * امتیازدهی به درس-آزمون
   */
  async rateCourseExam(id: string, rating: number, comment?: string): Promise<void> {
    await apiRequest(`${this.baseUrl}/${id}/rate`, {
      method: 'POST',
      body: JSON.stringify({ rating, comment }),
    });
  }

  /**
   * Get course exam analytics
   * دریافت آمار درس-آزمون
   */
  async getAnalytics(): Promise<CourseExamAnalytics> {
    return apiRequest<CourseExamAnalytics>(`${this.baseUrl}/analytics`);
  }

  /**
   * Track performance metrics
   * ردیابی معیارهای عملکرد
   */
  private trackPerformance(action: string, duration: number): void {
    // Send to analytics service
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'timing_complete', {
        name: action,
        value: Math.round(duration)
      });
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`Performance: ${action} took ${duration.toFixed(2)}ms`);
    }
  }

  /**
   * Track errors
   * ردیابی خطاها
   */
  private trackError(action: string, error: unknown): void {
    // Send to error tracking service
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'exception', {
        description: `${action}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        fatal: false
      });
    }

    // Log to console
    console.error(`Error in ${action}:`, error);
  }

  /**
   * Generate mock data for development
   * تولید داده‌های نمونه برای توسعه
   */
  generateMockQuestions(count: number = 40): Question[] {
    const mockQuestions: Question[] = [];
    const difficulties: Array<'easy' | 'medium' | 'hard'> = ['easy', 'medium', 'hard'];
    const types: Array<'multiple-choice' | 'true-false' | 'descriptive'> = ['multiple-choice', 'true-false', 'descriptive'];

    for (let i = 1; i <= count; i++) {
      mockQuestions.push({
        id: `question-${i}`,
        title: `سوال شماره ${i}`,
        content: `این متن سوال شماره ${i} است که برای تست طراحی شده است.`,
        type: types[Math.floor(Math.random() * types.length)],
        difficulty: difficulties[Math.floor(Math.random() * difficulties.length)],
        tags: [`تگ-${i}`, 'نمونه'],
        courseType: 'mathematics',
        grade: 'high-school-10',
        group: 'mathematical',
        points: Math.floor(Math.random() * 5) + 1,
        estimatedTime: Math.floor(Math.random() * 10) + 2,
        isSelected: false
      });
    }

    return mockQuestions;
  }

  /**
   * Validate question difficulty distribution
   * اعتبارسنجی توزیع سختی سوالات
   */
  validateQuestionDistribution(questions: Question[]): {
    isValid: boolean;
    errors: string[];
    distribution: Record<'easy' | 'medium' | 'hard', number>;
  } {
    const errors: string[] = [];
    const distribution = {
      easy: 0,
      medium: 0,
      hard: 0
    };

    questions.forEach(q => {
      distribution[q.difficulty]++;
    });

    const total = questions.length;
    if (total === 0) {
      errors.push('هیچ سوالی انتخاب نشده است');
      return { isValid: false, errors, distribution };
    }

    // Business rules for distribution
    const easyPercentage = (distribution.easy / total) * 100;
    const hardPercentage = (distribution.hard / total) * 100;

    if (easyPercentage < 20) {
      errors.push('آزمون باید حداقل ۲۰٪ سوال آسان داشته باشد');
    }

    if (hardPercentage > 50) {
      errors.push('آزمون نباید بیش از ۵۰٪ سوال سخت داشته باشد');
    }

    return {
      isValid: errors.length === 0,
      errors,
      distribution
    };
  }
}

// Singleton instance
export const courseExamService = new CourseExamService();
export default courseExamService; 