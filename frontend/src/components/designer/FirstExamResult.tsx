'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ChartBarIcon,
  AcademicCapIcon,
  TrophyIcon,
  ClockIcon,
  UserGroupIcon,
  StarIcon,
  ArrowTrendingUpIcon,
  ChartPieIcon
} from '@heroicons/react/24/outline';

// انواع داده‌ها برای نتیجه اولین آزمون
interface FirstExamResult {
  examId: string;
  examTitle: string;
  studentName: string;
  studentId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number; // به دقیقه
  completedAt: string;
  difficulty: 'آسان' | 'متوسط' | 'سخت';
  subjectBreakdown: {
    subject: string;
    correct: number;
    total: number;
    percentage: number;
  }[];
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

interface FirstExamResultProps {
  courseExamId: string;
  className?: string;
}

// داده‌های نمونه - در production از API واقعی بیاید
const mockExamResult: FirstExamResult = {
  examId: 'exam-001',
  examTitle: 'آزمون ریاضی پایه یازدهم - فصل اول',
  studentName: 'علی احمدی',
  studentId: 'student-123',
  score: 75,
  totalQuestions: 40,
  correctAnswers: 30,
  timeSpent: 45,
  completedAt: '1403/10/15 14:30',
  difficulty: 'متوسط',
  subjectBreakdown: [
    { subject: 'جبر', correct: 8, total: 10, percentage: 80 },
    { subject: 'هندسه', correct: 7, total: 10, percentage: 70 },
    { subject: 'احتمال', correct: 9, total: 10, percentage: 90 },
    { subject: 'آمار', correct: 6, total: 10, percentage: 60 }
  ],
  strengths: ['احتمال و آمار', 'حل مسائل جبری', 'تفکر منطقی'],
  weaknesses: ['مسائل هندسی', 'اثبات قضایا', 'محاسبات پیچیده'],
  recommendations: [
    'تمرین بیشتر روی مسائل هندسی',
    'مرور مفاهیم پایه آمار',
    'حل نمونه سوالات مشابه'
  ]
};

const FirstExamResult: React.FC<FirstExamResultProps> = ({ 
  courseExamId, 
  className = '' 
}) => {
  const [examResult, setExamResult] = useState<FirstExamResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExamResult = async () => {
      try {
        setLoading(true);
        // شبیه‌سازی فراخوانی API
        await new Promise(resolve => setTimeout(resolve, 1000));
        setExamResult(mockExamResult);
              } catch {
        setError('خطا در دریافت نتیجه آزمون');
      } finally {
        setLoading(false);
      }
    };

    fetchExamResult();
  }, [courseExamId]);

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`} dir="rtl">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !examResult) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`} dir="rtl">
        <div className="text-center text-gray-500">
          <ChartBarIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>{error || 'هنوز نتیجه‌ای برای نمایش وجود ندارد'}</p>
        </div>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 60) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getPercentageColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`bg-white rounded-lg shadow-sm border ${className}`}
      dir="rtl"
    >
      {/* هدر */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="p-2 bg-blue-100 rounded-lg">
              <AcademicCapIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                نتیجه اولین آزمون
              </h3>
              <p className="text-sm text-gray-600">
                {examResult.examTitle}
              </p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full border text-sm font-medium ${getScoreColor(examResult.score)}`}>
            {examResult.score}% از ۱۰۰
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* اطلاعات کلی */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <TrophyIcon className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-xl font-bold text-gray-900">{examResult.correctAnswers}</div>
            <div className="text-sm text-gray-600">از {examResult.totalQuestions} سوال</div>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <ClockIcon className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-xl font-bold text-gray-900">{examResult.timeSpent}</div>
            <div className="text-sm text-gray-600">دقیقه</div>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <ChartPieIcon className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <div className="text-xl font-bold text-gray-900">{examResult.difficulty}</div>
            <div className="text-sm text-gray-600">سطح سختی</div>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <UserGroupIcon className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-xl font-bold text-gray-900">{examResult.studentName}</div>
            <div className="text-sm text-gray-600">دانش‌آموز</div>
          </div>
        </div>

        {/* تحلیل موضوعی */}
        <div className="mb-6">
          <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
            <ChartBarIcon className="w-5 h-5 mr-2" />
            تحلیل موضوعی
          </h4>
          <div className="space-y-3">
            {examResult.subjectBreakdown.map((subject, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center flex-1">
                  <span className="text-sm font-medium text-gray-700 w-20">
                    {subject.subject}
                  </span>
                  <div className="flex-1 mx-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getPercentageColor(subject.percentage)}`}
                        style={{ width: `${subject.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-sm text-gray-600">
                    {subject.correct}/{subject.total} ({subject.percentage}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* نقاط قوت و ضعف */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
              <ArrowTrendingUpIcon className="w-5 h-5 mr-2 text-green-600" />
              نقاط قوت
            </h4>
            <div className="space-y-2">
              {examResult.strengths.map((strength, index) => (
                <div key={index} className="flex items-center text-sm text-gray-700">
                  <StarIcon className="w-4 h-4 text-green-500 ml-2" />
                  {strength}
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
              <ChartBarIcon className="w-5 h-5 mr-2 text-red-600" />
              نقاط قابل بهبود
            </h4>
            <div className="space-y-2">
              {examResult.weaknesses.map((weakness, index) => (
                <div key={index} className="flex items-center text-sm text-gray-700">
                  <div className="w-2 h-2 bg-red-400 rounded-full ml-2"></div>
                  {weakness}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* پیشنهادات */}
        <div>
          <h4 className="text-md font-semibold text-gray-900 mb-3">
            پیشنهادات بهبود
          </h4>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <ul className="space-y-2">
              {examResult.recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start text-sm text-blue-800">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 ml-2 flex-shrink-0"></div>
                  {recommendation}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* زمان تکمیل */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            تکمیل شده در: {examResult.completedAt}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default FirstExamResult; 