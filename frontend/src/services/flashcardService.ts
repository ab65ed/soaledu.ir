/**
 * Flashcard Service
 * سرویس فلش‌کارت‌ها
 * 
 * @service flashcardService
 * @description سرویس برای انجام عملیات API مربوط به فلش‌کارت‌ها
 */

import { apiRequest } from './api';
import type { FlashcardFilters, Flashcard, FlashcardResponse } from '@/hooks/useFlashcards';

export interface CreateFlashcardData {
  question: string;
  answer: string;
  explanation?: string;
  category: string;
  subcategory?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  format: 'basic' | 'cloze' | 'image' | 'audio';
  isPublic: boolean;
  price?: number;
  notes?: string;
  imageUrl?: string;
  audioUrl?: string;
  estimatedStudyTime?: number;
  sourceQuestionId?: string;
}

export interface StudySessionData {
  flashcardId: string;
  responseTime: number;
  isCorrect: boolean;
  difficulty: number;
  notes?: string;
}

export interface GenerateFromQuestionsData {
  sourceQuestionIds: string[];
  category?: string;
  subcategory?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  includeExplanation: boolean;
  autoPublish: boolean;
  price?: number;
  tags?: string[];
}

/**
 * سرویس فلش‌کارت‌ها
 */
export const flashcardService = {
  /**
   * دریافت لیست فلش‌کارت‌ها
   */
  async getFlashcards(filters: FlashcardFilters = {}): Promise<FlashcardResponse> {
    try {
      const params = new URLSearchParams();
      
      if (filters.search) params.append('search', filters.search);
      if (filters.category) params.append('category', filters.category);
      if (filters.subcategory) params.append('subcategory', filters.subcategory);
      if (filters.difficulty) params.append('difficulty', filters.difficulty);
      if (filters.isPublic !== undefined) params.append('isPublic', filters.isPublic.toString());
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

      return await apiRequest<FlashcardResponse>(`/flashcards?${params.toString()}`);
    } catch (error) {
      console.error('Error fetching flashcards:', error);
      throw error;
    }
  },

  /**
   * دریافت یک فلش‌کارت
   */
  async getFlashcard(id: string): Promise<Flashcard> {
    try {
      return await apiRequest<Flashcard>(`/flashcards/${id}`);
    } catch (error) {
      console.error('Error fetching flashcard:', error);
      throw error;
    }
  },

  /**
   * ایجاد فلش‌کارت جدید
   */
  async createFlashcard(data: CreateFlashcardData): Promise<Flashcard> {
    try {
      return await apiRequest<Flashcard>('/flashcards', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error('Error creating flashcard:', error);
      throw error;
    }
  },

  /**
   * به‌روزرسانی فلش‌کارت
   */
  async updateFlashcard(id: string, data: Partial<CreateFlashcardData>): Promise<Flashcard> {
    try {
      return await apiRequest<Flashcard>(`/flashcards/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error('Error updating flashcard:', error);
      throw error;
    }
  },

  /**
   * حذف فلش‌کارت
   */
  async deleteFlashcard(id: string): Promise<void> {
    try {
      await apiRequest<void>(`/flashcards/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Error deleting flashcard:', error);
      throw error;
    }
  },

  /**
   * لایک فلش‌کارت
   */
  async likeFlashcard(id: string): Promise<Flashcard> {
    try {
      return await apiRequest<Flashcard>(`/flashcards/${id}/like`, {
        method: 'POST',
      });
    } catch (error) {
      console.error('Error liking flashcard:', error);
      throw error;
    }
  },

  /**
   * خرید فلش‌کارت
   */
  async purchaseFlashcard(id: string): Promise<{ success: boolean; purchaseId: string }> {
    try {
      return await apiRequest<{ success: boolean; purchaseId: string }>(`/flashcards/${id}/purchase`, {
        method: 'POST',
      });
    } catch (error) {
      console.error('Error purchasing flashcard:', error);
      throw error;
    }
  },

  /**
   * دریافت خریدهای کاربر
   */
  async getUserPurchases(): Promise<{ purchases: Array<{ id: string; flashcardId: string; purchasedAt: Date }> }> {
    try {
      return await apiRequest<{ purchases: Array<{ id: string; flashcardId: string; purchasedAt: Date }> }>('/flashcards/my-purchases');
    } catch (error) {
      console.error('Error fetching user purchases:', error);
      throw error;
    }
  },

  /**
   * ثبت جلسه مطالعه
   */
  async recordStudySession(data: StudySessionData): Promise<{ success: boolean; sessionId: string }> {
    try {
      return await apiRequest<{ success: boolean; sessionId: string }>('/flashcards/study-session', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error('Error recording study session:', error);
      throw error;
    }
  },

  /**
   * دریافت آمار کاربر
   */
  async getUserStats(): Promise<{
    totalStudied: number;
    totalCorrect: number;
    averageAccuracy: number;
    streakDays: number;
    totalTime: number;
  }> {
    try {
      return await apiRequest<{
        totalStudied: number;
        totalCorrect: number;
        averageAccuracy: number;
        streakDays: number;
        totalTime: number;
      }>('/flashcards/stats');
    } catch (error) {
      console.error('Error fetching user stats:', error);
      throw error;
    }
  },

  /**
   * تولید فلش‌کارت از سوالات
   */
  async generateFromQuestions(data: GenerateFromQuestionsData): Promise<Flashcard[]> {
    try {
      return await apiRequest<Flashcard[]>('/flashcards/generate-from-questions', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error('Error generating flashcards from questions:', error);
      throw error;
    }
  },

  /**
   * دریافت دسته‌بندی‌های فلش‌کارت
   */
  async getCategories(): Promise<string[]> {
    try {
      return await apiRequest<string[]>('/flashcards/categories');
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }
}; 