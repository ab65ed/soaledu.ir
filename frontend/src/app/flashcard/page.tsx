/**
 * Flashcard Main Page
 * صفحه اصلی فلش‌کارت‌ها
 * 
 * @component FlashcardPage
 * @description صفحه اصلی نمایش تمام فلش‌کارت‌های عمومی با فیلترهای پیشرفته
 */

'use client';

import React from 'react';
import { Search, Plus, BookOpen, Brain } from 'lucide-react';
import Link from 'next/link';
import FlashcardGrid from '@/components/organisms/flashcard/FlashcardGrid';

export default function FlashcardPage() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [activeCategory, setActiveCategory] = React.useState<string>('');

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Brain className="h-8 w-8 text-blue-600" />
                </div>
                فلش‌کارت‌های آموزشی
              </h1>
              <p className="text-gray-600 text-lg">
                یادگیری مؤثر و مرور سریع مطالب
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Link 
                href="/flashcard/create"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Plus className="h-4 w-4" />
                ایجاد فلش‌کارت
              </Link>
              
              <Link 
                href="/flashcard/library"
                className="border border-blue-200 text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <BookOpen className="h-4 w-4" />
                کتابخانه من
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Search Box */}
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Search className="h-5 w-5 text-blue-600" />
                جستجو
              </h3>
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="جستجو در فلش‌کارت‌ها..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                دسته‌بندی‌ها
              </h3>
              <div className="space-y-2">
                {['همه', 'ریاضی', 'فیزیک', 'شیمی', 'ادبیات', 'تاریخ', 'جغرافیا'].map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category === 'همه' ? '' : category)}
                    className={`w-full text-right p-2 rounded-lg transition-colors ${
                      (category === 'همه' && !activeCategory) || activeCategory === category
                        ? 'bg-blue-100 text-blue-700'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Results Header */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-xl font-semibold text-gray-900">
                  {activeCategory ? `فلش‌کارت‌های ${activeCategory}` : 'تمام فلش‌کارت‌ها'}
                </h2>
                <p className="text-sm text-gray-500">
                  فلش‌کارت‌های موجود
                  {searchTerm && (
                    <span className="mr-2">
                      برای &ldquo;{searchTerm}&rdquo;
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* FlashcardGrid Component */}
            <FlashcardGrid 
              searchTerm={searchTerm}
              activeCategory={activeCategory}
              onFlashcardClick={(flashcard) => console.log('Clicked flashcard:', flashcard)}
              onLike={(flashcardId) => console.log('Liked flashcard:', flashcardId)}
              onShare={(flashcard) => console.log('Shared flashcard:', flashcard)}
              onPurchase={(flashcard) => console.log('Purchase flashcard:', flashcard)}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 