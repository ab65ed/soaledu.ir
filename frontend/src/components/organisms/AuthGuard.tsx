/**
 * AuthGuard Component - محافظت از مسیرها و صفحات
 * بررسی احراز هویت و سطح دسترسی کاربر
 */

'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShieldExclamationIcon, UserIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/stores/authStore';
import { useAuthStatus } from '@/hooks/useAuth';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: string[];
  requireAuth?: boolean;
  redirectTo?: string;
}

// مسیرهای عمومی که نیاز به احراز هویت ندارند
const PUBLIC_ROUTES = [
  '/',
  '/home',
  '/blog',
  '/contact',
  '/auth/login',
  '/auth/register',
  '/about',
  '/terms',
  '/privacy',
  '/faq',
  '/help',
];

// مسیرهای محافظت شده که نیاز به احراز هویت دارند
const PROTECTED_ROUTES = [
  '/admin',
  '/designer',
  '/learner',
  '/expert',
  '/support',
  '/course-exam',
  '/questions',
  '/test-exams',
];

const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requiredRole = [],
  requireAuth = false,
  redirectTo = '/auth/login',
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, canAccessRoute } = useAuth();
  const { isLoading, error } = useAuthStatus();

  useEffect(() => {
    // منتظر بارگذاری اولیه باش
    if (isLoading) return;

    // بررسی مسیرهای محافظت شده
    const isProtectedRoute = PROTECTED_ROUTES.some(route => 
      pathname.startsWith(route)
    );
    
    const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

    // اگر مسیر محافظت شده است و کاربر احراز هویت نشده
    if (isProtectedRoute && !isAuthenticated) {
      router.push(redirectTo);
      return;
    }

    // اگر کاربر لاگین کرده و در صفحه login/register است
    if (isAuthenticated && (pathname === '/auth/login' || pathname === '/auth/register')) {
      const userRole = user?.role;
      switch (userRole) {
        case 'admin':
          router.push('/admin/dashboard');
          break;
        case 'designer':
          router.push('/designer/dashboard');
          break;
        case 'learner':
          router.push('/learner/dashboard');
          break;
        case 'expert':
          router.push('/expert/dashboard');
          break;
        case 'support':
          router.push('/support/dashboard');
          break;
        default:
          router.push('/home');
      }
      return;
    }

    // بررسی نقش مورد نیاز
    if (requireAuth && (!isAuthenticated || !user)) {
      router.push(redirectTo);
      return;
    }

    // بررسی نقش خاص
    if (requiredRole.length > 0 && (!user || !requiredRole.includes(user.role))) {
      router.push('/unauthorized');
      return;
    }

    // بررسی دسترسی به مسیر
    if (isAuthenticated && !isPublicRoute && !canAccessRoute(pathname)) {
      router.push('/unauthorized');
      return;
    }
  }, [
    isAuthenticated,
    user,
    pathname,
    isLoading,
    router,
    requireAuth,
    requiredRole,
    redirectTo,
    canAccessRoute,
  ]);

  // نمایش صفحه لودینگ
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">در حال بارگذاری...</p>
        </motion.div>
      </div>
    );
  }

  // نمایش خطای احراز هویت
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-md mx-auto p-6"
        >
          <div className="bg-red-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <ShieldExclamationIcon className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            خطا در احراز هویت
          </h2>
          <p className="text-gray-600 mb-4">
            مشکلی در تأیید هویت شما وجود دارد. لطفاً دوباره تلاش کنید.
          </p>
          <button
            onClick={() => router.push('/auth/login')}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors duration-200"
          >
            ورود مجدد
          </button>
        </motion.div>
      </div>
    );
  }

  // نمایش صفحه عدم دسترسی
  if (
    requireAuth && !isAuthenticated ||
    (requiredRole.length > 0 && (!user || !requiredRole.includes(user.role))) ||
    (isAuthenticated && !canAccessRoute(pathname) && !PUBLIC_ROUTES.includes(pathname))
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-md mx-auto p-6"
        >
          <div className="bg-yellow-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <UserIcon className="w-8 h-8 text-yellow-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            عدم دسترسی
          </h2>
          <p className="text-gray-600 mb-4">
            شما مجوز دسترسی به این صفحه را ندارید.
          </p>
          <div className="space-y-2">
            <button
              onClick={() => router.back()}
              className="w-full bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors duration-200"
            >
              بازگشت
            </button>
            <button
              onClick={() => router.push('/home')}
              className="w-full bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors duration-200"
            >
              صفحه اصلی
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard; 