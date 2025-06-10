'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { testExamService } from '@/services/api';
import ExamAnalyticsDashboard from '@/components/organisms/ExamAnalyticsDashboard';
import { LoadingSpinner } from '@/components/atoms/LoadingSpinner';
import Button from '@/components/atoms/Button';
import Link from 'next/link';

/**
 * صفحه آنالیز آزمون تستی
 * Test Exam Analytics Page
 */
export default function TestExamAnalyticsPage() {
  const params = useParams();
  const examId = params.id as string;

  // دریافت نتیجه آزمون با تحلیل‌های تفصیلی
  const { data: examResult, isLoading, error } = useQuery({
    queryKey: ['test-exam-result', examId],
    queryFn: () => testExamService.getTestExamResult(examId),
    staleTime: 1000 * 60 * 5, // 5 دقیقه
    enabled: !!examId,
  });

  // انیمیشن‌های Framer Motion
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !examResult) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md w-full"
        >
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-xl font-bold text-gray-800 mb-4 font-iransans">
            خطا در بارگذاری اطلاعات
          </h1>
          <p className="text-gray-600 mb-6 font-iransans">
            امکان دریافت اطلاعات آنالیز آزمون وجود ندارد. لطفاً مجدداً تلاش کنید.
          </p>
          <Link href="/test-exams" passHref>
            <Button variant="primary" className="font-iransans">
              <ArrowRightIcon className="w-4 h-4 ml-2" />
              بازگشت به آزمون‌ها
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* هدر صفحه */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2 font-iransans">
                  تحلیل آزمون تستی
                </h1>
                <p className="text-gray-600 font-iransans">
                  نتایج و آنالیز کامل عملکرد شما در این آزمون
                </p>
              </div>
              <Link href="/test-exams" passHref>
                <Button variant="outline" className="font-iransans">
                  <ArrowRightIcon className="w-4 h-4 ml-2" />
                  بازگشت به آزمون‌ها
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* داشبورد اصلی آنالیز */}
        <motion.div variants={itemVariants}>
          <ExamAnalyticsDashboard examResult={examResult} />
        </motion.div>
      </div>
    </motion.div>
  );
} 