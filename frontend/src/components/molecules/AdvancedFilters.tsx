'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QuestionFilters } from '@/services/api';
import { useDebounce } from '@/hooks/useDebounce';

interface AdvancedFiltersProps {
  searchTerm: string;
  filters: QuestionFilters;
  onSearchChange: (searchTerm: string) => void;
  onFiltersChange: (filters: Partial<QuestionFilters>) => void;
}

export default function AdvancedFilters({
  searchTerm,
  filters,
  onSearchChange,
  onFiltersChange,
}: AdvancedFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  // Debounce برای جستجو
  const debouncedSearch = useDebounce(localSearchTerm, 300);

  // ارسال تغییرات جستجو
  React.useEffect(() => {
    if (debouncedSearch !== searchTerm) {
      onSearchChange(debouncedSearch);
    }
  }, [debouncedSearch, searchTerm, onSearchChange]);

  const handleFilterChange = useCallback((key: keyof QuestionFilters, value: unknown) => {
    onFiltersChange({ [key]: value });
  }, [onFiltersChange]);

  const handleClearFilters = useCallback(() => {
    setLocalSearchTerm('');
    onSearchChange('');
    onFiltersChange({
      difficulty: '',
      type: '',
      category: '',
      isPublished: undefined,
    });
  }, [onSearchChange, onFiltersChange]);

  const hasActiveFilters = useMemo(() => {
    return !!(
      searchTerm ||
      filters.difficulty ||
      filters.type ||
      filters.category ||
      filters.isPublished !== undefined
    );
  }, [searchTerm, filters]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (searchTerm) count++;
    if (filters.difficulty) count++;
    if (filters.type) count++;
    if (filters.category) count++;
    if (filters.isPublished !== undefined) count++;
    return count;
  }, [searchTerm, filters]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200" dir="rtl">
      {/* Header */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* جستجوی اصلی */}
            <div className="relative flex-1 min-w-0">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={localSearchTerm}
                onChange={(e) => setLocalSearchTerm(e.target.value)}
                className="block w-full pr-10 pl-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="جستجو در سوالات..."
              />
            </div>

            {/* دکمه فیلترهای پیشرفته */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={`inline-flex items-center px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                hasActiveFilters
                  ? 'border-blue-500 text-blue-700 bg-blue-50'
                  : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
              }`}
            >
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              فیلترها
              {activeFiltersCount > 0 && (
                <span className="mr-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-blue-100 bg-blue-600 rounded-full">
                  {activeFiltersCount}
                </span>
              )}
              <motion.svg
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </motion.svg>
            </button>
          </div>

          {/* دکمه پاک کردن */}
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              پاک کردن همه
            </button>
          )}
        </div>
      </div>

      {/* فیلترهای پیشرفته */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="border-t border-gray-200 overflow-hidden"
          >
            <div className="px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* سطح سختی */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    سطح سختی
                  </label>
                  <select
                    value={filters.difficulty || ''}
                    onChange={(e) => handleFilterChange('difficulty', e.target.value || undefined)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    <option value="">همه سطوح</option>
                    <option value="easy">آسان</option>
                    <option value="medium">متوسط</option>
                    <option value="hard">سخت</option>
                  </select>
                </div>

                {/* نوع سوال */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    نوع سوال
                  </label>
                  <select
                    value={filters.type || ''}
                    onChange={(e) => handleFilterChange('type', e.target.value || undefined)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    <option value="">همه انواع</option>
                    <option value="multiple-choice">چندگزینه‌ای</option>
                    <option value="true-false">درست/غلط</option>
                    <option value="short-answer">پاسخ کوتاه</option>
                    <option value="essay">تشریحی</option>
                    <option value="fill-blank">جای خالی</option>
                  </select>
                </div>

                {/* دسته‌بندی */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    دسته‌بندی
                  </label>
                  <input
                    type="text"
                    value={filters.category || ''}
                    onChange={(e) => handleFilterChange('category', e.target.value || undefined)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="نام دسته‌بندی..."
                  />
                </div>

                {/* وضعیت انتشار */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    وضعیت انتشار
                  </label>
                  <select
                    value={filters.isPublished === undefined ? '' : filters.isPublished.toString()}
                    onChange={(e) => {
                      const value = e.target.value;
                      handleFilterChange(
                        'isPublished',
                        value === '' ? undefined : value === 'true'
                      );
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    <option value="">همه سوالات</option>
                    <option value="true">منتشر شده</option>
                    <option value="false">پیش‌نویس</option>
                  </select>
                </div>
              </div>

              {/* فیلترهای اضافی */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* محدودیت زمان */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      محدودیت زمان (ثانیه)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        placeholder="از"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                      <span className="text-gray-500">تا</span>
                      <input
                        type="number"
                        placeholder="تا"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                    </div>
                  </div>

                  {/* امتیاز */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      امتیاز
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        placeholder="از"
                        min="1"
                        max="100"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                      <span className="text-gray-500">تا</span>
                      <input
                        type="number"
                        placeholder="تا"
                        min="1"
                        max="100"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                    </div>
                  </div>

                  {/* تاریخ ایجاد */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      تاریخ ایجاد
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm">
                      <option value="">همه تاریخ‌ها</option>
                      <option value="today">امروز</option>
                      <option value="week">هفته گذشته</option>
                      <option value="month">ماه گذشته</option>
                      <option value="custom">سفارشی...</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* مرتب‌سازی */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      مرتب‌سازی بر اساس
                    </label>
                    <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm">
                      <option value="createdAt">تاریخ ایجاد</option>
                      <option value="updatedAt">تاریخ به‌روزرسانی</option>
                      <option value="difficulty">سطح سختی</option>
                      <option value="category">دسته‌بندی</option>
                      <option value="points">امتیاز</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ترتیب
                    </label>
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        صعودی
                      </button>
                      <button className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        نزولی
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* نمایش فیلترهای فعال */}
      {hasActiveFilters && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-gray-700">فیلترهای فعال:</span>
            
            {searchTerm && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                جستجو: &quot;{searchTerm}&quot;
                <button
                  onClick={() => {
                    setLocalSearchTerm('');
                    onSearchChange('');
                  }}
                  className="mr-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}
            
            {filters.difficulty && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                سختی: {filters.difficulty === 'easy' ? 'آسان' : filters.difficulty === 'medium' ? 'متوسط' : 'سخت'}
                <button
                  onClick={() => handleFilterChange('difficulty', '')}
                  className="mr-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}
            
            {filters.type && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                نوع: {filters.type === 'multiple-choice' ? 'چندگزینه‌ای' : 
                      filters.type === 'true-false' ? 'درست/غلط' :
                      filters.type === 'short-answer' ? 'پاسخ کوتاه' :
                      filters.type === 'essay' ? 'تشریحی' : 'جای خالی'}
                <button
                  onClick={() => handleFilterChange('type', '')}
                  className="mr-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}
            
            {filters.category && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                دسته: {filters.category}
                <button
                  onClick={() => handleFilterChange('category', '')}
                  className="mr-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}
            
            {filters.isPublished !== undefined && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                وضعیت: {filters.isPublished ? 'منتشر شده' : 'پیش‌نویس'}
                <button
                  onClick={() => handleFilterChange('isPublished', undefined)}
                  className="mr-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 