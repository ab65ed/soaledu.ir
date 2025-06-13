/**
 * Custom hooks for Institution Management
 * هوک‌های سفارشی برای مدیریت موسسات
 */

import { useState, useEffect, useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { institutionService } from '@/services/institutionService';
import {
  IInstitution,
  InstitutionFormData,
  InstitutionFilters,
  InstitutionStats,
} from '@/types/institution';

interface UseInstitutionsResult {
  institutions: IInstitution[];
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  } | null;
  fetchInstitutions: (filters?: InstitutionFilters) => Promise<void>;
  refreshInstitutions: () => Promise<void>;
}

interface UseInstitutionStatsResult {
  stats: InstitutionStats | null;
  loading: boolean;
  error: string | null;
  fetchStats: () => Promise<void>;
}

/**
 * Hook for managing institutions list
 */
export const useInstitutions = (initialFilters: InstitutionFilters = {}): UseInstitutionsResult => {
  const [institutions, setInstitutions] = useState<IInstitution[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<UseInstitutionsResult['pagination']>(null);
  const [currentFilters, setCurrentFilters] = useState<InstitutionFilters>(initialFilters);

  const fetchInstitutions = useCallback(async (filters: InstitutionFilters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const appliedFilters = { ...currentFilters, ...filters };
      const response = await institutionService.getInstitutions(appliedFilters);
      
      setInstitutions(response.data.institutions);
      setPagination(response.data.pagination);
      setCurrentFilters(appliedFilters);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'خطا در دریافت لیست موسسات';
      setError(errorMessage);
      setInstitutions([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  }, [currentFilters]);

  const refreshInstitutions = useCallback(async () => {
    await fetchInstitutions(currentFilters);
  }, [fetchInstitutions, currentFilters]);

  useEffect(() => {
    fetchInstitutions(initialFilters);
  }, []);

  return {
    institutions,
    loading,
    error,
    pagination,
    fetchInstitutions,
    refreshInstitutions,
  };
};

/**
 * Hook for institution statistics
 */
export const useInstitutionStats = (): UseInstitutionStatsResult => {
  const [stats, setStats] = useState<InstitutionStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await institutionService.getInstitutionStats();
      setStats(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در دریافت آمار موسسات');
      setStats(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    fetchStats,
  };
};

/**
 * Hook برای دریافت جزئیات یک موسسه
 */
export const useInstitution = (id: string) => {
  return useQuery({
    queryKey: ['institution', id],
    queryFn: () => institutionService.getInstitutionById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 دقیقه
    refetchOnWindowFocus: false,
  });
};

/**
 * Hook برای ایجاد موسسه جدید
 */
export const useCreateInstitution = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: InstitutionFormData) => institutionService.createInstitution(data),
    onSuccess: () => {
      toast.success('موسسه با موفقیت ایجاد شد');
      queryClient.invalidateQueries({ queryKey: ['institutions'] });
      queryClient.invalidateQueries({ queryKey: ['institution-stats'] });
    },
    onError: (error: Error) => {
      toast.error(`خطا در ایجاد موسسه: ${error.message}`);
    },
  });
};

/**
 * Hook برای بروزرسانی موسسه
 */
export const useUpdateInstitution = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<InstitutionFormData> }) => 
      institutionService.updateInstitution(id, data),
    onSuccess: (_, variables) => {
      toast.success('موسسه با موفقیت بروزرسانی شد');
      queryClient.invalidateQueries({ queryKey: ['institutions'] });
      queryClient.invalidateQueries({ queryKey: ['institution', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['institution-stats'] });
    },
    onError: (error: Error) => {
      toast.error(`خطا در بروزرسانی موسسه: ${error.message}`);
    },
  });
};

/**
 * Hook برای حذف موسسه
 */
export const useDeleteInstitution = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => institutionService.deleteInstitution(id),
    onSuccess: () => {
      toast.success('موسسه با موفقیت غیرفعال شد');
      queryClient.invalidateQueries({ queryKey: ['institutions'] });
      queryClient.invalidateQueries({ queryKey: ['institution-stats'] });
    },
    onError: (error: Error) => {
      toast.error(`خطا در غیرفعال کردن موسسه: ${error.message}`);
    },
  });
};

/**
 * Hook برای بازیابی موسسه
 */
export const useRestoreInstitution = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => institutionService.restoreInstitution(id),
    onSuccess: () => {
      toast.success('موسسه با موفقیت بازیابی شد');
      queryClient.invalidateQueries({ queryKey: ['institutions'] });
      queryClient.invalidateQueries({ queryKey: ['institution-stats'] });
    },
    onError: (error: Error) => {
      toast.error(`خطا در بازیابی موسسه: ${error.message}`);
    },
  });
};

/**
 * Hook برای دریافت دانش‌آموزان یک موسسه
 */
export const useInstitutionStudents = (id: string, page: number = 1, limit: number = 20) => {
  return useQuery({
    queryKey: ['institution-students', id, page, limit],
    queryFn: () => institutionService.getInstitutionStudents(id, page, limit),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 دقیقه
    refetchOnWindowFocus: false,
  });
}; 