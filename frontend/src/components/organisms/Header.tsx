/**
 * Header Component - هدر حرفه‌ای با ناوبری نقش‌محور
 * پشتیبانی از RTL، انیمیشن، و منوی موبایل
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bars3Icon,
  XMarkIcon,
  UserIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  HomeIcon,
  BookOpenIcon,
  ClipboardDocumentListIcon,
  ChatBubbleLeftRightIcon,
  AcademicCapIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '@/stores/authStore';
import { useLogout } from '@/hooks/useAuth';

// لینک‌های منوی اصلی
const navLinks = [
  {
    href: '/home',
    label: 'خانه',
    icon: HomeIcon,
  },
  {
    href: '/course-exam',
    label: 'آزمون‌های درسی',
    icon: BookOpenIcon,
  },
  {
    href: '/test-exams',
    label: 'آزمون‌های آزمایشی',
    icon: ClipboardDocumentListIcon,
  },
  {
    href: '/blog',
    label: 'وبلاگ',
    icon: AcademicCapIcon,
  },
  {
    href: '/contact',
    label: 'تماس با ما',
    icon: ChatBubbleLeftRightIcon,
  },
];

// لینک‌های داشبورد بر اساس نقش
const getDashboardLink = (role: string) => {
  const dashboardLinks: Record<string, { href: string; label: string }> = {
    admin: { href: '/admin/dashboard', label: 'پنل مدیریت' },
    designer: { href: '/designer/dashboard', label: 'پنل طراح' },
    learner: { href: '/learner/dashboard', label: 'پنل فراگیر' },
    expert: { href: '/expert/dashboard', label: 'پنل متخصص' },
    support: { href: '/support/dashboard', label: 'پنل پشتیبانی' },
  };
  
  return dashboardLinks[role] || { href: '/home', label: 'داشبورد' };
};

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  const pathname = usePathname();
  const { user, isAuthenticated, canAccessRoute } = useAuth();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  // بستن منوها هنگام کلیک خارج از آن‌ها
  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const closeUserMenu = () => setIsUserMenuOpen(false);

  // مدیریت لاگ‌اوت
  const handleLogout = async () => {
    try {
      await logout();
      closeUserMenu();
    } catch (error) {
      console.error('خطا در لاگ‌اوت:', error);
    }
  };

  // فیلتر کردن لینک‌ها بر اساس دسترسی کاربر
  const accessibleLinks = navLinks.filter(link => 
    !isAuthenticated || canAccessRoute(link.href)
  );

  // دریافت لینک داشبورد
  const dashboardLink = user ? getDashboardLink(user.role) : null;

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* لوگو و نام سایت */}
          <div className="flex items-center">
            <Link 
              href="/" 
              className="flex items-center space-x-2 rtl:space-x-reverse"
            >
              <div className="bg-primary w-8 h-8 rounded-lg flex items-center justify-center">
                <AcademicCapIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                سؤال‌ساز
              </span>
            </Link>
          </div>

          {/* منوی دسکتاپ */}
          <nav className="hidden md:flex space-x-8 rtl:space-x-reverse">
            {accessibleLinks.map((link) => {
              const IconComponent = link.icon;
              const isActive = pathname === link.href;
              
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    flex items-center space-x-1 rtl:space-x-reverse px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200
                    ${isActive 
                      ? 'text-primary bg-primary/10' 
                      : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                    }
                  `}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* منوی کاربر */}
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 rtl:space-x-reverse p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <UserIcon className="w-5 h-5 text-white" />
                  </div>
                  <div className="hidden md:block text-right rtl:text-left">
                    <div className="text-sm font-medium text-gray-900">
                      {user.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {user.role === 'admin' && 'مدیر'}
                      {user.role === 'designer' && 'طراح'}
                      {user.role === 'learner' && 'فراگیر'}
                      {user.role === 'expert' && 'متخصص'}
                      {user.role === 'support' && 'پشتیبانی'}
                    </div>
                  </div>
                </button>

                {/* منوی dropdown کاربر */}
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 rtl:right-0 mt-2 w-56 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 divide-y divide-gray-100"
                    >
                      <div className="px-4 py-3">
                        <p className="text-sm text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                      
                      <div className="py-1">
                        {dashboardLink && (
                          <Link
                            href={dashboardLink.href}
                            onClick={closeUserMenu}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Cog6ToothIcon className="w-4 h-4 ml-3 rtl:mr-3 rtl:ml-0" />
                            {dashboardLink.label}
                          </Link>
                        )}
                        
                        <button
                          onClick={handleLogout}
                          disabled={isLoggingOut}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50 disabled:opacity-50"
                        >
                          <ArrowRightOnRectangleIcon className="w-4 h-4 ml-3 rtl:mr-3 rtl:ml-0" />
                          {isLoggingOut ? 'در حال خروج...' : 'خروج'}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Link
                  href="/auth/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary transition-colors duration-200"
                >
                  ورود
                </Link>
                <Link
                  href="/auth/register"
                  className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-md hover:bg-primary/90 transition-colors duration-200"
                >
                  ثبت‌نام
                </Link>
              </div>
            )}

            {/* دکمه منوی موبایل */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-700 hover:text-primary hover:bg-gray-100 transition-colors duration-200"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* منوی موبایل */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white border-t border-gray-200"
          >
            <div className="px-4 py-2 space-y-1">
              {accessibleLinks.map((link) => {
                const IconComponent = link.icon;
                const isActive = pathname === link.href;
                
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMobileMenu}
                    className={`
                      flex items-center space-x-2 rtl:space-x-reverse px-3 py-2 rounded-md text-base font-medium transition-colors duration-200
                      ${isActive 
                        ? 'text-primary bg-primary/10' 
                        : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                      }
                    `}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
              
              {/* منوی کاربر در موبایل */}
              {isAuthenticated && user && dashboardLink && (
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <Link
                    href={dashboardLink.href}
                    onClick={closeMobileMenu}
                    className="flex items-center space-x-2 rtl:space-x-reverse px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
                  >
                    <Cog6ToothIcon className="w-5 h-5" />
                    <span>{dashboardLink.label}</span>
                  </Link>
                  
                  <button
                    onClick={() => {
                      handleLogout();
                      closeMobileMenu();
                    }}
                    disabled={isLoggingOut}
                    className="flex items-center space-x-2 rtl:space-x-reverse px-3 py-2 rounded-md text-base font-medium text-red-700 hover:bg-red-50 disabled:opacity-50 w-full text-right rtl:text-left"
                  >
                    <ArrowRightOnRectangleIcon className="w-5 h-5" />
                    <span>{isLoggingOut ? 'در حال خروج...' : 'خروج'}</span>
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay برای بستن منوها */}
      {(isMobileMenuOpen || isUserMenuOpen) && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-25 md:hidden"
          onClick={() => {
            closeMobileMenu();
            closeUserMenu();
          }}
        />
      )}
    </header>
  );
};

export default Header; 