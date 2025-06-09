/**
 * FeaturedCourses Component - کامپوننت درس-آزمون‌های محبوب
 * نمایش درس-آزمون‌های محبوب با اتصال به API
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { courseExamService, CourseExam } from '../../services/api';
import Card from '../atoms/Card';
import Button from '../atoms/Button';

const FeaturedCourses: React.FC = () => {
  // دریافت درس-آزمون‌های محبوب از API
  const { data: popularCourses, isLoading, error } = useQuery({
    queryKey: ['popularCourses'],
    queryFn: courseExamService.getPopularCourseExams,
    staleTime: 30000, // 30 ثانیه طبق درخواست
  });

  // انیمیشن کانتینر
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.1,
      },
    },
  };

  // انیمیشن کارت‌ها
  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  // تابع فرمت قیمت به تومان
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
  };

  // تابع تشخیص رنگ سطح سختی
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // تابع ترجمه سطح سختی
  const translateDifficulty = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'آسان';
      case 'medium':
        return 'متوسط';
      case 'hard':
        return 'سخت';
      default:
        return difficulty;
    }
  };

  if (error) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-red-600">خطا در بارگذاری درس-آزمون‌های محبوب</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* عنوان بخش */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            درس-آزمون‌های محبوب
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            آزمون‌های پرطرفدار و محبوب کاربران در دسته‌بندی‌های مختلف
          </p>
        </div>

        {/* لودینگ */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <Card>
                  <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </Card>
              </div>
            ))}
          </div>
        )}

        {/* کارت‌های درس-آزمون */}
        {!isLoading && popularCourses && (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {popularCourses.slice(0, 6).map((course: CourseExam) => (
              <motion.div key={course.id} variants={cardVariants}>
                <Card
                  hover
                  className="h-full flex flex-col"
                  onClick={() => window.location.href = `/course-exam/${course.id}`}
                >
                  {/* تصویر یا placeholder */}
                  <div className="h-48 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-lg mb-4 flex items-center justify-center">
                    <svg className="w-16 h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>

                  {/* محتوای کارت */}
                  <div className="flex-1 flex flex-col">
                    {/* عنوان */}
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {course.title}
                    </h3>

                    {/* توضیحات */}
                    <p className="text-gray-600 mb-4 line-clamp-3 flex-1">
                      {course.description || 'توضیحاتی برای این آزمون ارائه نشده است.'}
                    </p>

                    {/* اطلاعات آزمون */}
                    <div className="space-y-3">
                      {/* تگ‌ها */}
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {course.courseType}
                        </span>
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                          {course.grade}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(course.difficulty)}`}>
                          {translateDifficulty(course.difficulty)}
                        </span>
                      </div>

                      {/* آمار */}
                      <div className="flex justify-between items-center text-sm text-gray-600">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {course.questionCount} سوال
                        </div>
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {course.estimatedTime} دقیقه
                        </div>
                      </div>

                      {/* قیمت و دکمه */}
                      <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                        <div className="text-lg font-bold text-blue-600">
                          {course.price > 0 ? formatPrice(course.price) : 'رایگان'}
                        </div>
                        <Button size="sm" variant="outline">
                          شروع آزمون
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* دکمه مشاهده همه */}
        <div className="text-center mt-12">
          <Link href="/course-exam">
            <Button size="lg" variant="outline">
              مشاهده همه آزمون‌ها
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCourses; 