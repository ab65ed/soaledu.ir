/**
 * Course Service
 * سرویس مدیریت دروس
 */

import { apiRequest } from './api';

export interface Course {
  id: string;
  title: string;
  description?: string;
  category: string;
  courseType: string;
  grade: string;
  group?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CourseFilters {
  search?: string;
  courseType?: string;
  grade?: string;
  group?: string;
  category?: string;
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
      hasNext: boolean;
      hasPrev: boolean;
    };
  }> {
    try {
      console.log('🔍 getCourses called with filters:', filters);
      
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });

      const url = `${this.baseUrl}?${queryParams.toString()}`;
      console.log('🔍 Making request to:', url);

      const response = await apiRequest<{
        courses: any[];
        pagination: {
          total: number;
          count: number;
          limit: number;
          skip: number;
          hasNext: boolean;
          hasPrev: boolean;
        };
      }>(url);

      console.log('🔍 Raw response:', response);

      // Transform backend response to match frontend interface
      const transformedCourses = response.courses.map((course: any) => ({
        id: course._id,
        title: course.title,
        description: course.description,
        category: course.category,
        courseType: course.courseType,
        grade: course.grade,
        group: course.group,
        isActive: course.isActive,
        createdAt: course.createdAt,
        updatedAt: course.updatedAt
      }));

      console.log('🔍 Transformed courses:', transformedCourses);

      return {
        courses: transformedCourses,
        pagination: response.pagination
      };
    } catch (error) {
      console.error('❌ Error fetching courses:', error);
      // Return empty result on error
      return {
        courses: [],
        pagination: {
          total: 0,
          count: 0,
          limit: 50,
          skip: 0,
          hasNext: false,
          hasPrev: false
        }
      };
    }
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
    try {
      const response = await apiRequest<{
        success: boolean;
        message: string;
        data: any;
      }>(`${this.baseUrl}/${id}`);

      // Transform backend response to match frontend interface
      const course = response.data;
      return {
        id: course._id,
        title: course.title,
        description: course.description,
        category: course.category,
        courseType: course.courseType,
        grade: course.grade,
        group: course.group,
        isActive: course.isActive,
        createdAt: course.createdAt,
        updatedAt: course.updatedAt
      };
    } catch (error) {
      console.error('Error fetching course by ID:', error);
      throw error;
    }
  }

  /**
   * Create new course
   * ایجاد درس جدید
   */
  async createCourse(data: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>): Promise<Course> {
    try {
      const response = await apiRequest<{
        success: boolean;
        message: string;
        data: any;
      }>(`${this.baseUrl}`, {
        method: 'POST',
        body: JSON.stringify(data),
      });

      // Transform backend response to match frontend interface
      const course = response.data;
      return {
        id: course._id,
        title: course.title,
        description: course.description,
        category: course.category,
        courseType: course.courseType,
        grade: course.grade,
        group: course.group,
        isActive: course.isActive,
        createdAt: course.createdAt,
        updatedAt: course.updatedAt
      };
    } catch (error) {
      console.error('Error creating course:', error);
      throw error;
    }
  }

  /**
   * Update course
   * ویرایش درس
   */
  async updateCourse(id: string, data: Partial<Course>): Promise<Course> {
    try {
      const response = await apiRequest<{
        success: boolean;
        message: string;
        data: any;
      }>(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });

      // Transform backend response to match frontend interface
      const course = response.data;
      return {
        id: course._id,
        title: course.title,
        description: course.description,
        category: course.category,
        courseType: course.courseType,
        grade: course.grade,
        group: course.group,
        isActive: course.isActive,
        createdAt: course.createdAt,
        updatedAt: course.updatedAt
      };
    } catch (error) {
      console.error('Error updating course:', error);
      throw error;
    }
  }

  /**
   * Delete course
   * حذف درس
   */
  async deleteCourse(id: string): Promise<void> {
    try {
      await apiRequest(`${this.baseUrl}/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Error deleting course:', error);
      throw error;
    }
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

  /**
   * Get courses by filters for dropdown
   * دریافت دروس برای dropdown با فیلتر
   */
  async getCoursesByFilters(filters: {
    courseType?: string;
    grade?: string;
    group?: string;
    search?: string;
  }): Promise<Course[]> {
    const response = await this.getCourses({
      ...filters,
      isActive: true,
      limit: 100 // برای dropdown بیشتر نیاز است
    });
    return response.courses;
  }
}

export const courseService = new CourseService();
export default courseService; 