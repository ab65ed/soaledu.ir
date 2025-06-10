'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { questionService, QuestionFilters } from '@/services/api';
import { useDebounce } from '@/hooks/useDebounce';
import QuestionForm from '@/components/molecules/QuestionForm';
import QuestionAccordion from '@/components/molecules/QuestionAccordion';
import AdvancedFilters from '@/components/molecules/AdvancedFilters';
import ActivityLogViewer from '@/components/molecules/ActivityLogViewer';
import Toast from '@/components/atoms/Toast';
import { useAuthStatus } from '@/hooks/useAuth';

interface QuestionsPageState {
  selectedQuestionId: string | null;
  isFormOpen: boolean;
  searchTerm: string;
  filters: QuestionFilters;
  currentPage: number;
  showActivityLog: boolean;
}

const ITEMS_PER_PAGE = 10;



export default function QuestionsPage() {
  const { user } = useAuthStatus();
  const [state, setState] = useState<QuestionsPageState>({
    selectedQuestionId: null,
    isFormOpen: false,
    searchTerm: '',
    filters: {
      difficulty: '',
      type: '',
      category: '',
      isPublished: undefined,
      limit: ITEMS_PER_PAGE,
      skip: 0,
    },
    currentPage: 1,
    showActivityLog: false,
  });

  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error' | 'info';
  }>({
    show: false,
    message: '',
    type: 'success',
  });

  // Debounce برای جستجو
  const debouncedSearchTerm = useDebounce(state.searchTerm, 300);

  // Query برای دریافت سوالات
  const {
    data: questionsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['questions', state.filters, debouncedSearchTerm, state.currentPage],
    queryFn: () => questionService.fetchQuestions({
      ...state.filters,
      search: debouncedSearchTerm,
      skip: (state.currentPage - 1) * ITEMS_PER_PAGE,
    }),
    staleTime: 1000 * 60 * 5, // 5 دقیقه
  });

  // Handler functions
  const handleStateUpdate = useCallback((updates: Partial<QuestionsPageState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const handleSearchChange = useCallback((searchTerm: string) => {
    handleStateUpdate({ searchTerm, currentPage: 1 });
  }, [handleStateUpdate]);

  const handleFiltersChange = useCallback((filters: Partial<QuestionFilters>) => {
    handleStateUpdate({ 
      filters: { ...state.filters, ...filters },
      currentPage: 1,
    });
  }, [state.filters, handleStateUpdate]);

  const handlePageChange = useCallback((page: number) => {
    handleStateUpdate({ currentPage: page });
  }, [handleStateUpdate]);

  const handleCreateQuestion = useCallback(() => {
    handleStateUpdate({ selectedQuestionId: null, isFormOpen: true });
  }, [handleStateUpdate]);

  const handleEditQuestion = useCallback((questionId: string) => {
    handleStateUpdate({ selectedQuestionId: questionId, isFormOpen: true });
  }, [handleStateUpdate]);

  const handleCloseForm = useCallback(() => {
    handleStateUpdate({ isFormOpen: false, selectedQuestionId: null });
  }, [handleStateUpdate]);

  const handleFormSuccess = useCallback((message: string) => {
    setToast({ show: true, message, type: 'success' });
    handleCloseForm();
    refetch();
  }, [handleCloseForm, refetch]);

  const handleDeleteQuestion = useCallback(async (questionId: string) => {
    if (!confirm('آیا از حذف این سوال اطمینان دارید؟')) return;
    
    try {
      await questionService.deleteQuestion(questionId);
      setToast({ show: true, message: 'سوال با موفقیت حذف شد', type: 'success' });
      refetch();
    } catch {
      setToast({ 
        show: true, 
        message: 'خطا در حذف سوال', 
        type: 'error' 
      });
    }
  }, [refetch]);

  const handlePublishToggle = useCallback(async (questionId: string, isPublished: boolean) => {
    try {
      if (isPublished) {
        await questionService.unpublishQuestion(questionId);
        setToast({ show: true, message: 'سوال از انتشار خارج شد', type: 'info' });
      } else {
        await questionService.publishQuestion(questionId);
        setToast({ show: true, message: 'سوال منتشر شد', type: 'success' });
      }
      refetch();
    } catch {
      setToast({ 
        show: true, 
        message: 'خطا در تغییر وضعیت انتشار', 
        type: 'error' 
      });
    }
  }, [refetch]);

  // Memoized values
  const questions = useMemo(() => questionsData?.questions || [], [questionsData?.questions]);
  const pagination = useMemo(() => questionsData?.pagination, [questionsData?.pagination]);
  const totalPages = useMemo(() => 
    pagination ? Math.ceil(pagination.total / ITEMS_PER_PAGE) : 1, 
    [pagination]
  );

  // Permission checks
  const canCreate = user?.role === 'admin' || user?.role === 'designer';
  const canEdit = user?.role === 'admin' || user?.role === 'designer';
  const canDelete = user?.role === 'admin';
  const canViewActivityLog = user?.role === 'admin' || user?.role === 'expert';

  return (
    <div className="min-h-screen bg-gray-50 p-6" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                مدیریت سوالات
              </h1>
              <p className="text-gray-600">
                ایجاد، ویرایش و مدیریت سوالات آزمون‌ها
              </p>
            </div>
            
            <div className="flex gap-4">
              {canViewActivityLog && (
                <button
                  onClick={() => handleStateUpdate({ showActivityLog: !state.showActivityLog })}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  {state.showActivityLog ? 'پنهان کردن' : 'نمایش'} گزارش فعالیت
                </button>
              )}
              
              {canCreate && (
                <button
                  onClick={handleCreateQuestion}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  + سوال جدید
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Activity Log */}
        {state.showActivityLog && canViewActivityLog && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8"
          >
            <ActivityLogViewer />
          </motion.div>
        )}

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <AdvancedFilters
            searchTerm={state.searchTerm}
            filters={state.filters}
            onSearchChange={handleSearchChange}
            onFiltersChange={handleFiltersChange}
          />
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Questions List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    فهرست سوالات
                  </h2>
                  {pagination && (
                    <div className="text-sm text-gray-500">
                      نمایش {pagination.count} از {pagination.total} سوال
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="mr-3 text-gray-600">در حال بارگذاری...</span>
                  </div>
                ) : error ? (
                  <div className="text-center py-12">
                    <div className="text-red-600 mb-4">خطا در بارگذاری سوالات</div>
                    <button
                      onClick={() => refetch()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      تلاش مجدد
                    </button>
                  </div>
                ) : questions.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-500 mb-4">هیچ سوالی یافت نشد</div>
                    {canCreate && (
                      <button
                        onClick={handleCreateQuestion}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        ایجاد اولین سوال
                      </button>
                    )}
                  </div>
                ) : (
                  <>
                    <QuestionAccordion
                      questions={questions}
                      onEdit={canEdit ? handleEditQuestion : undefined}
                      onDelete={canDelete ? handleDeleteQuestion : undefined}
                      onPublishToggle={canEdit ? handlePublishToggle : undefined}
                    />

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="mt-6 flex items-center justify-center">
                        <nav className="flex items-center space-x-2 space-x-reverse">
                          <button
                            onClick={() => handlePageChange(state.currentPage - 1)}
                            disabled={state.currentPage === 1}
                            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            قبلی
                          </button>
                          
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                              key={page}
                              onClick={() => handlePageChange(page)}
                              className={`px-3 py-2 text-sm font-medium rounded-md ${
                                state.currentPage === page
                                  ? 'bg-blue-600 text-white'
                                  : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              {page}
                            </button>
                          ))}
                          
                          <button
                            onClick={() => handlePageChange(state.currentPage + 1)}
                            disabled={state.currentPage === totalPages}
                            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            بعدی
                          </button>
                        </nav>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </motion.div>

          {/* Question Form */}
          {state.isFormOpen && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-1"
            >
              <QuestionForm
                questionId={state.selectedQuestionId}
                onSuccess={handleFormSuccess}
                onCancel={handleCloseForm}
              />
            </motion.div>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
} 