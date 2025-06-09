'use client';

import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { AdminPanel } from '@/components/admin/AdminPanel';
import { LoadingSpinner } from '@/components/atoms/LoadingSpinner';

/**
 * صفحه داشبورد ادمین - مدیریت کامل سیستم
 * Admin Dashboard Page - Complete System Management
 * 
 * ویژگی‌های کلیدی:
 * - نمایش آمار کلی سیستم
 * - مدیریت کاربران و نقش‌ها
 * - مدیریت مالی و درآمد
 * - مشاهده لاگ‌های فعالیت
 * - امنیت کامل با مجوز MANAGE_SYSTEM
 */

export default function AdminDashboardPage() {
  // بررسی مجوز دسترسی
  const { data: userProfile, isLoading: profileLoading } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      // اینجا باید تابع دریافت پروفایل کاربر از API service اضافه شود
      // فعلاً mock data برمی‌گردانیم
      return {
        id: '1',
        name: 'ادمین سیستم',
        email: 'admin@soaledu.ir',
        role: 'admin',
        permissions: ['MANAGE_SYSTEM', 'MANAGE_USERS', 'MANAGE_FINANCE']
      };
    },
    staleTime: 1000 * 60 * 30, // 30 دقیقه cache
  });

  // بررسی مجوز MANAGE_SYSTEM
  const hasSystemPermission = userProfile?.permissions?.includes('MANAGE_SYSTEM');

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!hasSystemPermission) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-8 bg-white rounded-lg shadow-lg"
        >
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            عدم دسترسی
          </h1>
          <p className="text-gray-600">
            شما مجوز دسترسی به پنل مدیریت سیستم را ندارید.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 rtl" dir="rtl">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="container mx-auto px-4 py-8"
      >
        {/* هدر صفحه */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            داشبورد مدیریت سیستم
          </h1>
          <p className="text-gray-600">
            مدیریت کامل سیستم، کاربران، محتوا و امور مالی
          </p>
        </motion.div>

        {/* محتوای اصلی */}
        <Suspense fallback={<LoadingSpinner size="lg" />}>
          <AdminPanel />
        </Suspense>
      </motion.div>
    </div>
  );
} 