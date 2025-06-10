'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { FixedSizeList as List } from 'react-window';
import { questionService, Question } from '@/services/api';
import { useDebounce } from '@/hooks/useDebounce';

interface QuestionSelectorProps {
  selectedQuestions: string[];
  onQuestionsChange: (questions: string[]) => void;
  filters?: {
    courseType?: string;
    grade?: string;
    difficulty?: string;
  };
}

interface QuestionItemProps {
  index: number;
  style: React.CSSProperties;
  data: {
    questions: Question[];
    selectedQuestions: string[];
    onToggleQuestion: (questionId: string) => void;
    abTestVariant: 'A' | 'B';
  };
}

// A/B Testing Configuration
// نسخه A: نمایش کامل سوال
// نسخه B: نمایش خلاصه سوال
const AB_TEST_CONFIG = {
  A: {
    showFullText: true,
    showDifficulty: true,
    showCategory: true,
    cardHeight: 120,
  },
  B: {
    showFullText: false,
    showDifficulty: false,
    showCategory: false,
    cardHeight: 80,
  },
};

// کامپوننت آیتم سوال برای Virtualization
const QuestionItem: React.FC<QuestionItemProps> = ({ index, style, data }) => {
  const { questions, selectedQuestions, onToggleQuestion, abTestVariant } = data;
  const question = questions[index];
  const isSelected = selectedQuestions.includes(question.id);
  const config = AB_TEST_CONFIG[abTestVariant];

  if (!question) return null;

  return (
    <div style={style}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: index * 0.02 }}
        className={`
          m-2 p-4 border-2 rounded-lg cursor-pointer transition-all
          ${isSelected
            ? 'border-blue-500 bg-blue-50 shadow-md'
            : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'
          }
        `}
        onClick={() => onToggleQuestion(question.id)}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {/* عنوان سوال */}
            <h4 className="font-medium text-gray-900 mb-2">
              {config.showFullText 
                ? question.text 
                : question.text.length > 60 
                  ? `${question.text.substring(0, 60)}...` 
                  : question.text
              }
            </h4>

            {/* اطلاعات اضافی برای نسخه A */}
            {config.showCategory && question.category && (
              <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded mb-2">
                {question.category}
              </span>
            )}

            {config.showDifficulty && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">سطح سختی:</span>
                <span className={`
                  text-sm font-medium
                  ${question.difficulty === 'easy' ? 'text-green-600' : 
                    question.difficulty === 'medium' ? 'text-yellow-600' : 'text-red-600'}
                `}>
                  {question.difficulty === 'easy' ? 'آسان' : 
                   question.difficulty === 'medium' ? 'متوسط' : 'سخت'}
                </span>
              </div>
            )}
          </div>

          {/* چک‌باکس */}
          <div className={`
            w-6 h-6 rounded border-2 flex items-center justify-center
            ${isSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}
          `}>
            {isSelected && (
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default function QuestionSelector({ 
  selectedQuestions, 
  onQuestionsChange, 
  filters = {} 
}: QuestionSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [localFilters, setLocalFilters] = useState({
    difficulty: '',
    type: '',
    category: '',
  });
  
  // A/B Testing: تعیین نسخه بر اساس user ID یا random
  const [abTestVariant] = useState<'A' | 'B'>(() => {
    // در production از user ID استفاده کنید
    return Math.random() > 0.5 ? 'A' : 'B';
  });

  // Debounce برای جستجو
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Query برای دریافت سوالات
  const {
    data: questionsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['questions', filters, localFilters, debouncedSearchTerm],
         queryFn: () => questionService.fetchQuestions({
       search: debouncedSearchTerm,
       difficulty: localFilters.difficulty || filters.difficulty,
       type: localFilters.type,
       category: localFilters.category,
       isPublished: true,
       limit: 100, // محدودیت برای بهینه‌سازی
     }),
    staleTime: 1000 * 60 * 5, // 5 دقیقه
  });

  // Memoized questions list
  const questions = useMemo(() => {
    return questionsData?.questions || [];
  }, [questionsData?.questions]);

  // تابع toggle کردن سوال
  const handleToggleQuestion = useCallback((questionId: string) => {
    const newSelected = selectedQuestions.includes(questionId)
      ? selectedQuestions.filter(id => id !== questionId)
      : [...selectedQuestions, questionId];
    
    onQuestionsChange(newSelected);
  }, [selectedQuestions, onQuestionsChange]);

  // تابع انتخاب همه سوالات
  const handleSelectAll = useCallback(() => {
    const allQuestionIds = questions.map(q => q.id);
    onQuestionsChange(allQuestionIds);
  }, [questions, onQuestionsChange]);

  // تابع پاک کردن انتخاب‌ها
  const handleClearAll = useCallback(() => {
    onQuestionsChange([]);
  }, [onQuestionsChange]);

  // داده‌های برای Virtualized List
  const listData = useMemo(() => ({
    questions,
    selectedQuestions,
    onToggleQuestion: handleToggleQuestion,
    abTestVariant,
  }), [questions, selectedQuestions, handleToggleQuestion, abTestVariant]);

  const config = AB_TEST_CONFIG[abTestVariant];

  return (
    <div className="space-y-6">
      {/* هدر و آمار */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            انتخاب سوالات
          </h3>
          <p className="text-sm text-gray-500">
            {selectedQuestions.length} از {questions.length} سوال انتخاب شده
          </p>
        </div>
        
        {/* دکمه‌های عملیات */}
        <div className="flex gap-2">
          <button
            onClick={handleSelectAll}
            disabled={questions.length === 0}
            className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            انتخاب همه
          </button>
          <button
            onClick={handleClearAll}
            disabled={selectedQuestions.length === 0}
            className="px-4 py-2 text-sm bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50"
          >
            پاک کردن
          </button>
        </div>
      </div>

      {/* جستجو و فیلترها */}
      <div className="grid md:grid-cols-4 gap-4">
        {/* جستجو */}
        <div className="md:col-span-2">
          <input
            type="text"
            placeholder="جستجو در سوالات..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* فیلتر سطح سختی */}
        <div>
          <select
            value={localFilters.difficulty}
            onChange={(e) => setLocalFilters(prev => ({ ...prev, difficulty: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">همه سطوح</option>
            <option value="easy">آسان</option>
            <option value="medium">متوسط</option>
            <option value="hard">سخت</option>
          </select>
        </div>

        {/* فیلتر نوع سوال */}
        <div>
          <select
            value={localFilters.type}
            onChange={(e) => setLocalFilters(prev => ({ ...prev, type: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">همه انواع</option>
            <option value="multiple-choice">چندگزینه‌ای</option>
            <option value="true-false">درست/غلط</option>
            <option value="short-answer">پاسخ کوتاه</option>
          </select>
        </div>
      </div>

      {/* لیست سوالات */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-500">در حال بارگذاری سوالات...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">
            خطا در بارگذاری سوالات
          </div>
        ) : questions.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            سوالی یافت نشد
          </div>
        ) : (
                     <div className="h-96">
             <List
               height={384} // 96 * 4 = 384px
               width="100%"
               itemCount={questions.length}
               itemSize={config.cardHeight}
               itemData={listData}
               overscanCount={5} // بهینه‌سازی عملکرد
             >
               {QuestionItem}
             </List>
           </div>
        )}
      </div>

      {/* A/B Testing Debug Info (فقط در development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            A/B Test Variant: {abTestVariant} 
            {abTestVariant === 'A' ? ' (نمایش کامل)' : ' (نمایش خلاصه)'}
          </p>
        </div>
      )}
    </div>
  );
} 