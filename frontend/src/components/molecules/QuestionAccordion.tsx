'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Question } from '@/services/api';

interface QuestionAccordionProps {
  questions: Question[];
  onEdit?: (questionId: string) => void;
  onDelete?: (questionId: string) => void;
  onPublishToggle?: (questionId: string, isPublished: boolean) => void;
}

interface AccordionItemProps {
  question: Question;
  isOpen: boolean;
  onToggle: () => void;
  onEdit?: (questionId: string) => void;
  onDelete?: (questionId: string) => void;
  onPublishToggle?: (questionId: string, isPublished: boolean) => void;
}

const AccordionItem: React.FC<AccordionItemProps> = ({
  question,
  isOpen,
  onToggle,
  onEdit,
  onDelete,
  onPublishToggle,
}) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-600 bg-green-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'hard':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'آسان';
      case 'medium':
        return 'متوسط';
      case 'hard':
        return 'سخت';
      default:
        return 'نامشخص';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'multiple-choice':
        return 'چندگزینه‌ای';
      case 'true-false':
        return 'درست/غلط';
      case 'short-answer':
        return 'پاسخ کوتاه';
      case 'essay':
        return 'تشریحی';
      case 'fill-blank':
        return 'جای خالی';
      default:
        return 'نامشخص';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-gray-200 rounded-lg mb-3 overflow-hidden"
    >
      {/* Header */}
      <div
        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-medium text-gray-900 line-clamp-1">
                {question.text.length > 80 
                  ? `${question.text.substring(0, 80)}...` 
                  : question.text
                }
              </h3>
              
              {/* وضعیت انتشار */}
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                question.isPublished 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {question.isPublished ? 'منتشر شده' : 'پیش‌نویس'}
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className={`px-2 py-1 rounded-full text-xs ${getDifficultyColor(question.difficulty)}`}>
                {getDifficultyText(question.difficulty)}
              </span>
              
              <span>{getTypeText(question.type)}</span>
              
              {question.category && (
                <span>دسته: {question.category}</span>
              )}
              
              {question.points && (
                <span>امتیاز: {question.points}</span>
              )}
              
              <span className="text-xs">
                {new Date(question.createdAt).toLocaleDateString('fa-IR')}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* دکمه‌های عمل */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {onEdit && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(question.id);
                  }}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  title="ویرایش"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              )}
              
              {onPublishToggle && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onPublishToggle(question.id, question.isPublished || false);
                  }}
                  className={`p-2 rounded transition-colors ${
                    question.isPublished
                      ? 'text-gray-600 hover:bg-gray-50'
                      : 'text-green-600 hover:bg-green-50'
                  }`}
                  title={question.isPublished ? 'عدم انتشار' : 'انتشار'}
                >
                  {question.isPublished ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 01.814-2.139m5.651.908A3 3 0 1019.5 12M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              )}
              
              {onDelete && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(question.id);
                  }}
                  className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                  title="حذف"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
            
            {/* آیکون باز/بسته */}
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="text-gray-400"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="border-t border-gray-200"
          >
            <div className="p-4 bg-gray-50">
              {/* متن کامل سوال */}
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">متن سوال:</h4>
                <p className="text-gray-700 leading-relaxed">{question.text}</p>
              </div>

              {/* گزینه‌ها برای سوالات چندگزینه‌ای */}
              {question.type === 'multiple-choice' && question.options && (
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">گزینه‌ها:</h4>
                  <div className="space-y-2">
                    {question.options.map((option, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border ${
                          question.correctOptions?.includes(index)
                            ? 'bg-green-50 border-green-200'
                            : 'bg-white border-gray-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-gray-700">
                            {index + 1}. {option}
                          </span>
                          {question.correctOptions?.includes(index) && (
                            <span className="text-green-600 text-sm font-medium">
                              ✓ صحیح
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* پاسخ صحیح برای سوالات درست/غلط */}
              {question.type === 'true-false' && question.correctAnswer !== undefined && (
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">پاسخ صحیح:</h4>
                  <div className={`inline-block px-3 py-1 rounded-lg ${
                    question.correctAnswer ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {question.correctAnswer ? 'درست' : 'غلط'}
                  </div>
                </div>
              )}

              {/* توضیحات */}
              {question.explanation && (
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">توضیحات:</h4>
                  <p className="text-gray-700 bg-blue-50 p-3 rounded-lg">{question.explanation}</p>
                </div>
              )}

              {/* برچسب‌ها */}
              {question.tags && question.tags.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">برچسب‌ها:</h4>
                  <div className="flex flex-wrap gap-2">
                    {question.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* اطلاعات تکمیلی */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                {question.lesson && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">درس:</span>
                    <span className="text-sm text-gray-900 mr-2">{question.lesson}</span>
                  </div>
                )}
                
                {question.timeLimit && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">محدودیت زمان:</span>
                    <span className="text-sm text-gray-900 mr-2">{question.timeLimit} ثانیه</span>
                  </div>
                )}
                
                {question.sourceBook && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">کتاب منبع:</span>
                    <span className="text-sm text-gray-900 mr-2">{question.sourceBook}</span>
                  </div>
                )}
                
                {question.sourceChapter && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">فصل:</span>
                    <span className="text-sm text-gray-900 mr-2">{question.sourceChapter}</span>
                  </div>
                )}
                
                {question.sourcePage && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">صفحه:</span>
                    <span className="text-sm text-gray-900 mr-2">{question.sourcePage}</span>
                  </div>
                )}
                
                {question.authorId && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">نویسنده:</span>
                    <span className="text-sm text-gray-900 mr-2">{question.authorId}</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default function QuestionAccordion({
  questions,
  onEdit,
  onDelete,
  onPublishToggle,
}: QuestionAccordionProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const handleToggle = useCallback((questionId: string) => {
    setOpenItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  }, []);

  const handleExpandAll = useCallback(() => {
    setOpenItems(new Set(questions.map(q => q.id)));
  }, [questions]);

  const handleCollapseAll = useCallback(() => {
    setOpenItems(new Set());
  }, []);

  if (questions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        هیچ سوالی برای نمایش وجود ندارد
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* کنترل‌های آکاردئون */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {questions.length} سوال
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={handleExpandAll}
            className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            باز کردن همه
          </button>
          <span className="text-gray-300">|</span>
          <button
            onClick={handleCollapseAll}
            className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            بستن همه
          </button>
        </div>
      </div>

      {/* آیتم‌های آکاردئون */}
      <div className="space-y-2">
        {questions.map((question, index) => (
          <motion.div
            key={question.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group"
          >
            <AccordionItem
              question={question}
              isOpen={openItems.has(question.id)}
              onToggle={() => handleToggle(question.id)}
              onEdit={onEdit}
              onDelete={onDelete}
              onPublishToggle={onPublishToggle}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
} 