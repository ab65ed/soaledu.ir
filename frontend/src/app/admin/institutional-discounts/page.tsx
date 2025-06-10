/**
 * Institutional Discounts Admin Page
 * صفحه مدیریت تخفیف‌های سازمانی
 */

'use client';

import React, { useState } from 'react';
import { FileUploadForm } from '@/components/admin/institutional-discount/FileUploadForm';
import { DiscountGroupsList } from '@/components/admin/institutional-discount/DiscountGroupsList';
import { useDiscountStats } from '@/hooks/useInstitutionalDiscount';
import { InstitutionalDiscountGroup } from '@/types/institutionalDiscount';

export default function InstitutionalDiscountsPage() {
  const [activeTab, setActiveTab] = useState<'upload' | 'list' | 'stats'>('upload');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedGroup, setSelectedGroup] = useState<InstitutionalDiscountGroup | null>(null);

  const { stats, loading: statsLoading, error: statsError } = useDiscountStats();

  const handleUploadSuccess = (groupId: string) => {
    // Switch to list tab and refresh
    setActiveTab('list');
    setRefreshTrigger(prev => prev + 1);
  };

  const handleGroupSelect = (group: InstitutionalDiscountGroup) => {
    setSelectedGroup(group);
    // You could implement a modal or detailed view here
    alert(`جزئیات گروه: ${group.groupName || group._id}`);
  };

  const renderStatsCards = () => {
    if (statsLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      );
    }

    if (statsError || !stats) {
      return (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          خطا در دریافت آمار: {statsError || 'نامشخص'}
        </div>
      );
    }

    const statsData = [
      {
        title: 'کل گروه‌ها',
        value: stats.totalGroups,
        color: 'bg-blue-500',
        icon: '📊',
      },
      {
        title: 'گروه‌های فعال',
        value: stats.activeGroups,
        color: 'bg-green-500',
        icon: '✅',
      },
      {
        title: 'کاربران تخفیف‌دار',
        value: stats.totalDiscountedUsers,
        color: 'bg-purple-500',
        icon: '👥',
      },
      {
        title: 'در حال پردازش',
        value: stats.processingGroups,
        color: 'bg-yellow-500',
        icon: '⏳',
      },
      {
        title: 'خطا',
        value: stats.failedGroups,
        color: 'bg-red-500',
        icon: '❌',
      },
    ];

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {statsData.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value.toLocaleString()}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.color} text-white`}>
                <span className="text-xl">{stat.icon}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            مدیریت تخفیف‌های سازمانی
          </h1>
          <p className="mt-2 text-gray-600">
            مدیریت تخفیف‌های اعطایی به نهادهای آموزشی و دانش‌آموزان
          </p>
        </div>

        {/* Stats Cards */}
        {renderStatsCards()}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('upload')}
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'upload'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="flex items-center">
                  <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  بارگذاری فایل
                </span>
              </button>
              <button
                onClick={() => setActiveTab('list')}
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'list'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="flex items-center">
                  <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  لیست گروه‌ها
                </span>
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'upload' && (
            <FileUploadForm
              onUploadSuccess={handleUploadSuccess}
              onUploadError={(error) => {
                console.error('Upload error:', error);
                alert(`خطا در بارگذاری: ${error}`);
              }}
            />
          )}

          {activeTab === 'list' && (
            <DiscountGroupsList
              onGroupSelect={handleGroupSelect}
              refreshTrigger={refreshTrigger}
            />
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            عملیات سریع
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setActiveTab('upload')}
              className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <svg className="ml-2 h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              بارگذاری فایل جدید
            </button>
            
            <button
              onClick={() => {
                setRefreshTrigger(prev => prev + 1);
                setActiveTab('list');
              }}
              className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <svg className="ml-2 h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              بروزرسانی لیست
            </button>
            
            <button
              onClick={() => {
                // Implement export functionality
                alert('دانلود گزارش - قابلیت به زودی اضافه می‌شود');
              }}
              className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <svg className="ml-2 h-5 w-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              دانلود گزارش
            </button>
          </div>
        </div>

        {/* Selected Group Details Modal/Panel */}
        {selectedGroup && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                  جزئیات گروه: {selectedGroup.groupName || selectedGroup._id}
                </h3>
                <button
                  onClick={() => setSelectedGroup(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <strong>وضعیت:</strong> {selectedGroup.status}
                  </div>
                  <div>
                    <strong>تاریخ بارگذاری:</strong> {new Date(selectedGroup.uploadDate).toLocaleDateString('fa-IR')}
                  </div>
                  <div>
                    <strong>کل رکوردها:</strong> {selectedGroup.totalUsersInFile}
                  </div>
                  <div>
                    <strong>تطبیق یافته:</strong> {selectedGroup.matchedUsersCount}
                  </div>
                </div>
                
                {selectedGroup.errorLog.length > 0 && (
                  <div>
                    <strong>خطاها:</strong>
                    <div className="mt-2 max-h-40 overflow-y-auto bg-red-50 p-3 rounded">
                      {selectedGroup.errorLog.map((error, index) => (
                        <div key={index} className="text-sm text-red-700">{error}</div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 