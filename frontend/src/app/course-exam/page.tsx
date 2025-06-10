'use client';

import React from 'react';
import { motion } from 'framer-motion';
import NewCourseExamForm from '@/components/course/exams/NewCourseExamForm';

/**
 * صفحه ایجاد درس-آزمون جدید
 * Course Exam Creation Page
 */
export default function CourseExamPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* هدر صفحه */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-blue-900 mb-4">
            ایجاد درس-آزمون جدید
          </h1>
          <p className="text-lg text-blue-700 max-w-2xl mx-auto">
            با استفاده از ابزارهای پیشرفته ما، درس-آزمون حرفه‌ای و کیفیت بالا ایجاد کنید
          </p>
        </motion.div>

        {/* فرم ایجاد درس-آزمون */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <NewCourseExamForm />
        </motion.div>

        {/* راهنمای سریع */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 bg-blue-50 rounded-xl p-6 border border-blue-200"
        >
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            راهنمای سریع
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <h4 className="font-medium text-blue-800 mb-1">اطلاعات پایه</h4>
              <p className="text-sm text-blue-600">
                نوع درس، مقطع و گروه را انتخاب کنید
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-blue-600 font-bold">2</span>
              </div>
              <h4 className="font-medium text-blue-800 mb-1">جزئیات درس</h4>
              <p className="text-sm text-blue-600">
                عنوان، توضیحات و قیمت درس را وارد کنید
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-blue-600 font-bold">3</span>
              </div>
              <h4 className="font-medium text-blue-800 mb-1">انتخاب سوالات</h4>
              <p className="text-sm text-blue-600">
                سوالات مناسب را با ابزار هوشمند انتخاب کنید
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 