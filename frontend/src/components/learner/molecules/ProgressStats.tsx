'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { LearnerProgress } from '@/services/api';
import { TrendingUp, Award, Target, BookOpen } from 'lucide-react';

interface ProgressStatsProps {
  progress: LearnerProgress;
}

/**
 * کامپوننت آمار پیشرفت فراگیر
 * Learner progress statistics component
 */
export default function ProgressStats({ progress }: ProgressStatsProps) {
  // محاسبه درصد موفقیت
  const successRate = progress.averageScore;
  
  return (
    <motion.div
      className="bg-white rounded-xl shadow-sm p-6"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* هدر */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            آمار پیشرفت
          </h3>
          <p className="text-sm text-gray-600">
            عملکرد کلی شما در آزمون‌ها
          </p>
        </div>
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-blue-600" />
        </div>
      </div>

      {/* نوار پیشرفت اصلی */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">میانگین نمرات</span>
          <span className="text-sm font-medium text-gray-900">
            {successRate.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <motion.div
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(successRate, 100)}%` }}
            transition={{ duration: 1, delay: 0.3 }}
          />
        </div>
      </div>

      {/* نقاط قوت و ضعف */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* نقاط قوت */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Award className="w-5 h-5 text-green-600" />
            <h4 className="text-sm font-medium text-gray-900">نقاط قوت</h4>
          </div>
          <div className="space-y-2">
            {progress.strongSubjects.length > 0 ? (
              progress.strongSubjects.slice(0, 3).map((subject, index) => (
                <motion.div
                  key={subject}
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">{subject}</span>
                </motion.div>
              ))
            ) : (
              <p className="text-sm text-gray-500">
                هنوز نقطه قوتی شناسایی نشده
              </p>
            )}
          </div>
        </div>

        {/* نقاط ضعف */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-5 h-5 text-orange-600" />
            <h4 className="text-sm font-medium text-gray-900">نیاز به تمرین</h4>
          </div>
          <div className="space-y-2">
            {progress.weakSubjects.length > 0 ? (
              progress.weakSubjects.slice(0, 3).map((subject, index) => (
                <motion.div
                  key={subject}
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                >
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">{subject}</span>
                </motion.div>
              ))
            ) : (
              <p className="text-sm text-gray-500">
                تمام موضوعات را به خوبی انجام می‌دهید
              </p>
            )}
          </div>
        </div>
      </div>

      {/* آمار سریع */}
      <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
        <div className="text-center">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-xl font-bold text-gray-900">
            {progress.totalExamsCompleted}
          </p>
          <p className="text-xs text-gray-600">آزمون کاملت</p>
        </div>
        
        <div className="text-center">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-xl font-bold text-gray-900">
            {Math.round(progress.totalTimeSpent / 60)}
          </p>
          <p className="text-xs text-gray-600">ساعت مطالعه</p>
        </div>
        
        <div className="text-center">
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <Award className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-xl font-bold text-gray-900">
            {successRate.toFixed(0)}%
          </p>
          <p className="text-xs text-gray-600">میانگین نمره</p>
        </div>
      </div>

      {/* اهداف پیشنهادی */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="text-sm font-medium text-blue-900 mb-2">
          هدف بعدی شما
        </h4>
        <p className="text-sm text-blue-700">
          {successRate < 70 
            ? 'تمرکز بر بهبود نمرات و تقویت نقاط ضعف'
            : successRate < 85
            ? 'ادامه روند مثبت و تکمیل آزمون‌های جدید'
            : 'عالی! می‌توانید آزمون‌های سطح بالاتر را امتحان کنید'
          }
        </p>
      </div>
    </motion.div>
  );
} 