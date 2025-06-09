'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { LearnerOverviewData } from '@/services/api';
import WalletCard from './molecules/WalletCard';
import ExamHistory from './organisms/ExamHistory';
import ProgressStats from './molecules/ProgressStats';
import RecentActivity from './molecules/RecentActivity';
import ExamRecommendations from './molecules/ExamRecommendations';
import { 
  BookOpen, 
  Clock, 
  Trophy, 
  Star
} from 'lucide-react';

interface LearnerOverviewProps {
  data?: LearnerOverviewData;
}

/**
 * کامپوننت اصلی نمای کلی داشبورد فراگیر
 * Main learner overview component
 */
export default function LearnerOverview({ data }: LearnerOverviewProps) {
  if (!data) {
    return (
      <div className="grid gap-6">
        {/* کارت‌های بارگذاری */}
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-6 animate-pulse"
          >
            <div className="h-4 bg-gray-200 rounded mb-4"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* ردیف اول: کیف پول و آمار کلی */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* کارت کیف پول */}
        <div className="lg:col-span-1">
          <WalletCard wallet={data.wallet} />
        </div>

        {/* آمار پیشرفت */}
        <div className="lg:col-span-2">
          <ProgressStats progress={data.progress} />
        </div>
      </motion.div>

      {/* ردیف دوم: آمار سریع */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {/* آزمون‌های کامل شده */}
        <div className="bg-white rounded-xl p-6 text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <BookOpen className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {data.progress.totalExamsCompleted}
          </h3>
          <p className="text-sm text-gray-600">آزمون انجام شده</p>
        </div>

        {/* زمان مطالعه */}
        <div className="bg-white rounded-xl p-6 text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Clock className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {Math.round(data.progress.totalTimeSpent / 60)}
          </h3>
          <p className="text-sm text-gray-600">ساعت مطالعه</p>
        </div>

        {/* میانگین نمره */}
        <div className="bg-white rounded-xl p-6 text-center">
          <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Star className="w-6 h-6 text-yellow-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {data.progress.averageScore.toFixed(1)}
          </h3>
          <p className="text-sm text-gray-600">میانگین نمره</p>
        </div>

        {/* پاداش‌ها */}
        <div className="bg-white rounded-xl p-6 text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Trophy className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {data.wallet.rewardsEarned}
          </h3>
          <p className="text-sm text-gray-600">پاداش دریافتی</p>
        </div>
      </motion.div>

      {/* ردیف سوم: تاریخچه و فعالیت‌های اخیر */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 xl:grid-cols-3 gap-6"
      >
        {/* تاریخچه آزمون‌ها */}
        <div className="xl:col-span-2">
          <ExamHistory exams={data.exams} />
        </div>

        {/* فعالیت‌های اخیر */}
        <div className="xl:col-span-1">
          <RecentActivity activities={data.progress.recentActivity} />
        </div>
      </motion.div>

      {/* ردیف چهارم: پیشنهادهای آزمون */}
      <motion.div variants={itemVariants}>
        <ExamRecommendations recommendations={data.recommendations} />
      </motion.div>
    </motion.div>
  );
} 