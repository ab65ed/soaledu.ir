'use client'

import React from 'react'
import Link from 'next/link'

export default function CourseExamPage() {
  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium">
            ← بازگشت به خانه
          </Link>
        </div>
        
        <h1 className="text-4xl font-bold text-blue-600 mb-4">آزمون درس</h1>
        <p className="text-gray-700 mb-8">صفحه ایجاد و مدیریت آزمون‌های درسی</p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-3">ایجاد آزمون جدید</h3>
            <p className="text-gray-600 mb-4">آزمون جدید با سؤالات سفارشی ایجاد کنید</p>
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              شروع
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-3">مدیریت آزمون‌ها</h3>
            <p className="text-gray-600 mb-4">آزمون‌های موجود را ویرایش و مدیریت کنید</p>
            <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              مشاهده
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-3">گزارش‌ها</h3>
            <p className="text-gray-600 mb-4">نتایج و آمار آزمون‌ها را مشاهده کنید</p>
            <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              گزارش‌ها
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 