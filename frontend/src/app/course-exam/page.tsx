/**
 * Course Exam Page
 * صفحه ایجاد درس-آزمون
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
// import { Progress } from "@/components/ui/progress";
import { CourseExamWizard } from "@/components/course/exams/CourseExamWizard";
import { GraduationCap, BookOpen } from "lucide-react";

const CourseExamPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100" dir="rtl">
      {/* Header */}
      <header className="glass border-b border-blue-200/50 px-6 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-blue-900">پلتفرم آموزشی</h1>
                <p className="text-sm text-blue-700">سیستم مدیریت آزمون</p>
              </div>
            </div>
          </div>
          
          <Breadcrumb>
            <BreadcrumbList className="text-blue-800">
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/" className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    خانه
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/courses">دوره‌ها</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-semibold">درس-آزمون</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-8">
                      <h2 className="text-3xl font-extrabold text-blue-900 mb-2">طراحی درس-آزمون</h2>
          <p className="text-blue-700 text-lg">سیستم جامع ایجاد و مدیریت درس-آزمون‌های آموزشی</p>
          </div>

          {/* Progress Section */}
          <div className="glass p-6 rounded-2xl mb-8 border border-blue-200/50">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-blue-900">پیشرفت تکمیل درس-آزمون</h3>
              <span className="text-2xl font-bold text-blue-600">25%</span>
            </div>
            <div className="h-3 bg-blue-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: '25%' }}></div>
            </div>
            <p className="text-blue-700 text-sm mt-2">مرحله ۱ از ۴ - اطلاعات کلی درس-آزمون</p>
          </div>

          {/* Wizard Component */}
          <CourseExamWizard />
        </div>
      </main>
    </div>
  );
};

export default CourseExamPage; 