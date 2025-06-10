/**
 * useFlashcards Hook
 * هوک مدیریت فلش‌کارت‌ها
 * 
 * @hook useFlashcards
 * @description هوک برای مدیریت وضعیت فلش‌کارت‌ها با React Query
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { flashcardService } from '@/services/flashcardService';

// Types
export interface FlashcardFilters {
  search?: string;
  category?: string;
  subcategory?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  isPublic?: boolean;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'updatedAt' | 'price' | 'downloadCount' | 'likeCount';
  sortOrder?: 'asc' | 'desc';
}

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  explanation?: string;
  category: string;
  subcategory?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  format: 'basic' | 'cloze' | 'image' | 'audio';
  status: 'draft' | 'published' | 'archived';
  isPublic: boolean;
  price: number;
  downloadCount: number;
  viewCount: number;
  likeCount: number;
  notes?: string;
  imageUrl?: string;
  audioUrl?: string;
  estimatedStudyTime: number;
  lastStudied?: Date;
  studyCount: number;
  correctCount: number;
  incorrectCount: number;
  averageResponseTime: number;
  sourceQuestionId?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface FlashcardResponse {
  flashcards: Flashcard[];
  total: number;
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/**
 * هوک دریافت فلش‌کارت‌ها
 */
export const useFlashcards = (filters: FlashcardFilters = {}) => {
  return useQuery({
    queryKey: ['flashcards', filters],
    queryFn: () => flashcardService.getFlashcards(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    retry: 2
  });
};

/**
 * هوک دریافت یک فلش‌کارت
 */
export const useFlashcard = (id: string) => {
  return useQuery({
    queryKey: ['flashcard', id],
    queryFn: () => flashcardService.getFlashcard(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000
  });
};

/**
 * هوک ایجاد فلش‌کارت
 */
export const useCreateFlashcard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: flashcardService.createFlashcard,
    onSuccess: () => {
      // Invalidate and refetch flashcards
      queryClient.invalidateQueries({ queryKey: ['flashcards'] });
    },
    onError: (error) => {
      console.error('Error creating flashcard:', error);
    }
  });
};

/**
 * هوک به‌روزرسانی فلش‌کارت
 */
export const useUpdateFlashcard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Flashcard> }) =>
      flashcardService.updateFlashcard(id, data),
    onSuccess: (data, variables) => {
      // Update specific flashcard in cache
      queryClient.setQueryData(['flashcard', variables.id], data);
      // Invalidate flashcards list
      queryClient.invalidateQueries({ queryKey: ['flashcards'] });
    },
    onError: (error) => {
      console.error('Error updating flashcard:', error);
    }
  });
};

/**
 * هوک حذف فلش‌کارت
 */
export const useDeleteFlashcard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: flashcardService.deleteFlashcard,
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: ['flashcard', deletedId] });
      // Invalidate flashcards list
      queryClient.invalidateQueries({ queryKey: ['flashcards'] });
    },
    onError: (error) => {
      console.error('Error deleting flashcard:', error);
    }
  });
};

/**
 * هوک دریافت خریدهای کاربر
 */
export const useUserPurchases = () => {
  return useQuery({
    queryKey: ['user-purchases'],
    queryFn: flashcardService.getUserPurchases,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000 // 5 minutes
  });
};

/**
 * هوک ثبت جلسه مطالعه
 */
export const useRecordStudySession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: flashcardService.recordStudySession,
    onSuccess: (_, variables) => {
      // Update flashcard stats
      queryClient.invalidateQueries({ queryKey: ['flashcard', variables.flashcardId] });
      queryClient.invalidateQueries({ queryKey: ['user-stats'] });
    },
    onError: (error) => {
      console.error('Error recording study session:', error);
    }
  });
};

/**
 * هوک دریافت آمار کاربر
 */
export const useUserStats = () => {
  return useQuery({
    queryKey: ['user-stats'],
    queryFn: flashcardService.getUserStats,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000
  });
};

/**
 * هوک تولید فلش‌کارت از سوالات
 */
export const useGenerateFromQuestions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: flashcardService.generateFromQuestions,
    onSuccess: () => {
      // Invalidate flashcards list
      queryClient.invalidateQueries({ queryKey: ['flashcards'] });
    },
    onError: (error) => {
      console.error('Error generating flashcards from questions:', error);
    }
  });
}; 