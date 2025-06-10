/**
 * Custom hooks for Institutional Discount System
 * هوک‌های سفارشی برای سیستم تخفیف سازمانی
 */

import { useState, useEffect, useCallback } from 'react';
import { institutionalDiscountService } from '@/services/institutionalDiscountService';
import {
  InstitutionalDiscountGroup,
  DiscountGroupFilters,
  UploadDiscountFileRequest,
} from '@/types/institutionalDiscount';

interface UseDiscountGroupsResult {
  groups: InstitutionalDiscountGroup[];
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  } | null;
  fetchGroups: (filters?: DiscountGroupFilters) => Promise<void>;
  refreshGroups: () => Promise<void>;
}

/**
 * Hook for managing discount groups list
 */
export const useDiscountGroups = (initialFilters: DiscountGroupFilters = {}): UseDiscountGroupsResult => {
  const [groups, setGroups] = useState<InstitutionalDiscountGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<UseDiscountGroupsResult['pagination']>(null);
  const [currentFilters, setCurrentFilters] = useState(initialFilters);

  const fetchGroups = useCallback(async (filters: DiscountGroupFilters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const finalFilters = { ...currentFilters, ...filters };
      setCurrentFilters(finalFilters);
      
      const response = await institutionalDiscountService.getDiscountGroups(finalFilters);
      
      setGroups(response.data.groups);
      setPagination(response.data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در دریافت لیست گروه‌ها');
      setGroups([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  }, [currentFilters]);

  const refreshGroups = useCallback(() => {
    return fetchGroups(currentFilters);
  }, [fetchGroups, currentFilters]);

  useEffect(() => {
    fetchGroups(initialFilters);
  }, []);

  return {
    groups,
    loading,
    error,
    pagination,
    fetchGroups,
    refreshGroups,
  };
};

interface UseDiscountGroupResult {
  group: InstitutionalDiscountGroup | null;
  loading: boolean;
  error: string | null;
  fetchGroup: (id: string) => Promise<void>;
  refreshGroup: () => Promise<void>;
}

/**
 * Hook for managing single discount group
 */
export const useDiscountGroup = (groupId?: string): UseDiscountGroupResult => {
  const [group, setGroup] = useState<InstitutionalDiscountGroup | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentGroupId, setCurrentGroupId] = useState(groupId);

  const fetchGroup = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      setCurrentGroupId(id);
      
      const response = await institutionalDiscountService.getDiscountGroupById(id);
      setGroup(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در دریافت جزئیات گروه');
      setGroup(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshGroup = useCallback(() => {
    if (currentGroupId) {
      return fetchGroup(currentGroupId);
    }
    return Promise.resolve();
  }, [fetchGroup, currentGroupId]);

  useEffect(() => {
    if (groupId) {
      fetchGroup(groupId);
    }
  }, [groupId, fetchGroup]);

  return {
    group,
    loading,
    error,
    fetchGroup,
    refreshGroup,
  };
};

interface UseFileUploadResult {
  uploading: boolean;
  progress: number;
  error: string | null;
  success: boolean;
  uploadFile: (data: UploadDiscountFileRequest) => Promise<void>;
  resetState: () => void;
}

/**
 * Hook for file upload functionality
 */
export const useFileUpload = (): UseFileUploadResult => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const uploadFile = useCallback(async (data: UploadDiscountFileRequest) => {
    try {
      setUploading(true);
      setProgress(0);
      setError(null);
      setSuccess(false);

      // Simulate progress - in real implementation you might want to use XMLHttpRequest for actual progress tracking
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      await institutionalDiscountService.uploadDiscountFile(data);
      
      clearInterval(progressInterval);
      setProgress(100);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در بارگذاری فایل');
      setSuccess(false);
    } finally {
      setUploading(false);
    }
  }, []);

  const resetState = useCallback(() => {
    setUploading(false);
    setProgress(0);
    setError(null);
    setSuccess(false);
  }, []);

  return {
    uploading,
    progress,
    error,
    success,
    uploadFile,
    resetState,
  };
};

interface UseDiscountStatsResult {
  stats: {
    totalGroups: number;
    activeGroups: number;
    totalDiscountedUsers: number;
    processingGroups: number;
    failedGroups: number;
  } | null;
  loading: boolean;
  error: string | null;
  fetchStats: () => Promise<void>;
}

/**
 * Hook for discount statistics
 */
export const useDiscountStats = (): UseDiscountStatsResult => {
  const [stats, setStats] = useState<UseDiscountStatsResult['stats']>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await institutionalDiscountService.getDiscountStats();
      setStats(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در دریافت آمار');
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