/**
 * Create Flashcard Page
 * صفحه ایجاد فلش‌کارت
 */

'use client';

import React from 'react';
import { Plus, Save, Eye, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { FlashCard } from '@/components/atoms/flashcard/FlashCard';

export default function CreateFlashcardPage() {
  const [question, setQuestion] = React.useState('');
  const [answer, setAnswer] = React.useState('');
  const [category, setCategory] = React.useState('');
  const [difficulty, setDifficulty] = React.useState<'easy' | 'medium' | 'hard'>('medium');
  const [isFlipped, setIsFlipped] = React.useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/flashcard"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Plus className="h-6 w-6 text-green-600" />
                  </div>
                  ایجاد فلش‌کارت جدید
                </h1>
                <p className="text-gray-600 mt-1">
                  فلش‌کارت خود را طراحی کنید
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="border border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                <Eye className="h-4 w-4" />
                پیش‌نمایش
              </button>
              
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                <Save className="h-4 w-4" />
                ذخیره
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                اطلاعات فلش‌کارت
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    سوال <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    rows={4}
                    placeholder="سوال خود را اینجا بنویسید..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    پاسخ <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    rows={4}
                    placeholder="پاسخ صحیح را اینجا بنویسید..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    دسته‌بندی
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">انتخاب کنید...</option>
                    <option value="ریاضی">ریاضی</option>
                    <option value="فیزیک">فیزیک</option>
                    <option value="شیمی">شیمی</option>
                    <option value="ادبیات">ادبیات</option>
                    <option value="تاریخ">تاریخ</option>
                    <option value="جغرافیا">جغرافیا</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    سطح دشواری
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="easy">آسان</option>
                    <option value="medium">متوسط</option>
                    <option value="hard">سخت</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                پیش‌نمایش فلش‌کارت
              </h2>
              
              <div className="flex justify-center">
                {question || answer ? (
                  <FlashCard
                    question={question || 'سوال خود را وارد کنید...'}
                    answer={answer || 'پاسخ را وارد کنید...'}
                    category={category}
                    difficulty={difficulty}
                    isFlipped={isFlipped}
                    onFlip={() => setIsFlipped(!isFlipped)}
                    size="lg"
                  />
                ) : (
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center w-80 h-48 flex items-center justify-center">
                    <div className="text-gray-500">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-4"></div>
                      <p>پیش‌نمایش فلش‌کارت اینجا نمایش داده می‌شود</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 