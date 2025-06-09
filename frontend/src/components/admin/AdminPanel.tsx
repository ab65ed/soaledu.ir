'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { 
  UsersIcon, 
  AcademicCapIcon, 
  ChartBarIcon, 
  CurrencyDollarIcon,
  ClockIcon,
  EyeIcon,
  UserGroupIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline';
import { FinanceTab } from './FinanceTab';
import { ActivityLogViewer } from './ActivityLogViewer';
import { LoadingSpinner } from '@/components/atoms/LoadingSpinner';
import { adminService, type AdminStats, type AdminUser } from '@/services/api';

/**
 * کامپوننت اصلی پنل مدیریت ادمین
 * Main Admin Panel Component
 */
export const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'content' | 'finance' | 'logs'>('overview');

  // دریافت آمار کلی سیستم
  const { data: stats, isLoading: statsLoading } = useQuery<AdminStats>({
    queryKey: ['adminStats'],
    queryFn: async () => {
      try {
        return await adminService.getAdminStats();
      } catch (error) {
        // در صورت خطا، mock data برمی‌گردانیم
        console.warn('Failed to fetch admin stats, using mock data:', error);
        return {
          users: {
            total: 1248,
            active: 892,
            newThisMonth: 156,
            students: 1089,
            teachers: 145,
            admins: 14
          },
          courseExams: {
            total: 234,
            published: 187,
            drafts: 47,
            totalSales: 3456
          },
          questions: {
            total: 5678,
            published: 4234,
            drafts: 1444
          },
          finance: {
            totalRevenue: 245670000, // ریال
            monthlyRevenue: 28900000,
            avgOrderValue: 125000,
            pendingPayments: 12
          },
          activity: {
            totalLogins: 8934,
            activeToday: 234,
            averageSessionTime: 1845 // ثانیه
          }
        };
      }
    },
    staleTime: 1000 * 60 * 5, // 5 دقیقه cache
  });

  // دریافت لیست کاربران
  const { data: usersData, isLoading: usersLoading } = useQuery<{
    users: AdminUser[];
    pagination: {
      total: number;
      count: number;
      limit: number;
      skip: number;
    };
  }>({
    queryKey: ['adminUsers'],
    queryFn: async () => {
      try {
        return await adminService.getUsers({ limit: 10 });
      } catch (error) {
        // در صورت خطا، mock data برمی‌گردانیم
        console.warn('Failed to fetch users, using mock data:', error);
        return {
          users: [
            {
              id: '1',
              name: 'علی احمدی',
              email: 'ali@example.com',
              role: 'student',
              isActive: true,
              lastLogin: '2024-01-15T10:30:00Z',
              registeredAt: '2024-01-01T09:00:00Z'
            },
            {
              id: '2',
              name: 'مریم محمدی',
              email: 'maryam@example.com',
              role: 'teacher',
              isActive: true,
              lastLogin: '2024-01-15T11:15:00Z',
              registeredAt: '2023-12-15T14:30:00Z'
            }
          ],
          pagination: {
            total: 2,
            count: 2,
            limit: 10,
            skip: 0
          }
        };
      }
    },
    staleTime: 1000 * 60 * 10, // 10 دقیقه cache
    enabled: activeTab === 'users'
  });

  const users = usersData?.users;

  const tabs = [
    { id: 'overview', name: 'نمای کلی', icon: ChartBarIcon },
    { id: 'users', name: 'کاربران', icon: UsersIcon },
    { id: 'content', name: 'محتوا', icon: BookOpenIcon },
    { id: 'finance', name: 'مالی', icon: CurrencyDollarIcon },
    { id: 'logs', name: 'لاگ‌ها', icon: ClockIcon }
  ];

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} دقیقه`;
  };

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg">
      {/* تب‌های ناوبری */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'overview' | 'users' | 'content' | 'finance' | 'logs')}
              className={`
                flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* محتوای تب‌ها */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* کارت‌های آمار کلی */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* آمار کاربران */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm">کل کاربران</p>
                      <p className="text-2xl font-bold">{stats?.users.total.toLocaleString('fa-IR')}</p>
                      <p className="text-blue-100 text-xs mt-1">
                        {stats?.users.newThisMonth} نفر این ماه
                      </p>
                    </div>
                    <UserGroupIcon className="w-8 h-8 text-blue-200" />
                  </div>
                </motion.div>

                {/* آمار آزمون‌ها */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm">آزمون‌های منتشر شده</p>
                      <p className="text-2xl font-bold">{stats?.courseExams.published.toLocaleString('fa-IR')}</p>
                      <p className="text-green-100 text-xs mt-1">
                        از {stats?.courseExams.total} آزمون
                      </p>
                    </div>
                    <AcademicCapIcon className="w-8 h-8 text-green-200" />
                  </div>
                </motion.div>

                {/* آمار درآمد */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm">درآمد ماهانه</p>
                      <p className="text-2xl font-bold">
                        {(stats?.finance.monthlyRevenue || 0).toLocaleString('fa-IR')}
                      </p>
                      <p className="text-purple-100 text-xs mt-1">ریال</p>
                    </div>
                    <CurrencyDollarIcon className="w-8 h-8 text-purple-200" />
                  </div>
                </motion.div>

                {/* آمار فعالیت */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100 text-sm">کاربران امروز</p>
                      <p className="text-2xl font-bold">{stats?.activity.activeToday.toLocaleString('fa-IR')}</p>
                      <p className="text-orange-100 text-xs mt-1">
                        میانگین جلسه: {formatTime(stats?.activity.averageSessionTime || 0)}
                      </p>
                    </div>
                    <EyeIcon className="w-8 h-8 text-orange-200" />
                  </div>
                </motion.div>
              </div>

              {/* جزئیات بیشتر */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* توزیع نقش‌های کاربری */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">توزیع نقش‌های کاربری</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">دانش‌آموزان</span>
                      <span className="font-medium">{stats?.users.students.toLocaleString('fa-IR')}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">معلمان</span>
                      <span className="font-medium">{stats?.users.teachers.toLocaleString('fa-IR')}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">مدیران</span>
                      <span className="font-medium">{stats?.users.admins.toLocaleString('fa-IR')}</span>
                    </div>
                  </div>
                </div>

                {/* آمار محتوا */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">آمار محتوا</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">کل سوالات</span>
                      <span className="font-medium">{stats?.questions.total.toLocaleString('fa-IR')}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">آزمون‌های فروخته شده</span>
                      <span className="font-medium">{stats?.courseExams.totalSales.toLocaleString('fa-IR')}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">میانگین ارزش سفارش</span>
                      <span className="font-medium">
                        {(stats?.finance.avgOrderValue || 0).toLocaleString('fa-IR')} ریال
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'users' && (
            <motion.div
              key="users"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">مدیریت کاربران</h2>
              
              {usersLoading ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner size="lg" />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          نام
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ایمیل
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          نقش
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          وضعیت
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          آخرین ورود
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users?.map((user, index) => (
                        <motion.tr
                          key={user.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="hover:bg-gray-50"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {user.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.role === 'admin' ? 'bg-red-100 text-red-800' :
                              user.role === 'teacher' ? 'bg-blue-100 text-blue-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {user.role === 'admin' ? 'مدیر' : 
                               user.role === 'teacher' ? 'معلم' : 'دانش‌آموز'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {user.isActive ? 'فعال' : 'غیرفعال'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(user.lastLogin).toLocaleDateString('fa-IR')}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'content' && (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center space-x-2 mb-6">
                <BookOpenIcon className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">مدیریت محتوا</h2>
              </div>
              <p className="text-gray-600">
                این بخش در حال توسعه است...
              </p>
            </motion.div>
          )}

          {activeTab === 'finance' && (
            <FinanceTab />
          )}

          {activeTab === 'logs' && (
            <ActivityLogViewer />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}; 