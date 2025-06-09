'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { LearnerExam } from '@/services/api';
import { 
  Star, 
  Clock, 
  BookOpen, 
  TrendingUp, 
  ShoppingCart,
  Play,
  ChevronLeft
} from 'lucide-react';

interface ExamRecommendationsProps {
  recommendations: LearnerExam[];
}

/**
 * کامپوننت پیشنهادهای آزمون برای فراگیر
 * Exam recommendations component for learner
 */
export default function ExamRecommendations({ recommendations }: ExamRecommendationsProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-600';
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'not-started':
        return 'bg-gray-100 text-gray-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'تکمیل شده';
      case 'in-progress':
        return 'در حال انجام';
      case 'not-started':
        return 'آماده شروع';
      default:
        return 'نامشخص';
    }
  };

  return (
    <motion.div
      className="bg-white rounded-xl shadow-sm p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.4 }}
    >
      {/* هدر */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            آزمون‌های پیشنهادی
          </h3>
          <p className="text-sm text-gray-600">
            بر اساس عملکرد و علاقه‌مندی‌های شما
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
            <Star className="w-5 h-5 text-yellow-600" />
          </div>
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            مشاهده همه
          </button>
        </div>
      </div>

      {recommendations.length > 0 ? (
        <>
          {/* لیست آزمون‌های پیشنهادی */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {recommendations.slice(0, 6).map((exam, index) => (
              <motion.div
                key={exam.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ y: -2 }}
              >
                {/* هدر کارت */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
                      {exam.title}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {exam.courseType} • {exam.grade}
                    </p>
                  </div>
                  <div className="flex-shrink-0 mr-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(exam.difficulty)}`}>
                      {getDifficultyText(exam.difficulty)}
                    </span>
                  </div>
                </div>

                {/* اطلاعات آزمون */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <BookOpen className="w-3 h-3" />
                    <span>{exam.totalQuestions} سوال</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Clock className="w-3 h-3" />
                    <span>تخمین زمان: {Math.round(exam.totalQuestions * 1.5)} دقیقه</span>
                  </div>

                  {exam.score !== undefined && (
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Star className="w-3 h-3" />
                      <span>نمره قبلی: {exam.score}/{exam.maxScore}</span>
                    </div>
                  )}
                </div>

                {/* وضعیت و قیمت */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(exam.status)}`}>
                    {getStatusText(exam.status)}
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {exam.price === 0 ? 'رایگان' : `${exam.price.toLocaleString('fa-IR')} تومان`}
                  </span>
                </div>

                {/* دکمه‌های عمل */}
                <div className="flex gap-2">
                  {exam.status === 'not-started' ? (
                    <>
                      {exam.price > 0 ? (
                        <button className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-1">
                          <ShoppingCart className="w-3 h-3" />
                          خرید
                        </button>
                      ) : (
                        <button className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg text-xs font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-1">
                          <Play className="w-3 h-3" />
                          شروع
                        </button>
                      )}
                    </>
                  ) : exam.status === 'in-progress' ? (
                    <button className="flex-1 bg-yellow-600 text-white px-3 py-2 rounded-lg text-xs font-medium hover:bg-yellow-700 transition-colors flex items-center justify-center gap-1">
                      <Play className="w-3 h-3" />
                      ادامه
                    </button>
                  ) : (
                    <button className="flex-1 bg-gray-100 text-gray-600 px-3 py-2 rounded-lg text-xs font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      مشاهده نتیجه
                    </button>
                  )}
                  
                  <button className="px-3 py-2 border border-gray-300 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                    جزئیات
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* دکمه مشاهده بیشتر */}
          {recommendations.length > 6 && (
            <div className="text-center">
              <button className="inline-flex items-center gap-2 px-6 py-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium">
                مشاهده {recommendations.length - 6} آزمون بیشتر
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            پیشنهادی برای شما نداریم
          </h3>
          <p className="text-gray-500 mb-6">
            ابتدا چند آزمون انجام دهید تا بتوانیم آزمون‌های مناسب را پیشنهاد کنیم
          </p>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
            مشاهده همه آزمون‌ها
          </button>
        </div>
      )}

      {/* نکات مفید */}
      {recommendations.length > 0 && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="text-sm font-medium text-blue-900 mb-2 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            نکته مفید
          </h4>
          <p className="text-sm text-blue-700">
            آزمون‌های پیشنهادی بر اساس سطح مهارت، علاقه‌مندی و عملکرد قبلی شما انتخاب شده‌اند. 
            برای بهترین نتیجه، از آسان شروع کرده و به تدریج به سطح بالاتر بروید.
          </p>
        </div>
      )}
    </motion.div>
  );
} 