'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { LearnerExam } from '@/services/api';
import { 
  BookOpen, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Play,
  Search,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface ExamHistoryProps {
  exams: LearnerExam[];
}

/**
 * کامپوننت تاریخچه آزمون‌های فراگیر
 * Learner exam history component
 */
export default function ExamHistory({ exams }: ExamHistoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<'date' | 'score' | 'title'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // فیلتر و مرتب‌سازی آزمون‌ها
  const filteredAndSortedExams = React.useMemo(() => {
    const filtered = exams.filter(exam => {
      const matchesSearch = exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          exam.courseType.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || exam.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    return filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.completedAt || '').getTime() - new Date(b.completedAt || '').getTime();
          break;
        case 'score':
          comparison = (a.score || 0) - (b.score || 0);
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [exams, searchTerm, statusFilter, sortBy, sortOrder]);

  const toggleRowExpansion = (examId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(examId)) {
      newExpanded.delete(examId);
    } else {
      newExpanded.add(examId);
    }
    setExpandedRows(newExpanded);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'in-progress':
        return <Play className="w-5 h-5 text-yellow-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'تکمیل شده';
      case 'in-progress':
        return 'در حال انجام';
      default:
        return 'شروع نشده';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <motion.div
      className="bg-white rounded-xl shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* هدر */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              تاریخچه آزمون‌ها
            </h3>
            <p className="text-sm text-gray-600">
              {filteredAndSortedExams.length} آزمون از {exams.length}
            </p>
          </div>

          {/* کنترل‌های فیلتر */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* جستجو */}
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="جستجو در آزمون‌ها..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-4 pr-10 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* فیلتر وضعیت */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">همه وضعیت‌ها</option>
              <option value="completed">تکمیل شده</option>
              <option value="in-progress">در حال انجام</option>
              <option value="not-started">شروع نشده</option>
            </select>
          </div>
        </div>
      </div>

      {/* جدول */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                آزمون
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                وضعیت
              </th>
              <th 
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => {
                  if (sortBy === 'score') {
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                  } else {
                    setSortBy('score');
                    setSortOrder('desc');
                  }
                }}
              >
                <div className="flex items-center gap-1">
                  نمره
                  {sortBy === 'score' && (
                    sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => {
                  if (sortBy === 'date') {
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                  } else {
                    setSortBy('date');
                    setSortOrder('desc');
                  }
                }}
              >
                <div className="flex items-center gap-1">
                  تاریخ
                  {sortBy === 'date' && (
                    sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                جزئیات
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <AnimatePresence>
              {filteredAndSortedExams.map((exam, index) => (
                <React.Fragment key={exam.id}>
                  <motion.tr
                    className="hover:bg-gray-50 transition-colors"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <BookOpen className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">
                            {exam.title}
                          </h4>
                          <p className="text-xs text-gray-500">
                            {exam.courseType} • {exam.grade}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(exam.status)}`}>
                        {getStatusIcon(exam.status)}
                        {getStatusText(exam.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {exam.score !== undefined ? (
                        <div className="text-sm">
                          <span className="font-medium text-gray-900">
                            {exam.score}/{exam.maxScore}
                          </span>
                          <span className="text-gray-500 mr-1">
                            ({Math.round((exam.score / exam.maxScore) * 100)}%)
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {exam.completedAt 
                        ? new Date(exam.completedAt).toLocaleDateString('fa-IR')
                        : '-'
                      }
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleRowExpansion(exam.id)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        {expandedRows.has(exam.id) ? 'کمتر' : 'بیشتر'}
                      </button>
                    </td>
                  </motion.tr>

                  {/* ردیف جزئیات */}
                  <AnimatePresence>
                    {expandedRows.has(exam.id) && (
                      <motion.tr
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-gray-50"
                      >
                        <td colSpan={5} className="px-6 py-4">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">زمان صرف شده:</span>
                              <div className="flex items-center gap-1 mt-1">
                                <Clock className="w-4 h-4 text-gray-400" />
                                <span className="font-medium">
                                  {exam.timeSpent ? `${Math.round(exam.timeSpent / 60)} دقیقه` : '-'}
                                </span>
                              </div>
                            </div>
                            <div>
                              <span className="text-gray-500">پاسخ صحیح:</span>
                              <div className="font-medium mt-1">
                                {exam.correctAnswers ?? '-'} از {exam.totalQuestions}
                              </div>
                            </div>
                            <div>
                              <span className="text-gray-500">سطح دشواری:</span>
                              <div className="font-medium mt-1">
                                {exam.difficulty === 'easy' && 'آسان'}
                                {exam.difficulty === 'medium' && 'متوسط'}
                                {exam.difficulty === 'hard' && 'سخت'}
                              </div>
                            </div>
                            <div>
                              <span className="text-gray-500">قیمت:</span>
                              <div className="font-medium mt-1">
                                {exam.price.toLocaleString('fa-IR')} تومان
                              </div>
                            </div>
                          </div>
                        </td>
                      </motion.tr>
                    )}
                  </AnimatePresence>
                </React.Fragment>
              ))}
            </AnimatePresence>
          </tbody>
        </table>

        {/* پیام خالی بودن */}
        {filteredAndSortedExams.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              آزمونی یافت نشد
            </h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== 'all' 
                ? 'فیلترهای اعمال شده را تغییر دهید'
                : 'هنوز آزمونی انجام نداده‌اید'
              }
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
} 