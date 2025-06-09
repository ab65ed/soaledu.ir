/**
 * صفحه ورود - Authentication Login Page
 * هدایت کاربر به داشبورد مناسب پس از ورود موفق
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/stores/authStore';
import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, getUserRole } = useAuth();

  // هدایت کاربر لاگین شده به داشبورد مناسب
  useEffect(() => {
    if (isAuthenticated) {
      const role = getUserRole();
      const dashboardRoute = role ? `/${role}` : '/';
      router.push(dashboardRoute);
    }
  }, [isAuthenticated, getUserRole, router]);

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
            className="mx-auto h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center"
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
                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
              />
            </svg>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-6 text-3xl font-bold text-gray-900"
          >
            ورود به حساب کاربری
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-2 text-sm text-gray-600"
          >
            برای دسترسی به پنل کاربری وارد شوید
          </motion.p>
        </div>

        {/* فرم ورود */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="bg-white py-8 px-4 shadow-lg rounded-lg sm:px-10"
        >
          <LoginForm />
        </motion.div>

        {/* لینک ثبت‌نام */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-center"
        >
          <p className="text-sm text-gray-600">
            حساب کاربری ندارید؟{' '}
            <a
              href="/auth/register"
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
            >
              ثبت‌نام کنید
            </a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
} 