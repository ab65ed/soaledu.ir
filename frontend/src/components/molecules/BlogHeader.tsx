/**
 * BlogHeader Component - هدر صفحه بلاگ
 * 
 * نمایش عنوان، توضیحات، و اطلاعات کلی بلاگ
 */

'use client';

import { motion } from 'framer-motion';
import { BookOpenIcon, UserGroupIcon, EyeIcon } from '@heroicons/react/24/outline';
import { useBlogStats } from '@/hooks/useBlog';

export default function BlogHeader() {
  const { data: stats, isLoading } = useBlogStats();

  return (
    <section className="bg-gradient-to-l from-blue-600 to-blue-800 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            بلاگ آموزشی آزمون‌آمو
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-blue-100 mb-8 leading-relaxed"
          >
            آخرین مقالات، نکات آموزشی، و راهنمای‌های جامع برای موفقیت در آزمون‌های تحصیلی
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto"
          >
            {/* Published Posts */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center justify-center mb-2">
                <BookOpenIcon className="h-8 w-8 text-blue-200" />
              </div>
              <div className="text-2xl font-bold">
                {isLoading ? '...' : stats?.publishedPosts?.toLocaleString('fa-IR') || '0'}
              </div>
              <div className="text-blue-200 text-sm">مقاله منتشر شده</div>
            </div>

            {/* Total Views */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center justify-center mb-2">
                <EyeIcon className="h-8 w-8 text-blue-200" />
              </div>
              <div className="text-2xl font-bold">
                {isLoading ? '...' : stats?.totalViews?.toLocaleString('fa-IR') || '0'}
              </div>
              <div className="text-blue-200 text-sm">بازدید کل</div>
            </div>

            {/* Total Comments */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center justify-center mb-2">
                <UserGroupIcon className="h-8 w-8 text-blue-200" />
              </div>
              <div className="text-2xl font-bold">
                {isLoading ? '...' : stats?.totalComments?.toLocaleString('fa-IR') || '0'}
              </div>
              <div className="text-blue-200 text-sm">نظر و بازخورد</div>
            </div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-12"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-6 h-10 border-2 border-white/50 rounded-full mx-auto flex justify-center"
            >
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1 h-3 bg-white/70 rounded-full mt-2"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>
      </div>
    </section>
  );
} 