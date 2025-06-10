'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  BookOpen, 
  Users, 
  Search,
  PlayCircle,
  ChevronRight,
  Star
} from 'lucide-react';
import { testExamService } from '@/services/api';

/**
 * صفحه آزمون‌های تستی
 * Test Exams Page - صفحه اصلی برای مرور و شروع آزمون‌های تستی
 */
export default function TestExamsPage() {
  // State management برای مدیریت وضعیت صفحه
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedCourseType, setSelectedCourseType] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // React Query for data fetching
  const { 
    data: examsData, 
    isLoading: isLoadingExams,
    error: examsError,
    refetch: refetchExams
  } = useQuery({
    queryKey: ['testExams', searchTerm, selectedGrade, selectedCourseType, selectedDifficulty, currentPage],
    queryFn: () => testExamService.getTestExams({
      search: searchTerm || undefined,
      grade: selectedGrade || undefined,
      courseType: selectedCourseType || undefined,
      difficulty: selectedDifficulty || undefined,
      limit: 12,
      skip: (currentPage - 1) * 12,
    }),
    staleTime: 1000 * 60 * 5, // 5 دقیقه
  });

  // محاسبه توزیع سختی سوالات
  const calculateDifficultyDistribution = (totalQuestions: number) => {
    const easy = Math.floor(totalQuestions * 0.2); // حداکثر 20%
    const medium = Math.floor(totalQuestions * 0.3); // حداکثر 30%
    const hard = totalQuestions - easy - medium; // بقیه سوالات
    
    return { easy, medium, hard };
  };

  // فیلترهای موجود
  const grades = ['هفتم', 'هشتم', 'نهم', 'دهم', 'یازدهم', 'دوازدهم'];
  const courseTypes = ['ریاضی', 'تجربی', 'انسانی', 'فنی'];
  const difficulties = ['آسان', 'متوسط', 'سخت'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50" dir="rtl">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2 font-iransans">
              آزمون‌های تستی
            </h1>
            <p className="text-gray-600 text-lg">
              آمادگی برای امتحانات با آزمون‌های تستی تخصصی
            </p>
          </motion.div>

          {/* Search and Filters */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Search Input */}
              <div className="lg:col-span-2 relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="جستجو در آزمون‌ها..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pr-10 pl-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-iransans"
                />
              </div>

              {/* Grade Filter */}
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-iransans"
              >
                <option value="">همه پایه‌ها</option>
                {grades.map((grade) => (
                  <option key={grade} value={grade}>{grade}</option>
                ))}
              </select>

              {/* Course Type Filter */}
              <select
                value={selectedCourseType}
                onChange={(e) => setSelectedCourseType(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-iransans"
              >
                <option value="">همه رشته‌ها</option>
                {courseTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>

              {/* Difficulty Filter */}
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-iransans"
              >
                <option value="">همه سطوح</option>
                {difficulties.map((difficulty) => (
                  <option key={difficulty} value={difficulty}>{difficulty}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {isLoadingExams ? (
          // Loading State
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="h-3 bg-gray-200 rounded mb-3"></div>
                <div className="h-3 bg-gray-200 rounded mb-6"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : examsError ? (
          // Error State
          <div className="text-center py-12">
            <div className="text-red-500 text-lg mb-4">خطا در بارگذاری آزمون‌ها</div>
            <button
              onClick={() => refetchExams()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-iransans"
            >
              تلاش مجدد
            </button>
          </div>
        ) : examsData?.exams && examsData.exams.length > 0 ? (
          // Exams Grid
          <AnimatePresence>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {examsData.exams.map((exam, index) => {
                const difficultyDistribution = calculateDifficultyDistribution(exam.questionsCount);
                
                return (
                  <motion.div
                    key={exam.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-sm border hover:shadow-lg transition-all duration-300 group"
                  >
                    <div className="p-6">
                      {/* Exam Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-2 font-iransans group-hover:text-blue-600 transition-colors">
                            {exam.title}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                            <BookOpen className="w-4 h-4" />
                            <span>{exam.grade} - {exam.courseType}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                          <Star className="w-3 h-3" />
                          <span className="font-medium">{exam.difficulty}</span>
                        </div>
                      </div>

                      {/* Exam Details */}
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span>مدت زمان: {exam.timeLimit} دقیقه</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Users className="w-4 h-4" />
                            <span>{exam.questionsCount} سوال</span>
                          </div>
                        </div>

                        {/* توزیع سختی سوالات */}
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="text-xs text-gray-600 mb-2 font-iransans">توزیع سختی سوالات:</div>
                          <div className="flex gap-2 text-xs">
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span>آسان: {difficultyDistribution.easy}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                              <span>متوسط: {difficultyDistribution.medium}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                              <span>سخت: {difficultyDistribution.hard}</span>
                            </div>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="flex items-center justify-between">
                          <div className="text-2xl font-bold text-green-600 font-iransans">
                            {exam.price.toLocaleString('fa-IR')} تومان
                          </div>
                          <div className="text-xs text-gray-500">
                            {Math.round(exam.price / exam.questionsCount).toLocaleString('fa-IR')} تومان/سوال
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <button
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 font-iransans group"
                      >
                        <PlayCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span>شروع آزمون</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </AnimatePresence>
        ) : (
          // Empty State
          <div className="text-center py-12">
            <div className="text-gray-600 text-lg mb-4">
              هیچ آزمونی یافت نشد
            </div>
            <p className="text-gray-500">
              لطفا فیلترهای مختلف را امتحان کنید
            </p>
          </div>
        )}

        {/* Pagination */}
        {examsData && examsData.pagination.total > 12 && (
          <div className="flex justify-center mt-8">
            <div className="flex items-center gap-2">
              {Array.from({ length: Math.ceil(examsData.pagination.total / 12) }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded-lg transition-colors font-iransans ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border'
                  }`}
                >
                  {page.toLocaleString('fa-IR')}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
