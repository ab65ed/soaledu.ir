'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { adminService } from '@/services/api';
import { useAuthStatus } from '@/hooks/useAuth';

interface ActivityLogViewerProps {
  maxHeight?: string;
  showFilters?: boolean;
}

interface LogFilters {
  action?: string;
  level?: 'info' | 'warning' | 'error';
  startDate?: string;
  endDate?: string;
  userId?: string;
}

export default function ActivityLogViewer({ 
  maxHeight = 'max-h-96', 
  showFilters = true 
}: ActivityLogViewerProps) {
  const { user } = useAuthStatus();
  const [filters, setFilters] = useState<LogFilters>({});
  const [isExpanded, setIsExpanded] = useState(false);

  // Query برای دریافت گزارش فعالیت‌ها
  const {
    data: logsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['activity-logs', filters],
    queryFn: () => adminService.getActivityLogs({
      ...filters,
      limit: 50,
      skip: 0,
    }),
    enabled: !!(user?.role === 'admin' || user?.role === 'expert'),
    staleTime: 1000 * 60 * 2, // 2 دقیقه
  });

  const handleFilterChange = useCallback((key: keyof LogFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined,
    }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({});
  }, []);

  const hasActiveFilters = useMemo(() => {
    return Object.values(filters).some(value => value !== undefined && value !== '');
  }, [filters]);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error':
        return 'text-red-600 bg-red-100';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100';
      case 'info':
      default:
        return 'text-blue-600 bg-blue-100';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'error':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      case 'info':
      default:
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const getActionIcon = (action: string) => {
    if (action.includes('create') || action.includes('add')) {
      return (
        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      );
    }
    if (action.includes('update') || action.includes('edit')) {
      return (
        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      );
    }
    if (action.includes('delete') || action.includes('remove')) {
      return (
        <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      );
    }
    if (action.includes('login') || action.includes('auth')) {
      return (
        <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
        </svg>
      );
    }
    return (
      <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    );
  };

  if (!(user?.role === 'admin' || user?.role === 'expert')) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 text-center" dir="rtl">
        <div className="text-gray-500">
          شما مجوز مشاهده گزارش فعالیت‌ها را ندارید
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200" dir="rtl">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900">گزارش فعالیت‌ها</h3>
            {logsData?.pagination && (
              <span className="text-sm text-gray-500">
                ({logsData.pagination.total} فعالیت)
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => refetch()}
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
              title="بروزرسانی"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            
            {showFilters && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                  hasActiveFilters
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                فیلترها
                {hasActiveFilters && (
                  <span className="mr-1 bg-blue-600 text-white rounded-full px-1 text-xs">
                    {Object.values(filters).filter(v => v).length}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filters */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-b border-gray-200 overflow-hidden"
          >
            <div className="px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    نوع فعالیت
                  </label>
                  <input
                    type="text"
                    value={filters.action || ''}
                    onChange={(e) => handleFilterChange('action', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="جستجو در فعالیت‌ها..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    سطح
                  </label>
                  <select
                    value={filters.level || ''}
                    onChange={(e) => handleFilterChange('level', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    <option value="">همه سطوح</option>
                    <option value="info">اطلاعات</option>
                    <option value="warning">هشدار</option>
                    <option value="error">خطا</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    از تاریخ
                  </label>
                  <input
                    type="date"
                    value={filters.startDate || ''}
                    onChange={(e) => handleFilterChange('startDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    تا تاریخ
                  </label>
                  <input
                    type="date"
                    value={filters.endDate || ''}
                    onChange={(e) => handleFilterChange('endDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
              </div>
              
              {hasActiveFilters && (
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={handleClearFilters}
                    className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    پاک کردن فیلترها
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <div className={`${maxHeight} overflow-y-auto`}>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="mr-3 text-gray-600">در حال بارگذاری...</span>
          </div>
        ) : error ? (
          <div className="p-6 text-center">
            <div className="text-red-600 mb-2">خطا در بارگذاری گزارش فعالیت‌ها</div>
            <button
              onClick={() => refetch()}
              className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              تلاش مجدد
            </button>
          </div>
        ) : !logsData?.logs || logsData.logs.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            هیچ فعالیتی ثبت نشده است
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {logsData.logs.map((log, index) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  {/* آیکون سطح */}
                  <div className={`flex-shrink-0 p-1 rounded-full ${getLevelColor(log.level)}`}>
                    {getLevelIcon(log.level)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        {getActionIcon(log.action)}
                        <span className="font-medium text-gray-900 text-sm">
                          {log.action}
                        </span>
                      </div>
                      
                      <div className="text-xs text-gray-500">
                        {new Date(log.timestamp).toLocaleString('fa-IR')}
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-700 mb-2">
                      {log.description}
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>کاربر: {log.userName}</span>
                      {log.ipAddress && (
                        <span>IP: {log.ipAddress}</span>
                      )}
                      {log.userAgent && (
                        <span 
                          className="truncate max-w-xs"
                          title={log.userAgent}
                        >
                          مرورگر: {log.userAgent.split(' ')[0]}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {logsData?.logs && logsData.logs.length > 0 && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 text-center">
          <span className="text-sm text-gray-600">
            نمایش {logsData.logs.length} مورد از {logsData.pagination?.total || 0} فعالیت
          </span>
        </div>
      )}
    </div>
  );
} 