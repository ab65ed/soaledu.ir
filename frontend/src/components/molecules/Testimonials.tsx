/**
 * Testimonials Component - کامپوننت نظرات کاربران
 * نمایش نظرات کاربران با اسلایدر انیمیشنی
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { testimonialService, Testimonial } from '../../services/api';
import Card from '../atoms/Card';

const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // دریافت نظرات از API
  const { data: testimonials, isLoading } = useQuery({
    queryKey: ['testimonials'],
    queryFn: testimonialService.getPublishedTestimonials,
    staleTime: 30000, // 30 ثانیه
  });

  // اسلایدر خودکار
  useEffect(() => {
    if (!testimonials || testimonials.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // تغییر هر 5 ثانیه

    return () => clearInterval(interval);
  }, [testimonials]);

  // تابع رندر ستاره‌ها
  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => (
      <svg
        key={index}
        className={`w-5 h-5 ${
          index < rating ? 'text-yellow-400' : 'text-gray-300'
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  // نظرات پیش‌فرض در صورت عدم دریافت از API
  const defaultTestimonials: Testimonial[] = [
    {
      id: '1',
      name: 'علی احمدی',
      role: 'دانشجوی مهندسی',
      message: 'پلتفرم فوق‌العاده‌ای برای تمرین آزمون‌ها. رابط کاربری بسیار راحت و امکانات عالی.',
      rating: 5,
      isPublished: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'فاطمه کریمی',
      role: 'دبیر ریاضی',
      message: 'به عنوان معلم، این سامانه کمک زیادی به من در ایجاد آزمون‌های متنوع کرده است.',
      rating: 5,
      isPublished: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '3',
      name: 'محمد رضایی',
      role: 'دانش‌آموز پایه دوازدهم',
      message: 'آمادگی کنکور با این سایت خیلی راحت‌تر شده. نتایج فوری و تحلیل دقیق عالیه.',
      rating: 4,
      isPublished: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const displayTestimonials = testimonials || defaultTestimonials;

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-96 mx-auto mb-12"></div>
              <div className="h-48 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* عنوان بخش */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            نظرات کاربران
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            تجربه کاربران ما از استفاده از سامانه آزمون‌های آنلاین
          </p>
        </div>

        {/* اسلایدر نظرات */}
        <div className="relative max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -300 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            >
              <Card className="text-center">
                <div className="flex flex-col items-center">
                  {/* آواتار */}
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mb-6">
                    <span className="text-white text-2xl font-bold">
                      {displayTestimonials[currentIndex]?.name?.charAt(0) || 'ک'}
                    </span>
                  </div>

                  {/* متن نظر */}
                  <blockquote className="text-lg text-gray-700 mb-6 leading-relaxed max-w-2xl">
                    &ldquo;{displayTestimonials[currentIndex]?.message}&rdquo;
                  </blockquote>

                  {/* ستاره‌های امتیاز */}
                  <div className="flex items-center mb-4">
                    {renderStars(displayTestimonials[currentIndex]?.rating || 5)}
                  </div>

                  {/* نام و نقش */}
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900">
                      {displayTestimonials[currentIndex]?.name}
                    </h4>
                    <p className="text-gray-600">
                      {displayTestimonials[currentIndex]?.role}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* نقاط ناوبری */}
          <div className="flex justify-center mt-8 space-x-2">
            {displayTestimonials.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentIndex 
                    ? 'bg-blue-600 scale-125' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                onClick={() => setCurrentIndex(index)}
                aria-label={`رفتن به نظر ${index + 1}`}
              />
            ))}
          </div>

          {/* دکمه‌های ناوبری */}
          <button
            className="absolute top-1/2 -translate-y-1/2 right-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
            onClick={() => setCurrentIndex(
              currentIndex === 0 ? displayTestimonials.length - 1 : currentIndex - 1
            )}
            aria-label="نظر قبلی"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <button
            className="absolute top-1/2 -translate-y-1/2 left-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
            onClick={() => setCurrentIndex(
              currentIndex === displayTestimonials.length - 1 ? 0 : currentIndex + 1
            )}
            aria-label="نظر بعدی"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials; 