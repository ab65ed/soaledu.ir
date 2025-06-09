/**
 * صفحه خروج - Authentication Logout Page
 * تأیید خروج و پاک کردن اطلاعات کاربری
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/stores/authStore';
import LogoutButton from '@/components/auth/LogoutButton';

export default function LogoutPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();

  // هدایت کاربر غیر لاگین شده به صفحه ورود
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8"
      >
        {/* هدر صفحه */}
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="mx-auto h-12 w-12 bg-red-500 rounded-full flex items-center justify-center"
          >
            <svg
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-6 text-3xl font-bold text-gray-900"
          >
            خروج از حساب کاربری
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-2 text-sm text-gray-600"
          >
            سلام <span className="font-medium text-blue-600">{user.name}</span>، آیا مطمئن هستید که می‌خواهید خارج شوید؟
          </motion.p>
        </div>

        {/* کارت خروج */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="bg-white py-8 px-4 shadow-lg rounded-lg sm:px-10"
        >
          <div className="space-y-6">
            {/* اطلاعات کاربر */}
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-600">
                    {user.name.charAt(0)}
                  </span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.name}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {user.email}
                </p>
              </div>
            </div>

            {/* دکمه‌های عمل */}
            <LogoutButton />
          </div>
        </motion.div>

        {/* لینک بازگشت */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-center"
        >
          <button
            onClick={() => router.back()}
            className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
          >
            ← بازگشت به صفحه قبل
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
} 