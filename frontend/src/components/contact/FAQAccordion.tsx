'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  QuestionMarkCircleIcon,
  MagnifyingGlassIcon,
  TagIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

// انواع داده‌ها برای سوالات متداول
interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'technical' | 'payment' | 'account' | 'courses';
  tags: string[];
  lastUpdated: string;
  isPopular?: boolean;
}

interface FAQAccordionProps {
  items?: FAQItem[];
  searchable?: boolean;
  categorizable?: boolean;
  className?: string;
}

// داده‌های نمونه FAQ - در production از API واقعی بیاید
const mockFAQItems: FAQItem[] = [
  {
    id: 'faq-001',
    question: 'چگونه می‌توانم حساب کاربری ایجاد کنم؟',
    answer: 'برای ایجاد حساب کاربری، روی دکمه "ثبت‌نام" در بالای صفحه کلیک کنید. سپس اطلاعات مورد نیاز شامل نام، ایمیل و رمز عبور را وارد کنید. پس از تایید ایمیل، حساب شما فعال خواهد شد.',
    category: 'account',
    tags: ['ثبت‌نام', 'حساب کاربری', 'ایمیل'],
    lastUpdated: '1403/10/20',
    isPopular: true
  },
  {
    id: 'faq-002',
    question: 'آیا دوره‌ها رایگان هستند؟',
    answer: 'بخشی از دوره‌ها و محتوا رایگان هستند، اما برای دسترسی به محتوای کامل و ویژگی‌های پیشرفته نیاز به خرید اشتراک دارید. می‌توانید با نسخه رایگان شروع کنید و سپس اشتراک تهیه کنید.',
    category: 'payment',
    tags: ['رایگان', 'اشتراک', 'قیمت'],
    lastUpdated: '1403/10/18',
    isPopular: true
  },
  {
    id: 'faq-003',
    question: 'چگونه رمز عبور خود را تغییر دهم؟',
    answer: 'وارد حساب کاربری خود شوید، سپس به بخش "تنظیمات" بروید. در قسمت "امنیت" می‌توانید رمز عبور فعلی را وارد کرده و رمز جدید را تعیین کنید. توصیه می‌کنیم رمز عبور قوی انتخاب کنید.',
    category: 'account',
    tags: ['رمز عبور', 'امنیت', 'تنظیمات'],
    lastUpdated: '1403/10/15'
  },
  {
    id: 'faq-004',
    question: 'چرا ویدئوهای آموزشی بارگذاری نمی‌شوند؟',
    answer: 'این مشکل ممکن است به دلایل مختلفی رخ دهد: اتصال اینترنت ضعیف، مشکل در مرورگر، یا مشکل موقت سرور. ابتدا اتصال اینترنت خود را بررسی کنید، سپس مرورگر را بازخوانی کنید. اگر مشکل ادامه داشت، با پشتیبانی تماس بگیرید.',
    category: 'technical',
    tags: ['ویدئو', 'بارگذاری', 'مشکل فنی'],
    lastUpdated: '1403/10/22'
  },
  {
    id: 'faq-005',
    question: 'آیا می‌توانم دوره‌ها را آفلاین مشاهده کنم؟',
    answer: 'بله، با اشتراک ویژه می‌توانید دوره‌ها را برای مشاهده آفلاین دانلود کنید. این قابلیت در اپلیکیشن موبایل در دسترس است. فایل‌های دانلود شده تنها در دستگاه شما قابل پخش هستند.',
    category: 'courses',
    tags: ['آفلاین', 'دانلود', 'موبایل'],
    lastUpdated: '1403/10/16'
  },
  {
    id: 'faq-006',
    question: 'چگونه از طریق کیف پول پرداخت کنم؟',
    answer: 'ابتدا کیف پول خود را شارژ کنید. سپس هنگام خرید، گزینه "پرداخت از کیف پول" را انتخاب کنید. اگر موجودی کافی داشته باشید، پرداخت به صورت خودکار انجام می‌شود. در غیر این صورت می‌توانید مابقی را از طریق کارت بانکی پرداخت کنید.',
    category: 'payment',
    tags: ['کیف پول', 'پرداخت', 'شارژ'],
    lastUpdated: '1403/10/19'
  },
  {
    id: 'faq-007',
    question: 'آیا گواهینامه برای دوره‌ها صادر می‌شود؟',
    answer: 'بله، پس از تکمیل موفقیت‌آمیز هر دوره و کسب حداقل نمره لازم، گواهینامه الکترونیکی برای شما صادر می‌شود. این گواهینامه‌ها دارای کد تایید هستند و می‌توانید صحت آن‌ها را بررسی کنید.',
    category: 'courses',
    tags: ['گواهینامه', 'تکمیل دوره', 'نمره'],
    lastUpdated: '1403/10/17',
    isPopular: true
  },
  {
    id: 'faq-008',
    question: 'چگونه با پشتیبانی تماس بگیرم؟',
    answer: 'راه‌های مختلفی برای تماس با پشتیبانی وجود دارد: 1) از طریق فرم تماس در همین صفحه 2) ارسال ایمیل به support@soaledu.ir 3) تماس تلفنی در ساعات اداری 4) چت آنلاین در سایت. معمولاً پاسخ‌ها ظرف 24 ساعت ارسال می‌شوند.',
    category: 'general',
    tags: ['پشتیبانی', 'تماس', 'ایمیل'],
    lastUpdated: '1403/10/21'
  }
];

// گزینه‌های دسته‌بندی
const categoryOptions = [
  { value: 'all', label: 'همه موضوعات', icon: QuestionMarkCircleIcon },
  { value: 'general', label: 'عمومی', icon: QuestionMarkCircleIcon },
  { value: 'account', label: 'حساب کاربری', icon: QuestionMarkCircleIcon },
  { value: 'courses', label: 'دوره‌ها', icon: QuestionMarkCircleIcon },
  { value: 'payment', label: 'پرداخت', icon: QuestionMarkCircleIcon },
  { value: 'technical', label: 'فنی', icon: QuestionMarkCircleIcon }
];

const FAQAccordion: React.FC<FAQAccordionProps> = ({
  items = mockFAQItems,
  searchable = true,
  categorizable = true,
  className = ''
}) => {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // فیلتر کردن آیتم‌ها بر اساس جستجو و دسته‌بندی
  const filteredItems = items.filter(item => {
    const matchesSearch = searchTerm === '' || 
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // مرتب‌سازی: ابتدا محبوب‌ها، سپس جدیدترین‌ها
  const sortedItems = filteredItems.sort((a, b) => {
    if (a.isPopular && !b.isPopular) return -1;
    if (!a.isPopular && b.isPopular) return 1;
    return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
  });

  const toggleItem = (itemId: string) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(itemId)) {
      newOpenItems.delete(itemId);
    } else {
      newOpenItems.add(itemId);
    }
    setOpenItems(newOpenItems);
  };

  const isItemOpen = (itemId: string) => openItems.has(itemId);

  const getCategoryName = (category: string) => {
    const option = categoryOptions.find(opt => opt.value === category);
    return option ? option.label : category;
  };

  const getCategoryColor = (category: FAQItem['category']) => {
    switch (category) {
      case 'general':
        return 'bg-blue-100 text-blue-800';
      case 'account':
        return 'bg-green-100 text-green-800';
      case 'courses':
        return 'bg-purple-100 text-purple-800';
      case 'payment':
        return 'bg-orange-100 text-orange-800';
      case 'technical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-lg shadow-sm border ${className}`}
      dir="rtl"
    >
      {/* هدر */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center space-x-3 space-x-reverse mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <QuestionMarkCircleIcon className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">سوالات متداول</h3>
            <p className="text-sm text-gray-600">
              پاسخ سوالات رایج در اینجا موجود است
            </p>
          </div>
        </div>

        {/* جستجو */}
        {searchable && (
          <div className="relative mb-4">
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="جستجو در سوالات متداول..."
            />
          </div>
        )}

        {/* دسته‌بندی */}
        {categorizable && (
          <div className="flex flex-wrap gap-2">
            {categoryOptions.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`flex items-center space-x-2 space-x-reverse px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <category.icon className="w-4 h-4" />
                <span>{category.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* محتوا */}
      <div className="p-6">
        {sortedItems.length === 0 ? (
          <div className="text-center py-8">
            <QuestionMarkCircleIcon className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">
              {searchTerm || selectedCategory !== 'all' 
                ? 'هیچ سوالی با فیلتر انتخابی یافت نشد'
                : 'سوالی موجود نیست'
              }
            </p>
            {(searchTerm || selectedCategory !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
                className="mt-2 text-blue-600 hover:text-blue-700 text-sm"
              >
                پاک کردن فیلترها
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {sortedItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                {/* سوال */}
                <button
                  onClick={() => toggleItem(item.id)}
                  className="w-full px-6 py-4 text-right bg-gray-50 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 flex items-start space-x-4 space-x-reverse">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 space-x-reverse mb-2">
                          <h4 className="text-md font-medium text-gray-900 text-right">
                            {item.question}
                          </h4>
                          {item.isPopular && (
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                              محبوب
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-3 space-x-reverse text-sm text-gray-500">
                          <span className={`px-2 py-1 rounded-full text-xs ${getCategoryColor(item.category)}`}>
                            {getCategoryName(item.category)}
                          </span>
                          <div className="flex items-center space-x-1 space-x-reverse">
                            <ClockIcon className="w-3 h-3" />
                            <span>{item.lastUpdated}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mr-4">
                      {isItemOpen(item.id) ? (
                        <ChevronUpIcon className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronDownIcon className="w-5 h-5 text-gray-500" />
                      )}
                    </div>
                  </div>
                </button>

                {/* پاسخ */}
                <AnimatePresence>
                  {isItemOpen(item.id) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white"
                    >
                      <div className="px-6 py-4 border-t border-gray-200">
                        <p className="text-gray-700 leading-relaxed mb-4">
                          {item.answer}
                        </p>
                        
                        {/* برچسب‌ها */}
                        {item.tags.length > 0 && (
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <TagIcon className="w-4 h-4 text-gray-400" />
                            <div className="flex flex-wrap gap-1">
                              {item.tags.map((tag, tagIndex) => (
                                <span
                                  key={tagIndex}
                                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}

        {/* آمار */}
        {sortedItems.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>
                {sortedItems.length} سوال نمایش داده شده
                {searchTerm && ` از ${items.length} سوال`}
              </span>
              <span>
                {openItems.size} سوال باز شده
              </span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default FAQAccordion; 