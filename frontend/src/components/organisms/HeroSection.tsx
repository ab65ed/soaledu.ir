/**
 * HeroSection Component - کامپوننت بخش اصلی
 * بخش اصلی صفحه خانه با CTA و انیمیشن
 */

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Button from '../atoms/Button';

const HeroSection: React.FC = () => {
  // انیمیشن‌های مختلف برای عناصر
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
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
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  // تابع کمکی برای هدایت
  const navigateTo = (url: string) => {
    window.location.href = url;
  };

  // هدایت به داشبورد بر اساس نقش کاربر
  const handleCTAClick = () => {
    // منطق تشخیص نقش کاربر و هدایت به داشبورد مناسب
    const userRole = localStorage.getItem('userRole') || 'guest';
    
    switch (userRole) {
      case 'admin':
        navigateTo('/admin/dashboard');
        break;
      case 'designer':
        navigateTo('/designer/dashboard');
        break;
      case 'student':
        navigateTo('/learner/dashboard');
        break;
      case 'expert':
        navigateTo('/expert/dashboard');
        break;
      default:
        // کاربر مهمان - هدایت به صفحه ثبت‌نام
        navigateTo('/auth/register');
    }
  };

  return (
    <section role="main" className="relative bg-gradient-to-br from-blue-50 to-indigo-100 py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* عنوان اصلی */}
          <motion.h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6"
            variants={itemVariants}
          >
            سامانه جامع{' '}
            <span className="text-blue-600">آزمون‌های آنلاین</span>
          </motion.h1>

          {/* توضیحات */}
          <motion.p
            className="text-xl sm:text-2xl text-gray-600 mb-8 leading-relaxed"
            variants={itemVariants}
          >
            پلتفرم پیشرفته برای ایجاد، مدیریت و شرکت در آزمون‌های آنلاین
            با امکانات حرفه‌ای و رابط کاربری مدرن
          </motion.p>

          {/* ویژگی‌های کلیدی */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-12"
            variants={itemVariants}
          >
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">آزمون‌سازی آسان</h3>
              <p className="text-gray-600 text-center">ایجاد آزمون‌های متنوع با ابزارهای پیشرفته</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">نتایج فوری</h3>
              <p className="text-gray-600 text-center">دریافت نتایج و آنالیز عملکرد به صورت آنی</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">گزارش‌گیری هوشمند</h3>
              <p className="text-gray-600 text-center">آنالیز دقیق و گزارش‌های تخصصی</p>
            </div>
          </motion.div>

          {/* دکمه‌های CTA */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            variants={itemVariants}
          >
            <Button
              size="lg"
              onClick={handleCTAClick}
              className="px-8 py-4 text-lg font-semibold"
              rightIcon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              }
            >
              شروع آزمون
            </Button>

            <Link href="/contact">
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-4 text-lg font-semibold"
              >
                تماس با ما
              </Button>
            </Link>
          </motion.div>

          {/* آمار سایت */}
          <motion.div
            className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-8 text-center"
            variants={itemVariants}
          >
            <div>
              <div className="text-3xl font-bold text-blue-600">۱۲۰۰+</div>
              <div className="text-gray-600 mt-1">کاربر فعال</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">۵۰۰+</div>
              <div className="text-gray-600 mt-1">آزمون برگزار شده</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600">۹۸%</div>
              <div className="text-gray-600 mt-1">رضایت کاربران</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600">۲۴/۷</div>
              <div className="text-gray-600 mt-1">پشتیبانی</div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* عنصر تزئینی پس‌زمینه */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <svg
          className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 text-blue-100"
          width="404"
          height="384"
          fill="none"
          viewBox="0 0 404 384"
        >
          <defs>
            <pattern
              id="hero-pattern"
              x="0"
              y="0"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <rect x="0" y="0" width="4" height="4" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="404" height="384" fill="url(#hero-pattern)" />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection; 