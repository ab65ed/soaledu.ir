/**
 * Course Service
 * سرویس مدیریت دروس
 */

import { apiRequest } from './api';

export interface Course {
  id: string;
  title: string;
  description?: string;
  courseType: string;
  grade: string;
  group: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CourseFilters {
  search?: string;
  courseType?: string;
  grade?: string;
  group?: string;
  isActive?: boolean;
  limit?: number;
  skip?: number;
}

class CourseService {
  private readonly baseUrl = '/courses';

  /**
   * Get courses list with search and filters
   * دریافت لیست دروس با جستجو و فیلتر
   */
  async getCourses(filters: CourseFilters = {}): Promise<{
    courses: Course[];
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
        queryParams.append(key, String(value));
      }
    });

    return apiRequest(`${this.baseUrl}?${queryParams.toString()}`);
  }

  /**
   * Search courses by title
   * جستجو در دروس بر اساس عنوان
   */
  async searchCourses(query: string, filters: Omit<CourseFilters, 'search'> = {}): Promise<Course[]> {
    const searchFilters = { ...filters, search: query, limit: 20 };
    const response = await this.getCourses(searchFilters);
    return response.courses;
  }

  /**
   * Get course by ID
   * دریافت درس با شناسه
   */
  async getCourseById(id: string): Promise<Course> {
    return apiRequest(`${this.baseUrl}/${id}`);
  }

  /**
   * Create new course
   * ایجاد درس جدید
   */
  async createCourse(data: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>): Promise<Course> {
    return apiRequest(`${this.baseUrl}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Update course
   * ویرایش درس
   */
  async updateCourse(id: string, data: Partial<Course>): Promise<Course> {
    return apiRequest(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * Delete course
   * حذف درس
   */
  async deleteCourse(id: string): Promise<void> {
    await apiRequest(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Get popular courses
   * دریافت دروس محبوب
   */
  async getPopularCourses(limit = 10): Promise<Course[]> {
    const response = await this.getCourses({ 
      isActive: true, 
      limit 
    });
    return response.courses;
  }
}

export const courseService = new CourseService();
export default courseService; 