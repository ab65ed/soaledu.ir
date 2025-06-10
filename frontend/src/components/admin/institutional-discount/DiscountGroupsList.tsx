/**
 * Discount Groups List Component
 * کامپوننت لیست گروه‌های تخفیف سازمانی
 */

'use client';

import React, { useState } from 'react';
import { useDiscountGroups } from '@/hooks/useInstitutionalDiscount';
import { institutionalDiscountService } from '@/services/institutionalDiscountService';
import { InstitutionalDiscountGroup, DiscountGroupFilters } from '@/types/institutionalDiscount';

interface DiscountGroupsListProps {
  onGroupSelect?: (group: InstitutionalDiscountGroup) => void;
  refreshTrigger?: number;
}

export const DiscountGroupsList: React.FC<DiscountGroupsListProps> = ({
  onGroupSelect,
  refreshTrigger,
}) => {
  const [filters, setFilters] = useState<DiscountGroupFilters>({
    page: 1,
    limit: 10,
  });
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

  const { groups, loading, error, pagination, fetchGroups, refreshGroups } = useDiscountGroups(filters);

  // Refresh when trigger changes
  React.useEffect(() => {
    if (refreshTrigger !== undefined) {
      refreshGroups();
    }
  }, [refreshTrigger, refreshGroups]);

  const handleFilterChange = (newFilters: Partial<DiscountGroupFilters>) => {
    const updatedFilters = { ...filters, ...newFilters, page: 1 };
    setFilters(updatedFilters);
    fetchGroups(updatedFilters);
  };

  const handlePageChange = (page: number) => {
    const updatedFilters = { ...filters, page };
    setFilters(updatedFilters);
    fetchGroups(updatedFilters);
  };

  const handleDeleteGroup = async (groupId: string) => {
    if (!confirm('آیا از غیرفعال کردن این گروه تخفیف اطمینان دارید؟')) {
      return;
    }

    setDeletingIds(prev => new Set(prev).add(groupId));
    
    try {
      await institutionalDiscountService.deleteDiscountGroup(groupId);
      await refreshGroups();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'خطا در حذف گروه');
    } finally {
      setDeletingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(groupId);
        return newSet;
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', text: 'در انتظار' },
      processing: { color: 'bg-blue-100 text-blue-800', text: 'در حال پردازش' },
      completed: { color: 'bg-green-100 text-green-800', text: 'تکمیل شده' },
      failed: { color: 'bg-red-100 text-red-800', text: 'خطا' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDiscount = (group: InstitutionalDiscountGroup) => {
    if (group.discountPercentage) {
      return `${group.discountPercentage}%`;
    }
    if (group.discountAmount) {
      return `${group.discountAmount.toLocaleString()} تومان`;
    }
    return '-';
  };

  if (loading && groups.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6" dir="rtl">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md" dir="rtl">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            گروه‌های تخفیف سازمانی
          </h3>
          <button
            onClick={refreshGroups}
            disabled={loading}
            className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 disabled:opacity-50"
          >
            بروزرسانی
          </button>
        </div>

        {/* Filters */}
        <div className="flex space-x-4 space-x-reverse">
          <select
            value={filters.status || ''}
            onChange={(e) => handleFilterChange({ status: e.target.value as any || undefined })}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">همه وضعیت‌ها</option>
            <option value="pending">در انتظار</option>
            <option value="processing">در حال پردازش</option>
            <option value="completed">تکمیل شده</option>
            <option value="failed">خطا</option>
          </select>
          
          <select
            value={filters.limit}
            onChange={(e) => handleFilterChange({ limit: parseInt(e.target.value) })}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={10}>10 مورد</option>
            <option value={20}>20 مورد</option>
            <option value={50}>50 مورد</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border-b border-red-200 text-red-700">
          {error}
        </div>
      )}

      {groups.length === 0 && !loading ? (
        <div className="p-8 text-center text-gray-500">
          <svg className="mx-auto h-12 w-12 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p>هیچ گروه تخفیفی یافت نشد</p>
        </div>
      ) : (
        <>
          {/* Groups List */}
          <div className="divide-y divide-gray-200">
            {groups.map((group) => (
              <div key={group._id} className="p-6 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 space-x-reverse mb-2">
                      <h4 className="text-md font-medium text-gray-900">
                        {group.groupName || `گروه ${group._id.slice(-6)}`}
                      </h4>
                      {getStatusBadge(group.status)}
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                      <div>
                        <span className="font-medium">تخفیف:</span> {formatDiscount(group)}
                      </div>
                      <div>
                        <span className="font-medium">کل رکوردها:</span> {group.totalUsersInFile}
                      </div>
                      <div>
                        <span className="font-medium">تطبیق یافته:</span> {group.matchedUsersCount}
                      </div>
                      <div>
                        <span className="font-medium">نامعتبر:</span> {group.invalidDataCount}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 space-x-reverse text-sm text-gray-500">
                      <span>توسط: {group.uploadedBy.name}</span>
                      <span>•</span>
                      <span>{formatDate(group.uploadDate)}</span>
                      {group.fileName && (
                        <>
                          <span>•</span>
                          <span>{group.fileName}</span>
                        </>
                      )}
                    </div>

                    {/* Error Log Preview */}
                    {group.status === 'failed' && group.errorLog.length > 0 && (
                      <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-sm">
                        <div className="text-red-700 font-medium mb-1">خطاها:</div>
                        <div className="text-red-600">
                          {group.errorLog.slice(0, 2).map((error, index) => (
                            <div key={index}>• {error}</div>
                          ))}
                          {group.errorLog.length > 2 && (
                            <div className="text-red-500">... و {group.errorLog.length - 2} خطای دیگر</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 space-x-reverse mr-4">
                    <button
                      onClick={() => onGroupSelect?.(group)}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      جزئیات
                    </button>
                    <button
                      onClick={() => handleDeleteGroup(group._id)}
                      disabled={deletingIds.has(group._id)}
                      className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                    >
                      {deletingIds.has(group._id) ? 'در حال حذف...' : 'حذف'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="p-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  نمایش {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} تا{' '}
                  {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} از{' '}
                  {pagination.totalItems} مورد
                </div>
                
                <div className="flex items-center space-x-2 space-x-reverse">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage <= 1 || loading}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                  >
                    قبلی
                  </button>
                  
                  <div className="flex items-center space-x-1 space-x-reverse">
                    {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                      const page = i + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          disabled={loading}
                          className={`px-3 py-1 text-sm rounded-md ${
                            page === pagination.currentPage
                              ? 'bg-blue-600 text-white'
                              : 'border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>
                  
                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage >= pagination.totalPages || loading}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                  >
                    بعدی
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}; 