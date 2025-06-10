/**
 * Flashcard Library Page
 * صفحه کتابخانه شخصی فلش‌کارت‌ها
 */

'use client';

import React from 'react';
import { BookOpen, TrendingUp, Clock, Star, Search, Filter } from 'lucide-react';
import Link from 'next/link';
import FlashcardGrid from '@/components/organisms/flashcard/FlashcardGrid';

export default function FlashcardLibraryPage() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [activeTab, setActiveTab] = React.useState('all');

  const tabs = [
    { id: 'all', label: 'همه', count: 24 },
    { id: 'purchased', label: 'خریداری شده', count: 12 },
    { id: 'learned', label: 'یادگرفته شده', count: 8 },
    { id: 'needs-review', label: 'نیاز به مرور', count: 4 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <BookOpen className="h-8 w-8 text-purple-600" />
                </div>
                کتابخانه شخصی من
              </h1>
              <p className="text-gray-600 text-lg">
                مدیریت و مطالعه فلش‌کارت‌های شما
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Link 
                href="/flashcard"
                className="border border-purple-200 text-purple-700 hover:bg-purple-50 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Search className="h-4 w-4" />
                جستجوی فلش‌کارت‌ها
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
              <div className="bg-white rounded-lg shadow-sm border p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">24</p>
                    <p className="text-sm text-gray-600">کل فلش‌کارت‌ها</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">75%</p>
                    <p className="text-sm text-gray-600">میزان پیشرفت</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Clock className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">2.5</p>
                    <p className="text-sm text-gray-600">ساعت مطالعه</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Star className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">12</p>
                    <p className="text-sm text-gray-600">روز پیاپی</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <h3 className="font-semibold text-gray-900 mb-3">اقدامات سریع</h3>
              <div className="space-y-2">
                <button className="w-full text-right p-2 hover:bg-gray-50 rounded-lg transition-colors">
                  شروع جلسه مطالعه
                </button>
                <button className="w-full text-right p-2 hover:bg-gray-50 rounded-lg transition-colors">
                  مرور فلش‌کارت‌های جدید
                </button>
                <button className="w-full text-right p-2 hover:bg-gray-50 rounded-lg transition-colors">
                  نمایش آمار پیشرفت
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search and Filter */}
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="جستجو در فلش‌کارت‌های من..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                </div>
                <button className="border border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                  <Filter className="h-4 w-4" />
                  فیلتر
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="border-b border-gray-200">
                <nav className="flex">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === tab.id
                          ? 'border-purple-500 text-purple-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab.label}
                      <span className="mr-2 bg-gray-100 text-gray-600 px-2 py-1 text-xs rounded-full">
                        {tab.count}
                      </span>
                    </button>
                  ))}
                </nav>
              </div>

              {/* Content */}
              <div className="p-6">
                <FlashcardGrid 
                  searchTerm={searchTerm}
                  activeCategory=""
                  onFlashcardClick={(flashcard) => console.log('Study flashcard:', flashcard)}
                  onLike={(flashcardId) => console.log('Liked flashcard:', flashcardId)}
                  onShare={(flashcard) => console.log('Shared flashcard:', flashcard)}
                  onPurchase={(flashcard) => console.log('Purchase flashcard:', flashcard)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 