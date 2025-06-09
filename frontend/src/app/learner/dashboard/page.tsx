'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { learnerService } from '@/services/api';
import LearnerOverview from '@/components/learner/LearnerOverview';
import { Loader2 } from 'lucide-react';

/**
 * صفحه داشبورد فراگیر
 * Learner Dashboard Page
 */
export default function LearnerDashboardPage() {
  // دریافت اطلاعات فراگیر
  const {
    data: learnerData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['learner-overview'],
    queryFn: () => learnerService.getLearnerOverview(),
    staleTime: 30000, // 30 ثانیه
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" role="progressbar" aria-label="در حال بارگذاری" />
          <p className="text-gray-600">در حال بارگذاری داشبورد...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-600 mb-2">خطا در بارگذاری</h2>
          <p className="text-gray-600">لطفاً دوباره تلاش کنید</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gray-50 rtl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* عنوان صفحه */}
        <motion.div
          className="mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            داشبورد فراگیر
          </h1>
          <p className="text-gray-600">
            مشاهده آزمون‌ها، پیشرفت و عملکرد خود
          </p>
        </motion.div>

        {/* محتوای اصلی داشبورد */}
        <LearnerOverview data={learnerData} />
      </div>
    </motion.div>
  );
} 