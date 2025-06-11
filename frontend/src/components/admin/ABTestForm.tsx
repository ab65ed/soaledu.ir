'use client';

import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BeakerIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  TrashIcon,
  
  ChartBarIcon,
  UserGroupIcon,
  CalendarIcon,
  
  AdjustmentsHorizontalIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  PlayIcon,
  PauseIcon,
  StopIcon
} from '@heroicons/react/24/outline';

// اسکیمای اعتبارسنجی برای A/B Test
const abTestSchema = z.object({
  name: z
    .string()
    .min(1, 'نام آزمون الزامی است')
    .min(3, 'نام آزمون باید حداقل ۳ کاراکتر باشد')
    .max(100, 'نام آزمون نباید بیش از ۱۰۰ کاراکتر باشد'),
  
  description: z
    .string()
    .min(1, 'توضیحات الزامی است')
    .min(10, 'توضیحات باید حداقل ۱۰ کاراکتر باشد')
    .max(500, 'توضیحات نباید بیش از ۵۰۰ کاراکتر باشد'),
  
  hypothesis: z
    .string()
    .min(1, 'فرضیه الزامی است')
    .min(20, 'فرضیه باید حداقل ۲۰ کاراکتر باشد'),
  
  targetMetric: z
    .string()
    .min(1, 'متریک هدف الزامی است'),
  
  targetAudience: z
    .string()
    .min(1, 'مخاطب هدف الزامی است'),
  
  trafficPercentage: z
    .number()
    .min(1, 'درصد ترافیک باید حداقل ۱ باشد')
    .max(100, 'درصد ترافیک نباید بیش از ۱۰۰ باشد'),
  
  startDate: z
    .string()
    .min(1, 'تاریخ شروع الزامی است'),
  
  endDate: z
    .string()
    .min(1, 'تاریخ پایان الزامی است'),
  
  variants: z
    .array(
      z.object({
        name: z.string().min(1, 'نام ورژن الزامی است'),
        description: z.string().min(1, 'توضیحات ورژن الزامی است'),
        trafficSplit: z.number().min(0).max(100),
        config: z.record(z.any()).optional()
      })
    )
    .min(2, 'حداقل ۲ ورژن الزامی است')
    .max(5, 'حداکثر ۵ ورژن مجاز است'),
  
  tags: z
    .array(z.string())
    .optional(),
  
  priority: z
    .enum(['low', 'medium', 'high', 'critical'])
    .default('medium'),
  
  isActive: z
    .boolean()
    .default(false)
});

type ABTestFormData = z.infer<typeof abTestSchema>;

// انواع داده‌ها برای جستجو و فیلتر
interface SearchFilters {
  query: string;
  status: 'all' | 'draft' | 'running' | 'paused' | 'completed';
  priority: 'all' | 'low' | 'medium' | 'high' | 'critical';
  dateRange: 'all' | 'week' | 'month' | 'quarter';
  tag: string;
}

interface ExistingABTest {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'running' | 'paused' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  createdAt: string;
  startDate: string;
  endDate: string;
  variants: number;
  participants: number;
  tags: string[];
}

interface ABTestFormProps {
  onSubmit?: (data: ABTestFormData) => void;
  initialData?: Partial<ABTestFormData>;
  editMode?: boolean;
  className?: string;
}

// داده‌های نمونه آزمون‌های موجود
const mockExistingTests: ExistingABTest[] = [
  {
    id: 'test-001',
    name: 'بهینه‌سازی دکمه ثبت‌نام',
    description: 'مقایسه رنگ‌های مختلف دکمه ثبت‌نام',
    status: 'running',
    priority: 'high',
    createdAt: '1403/10/15',
    startDate: '1403/10/20',
    endDate: '1403/11/20',
    variants: 3,
    participants: 1247,
    tags: ['UI', 'ثبت‌نام', 'تبدیل']
  },
  {
    id: 'test-002',
    name: 'تست صفحه اصلی جدید',
    description: 'بررسی تأثیر طراحی جدید صفحه اصلی',
    status: 'completed',
    priority: 'medium',
    createdAt: '1403/09/10',
    startDate: '1403/09/15',
    endDate: '1403/10/15',
    variants: 2,
    participants: 3542,
    tags: ['صفحه اصلی', 'UX', 'طراحی']
  },
  {
    id: 'test-003',
    name: 'بهینه‌سازی فرم پرداخت',
    description: 'کاهش مراحل پرداخت',
    status: 'paused',
    priority: 'critical',
    createdAt: '1403/10/01',
    startDate: '1403/10/05',
    endDate: '1403/11/05',
    variants: 2,
    participants: 892,
    tags: ['پرداخت', 'فرم', 'تبدیل']
  }
];

const ABTestForm: React.FC<ABTestFormProps> = ({
  onSubmit,
  initialData,
  editMode = false,
  className = ''
}) => {
      const [existingTests] = useState<ExistingABTest[]>(mockExistingTests);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    query: '',
    status: 'all',
    priority: 'all',
    dateRange: 'all',
    tag: ''
  });
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [currentView, setCurrentView] = useState<'form' | 'list'>('form');

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
    reset
  } = useForm<ABTestFormData>({
    resolver: zodResolver(abTestSchema),
    defaultValues: {
      name: '',
      description: '',
      hypothesis: '',
      targetMetric: 'conversion_rate',
      targetAudience: 'all_users',
      trafficPercentage: 50,
      startDate: '',
      endDate: '',
      variants: [
        { name: 'کنترل (A)', description: 'ورژن فعلی', trafficSplit: 50, config: {} },
        { name: 'متغیر (B)', description: 'ورژن جدید', trafficSplit: 50, config: {} }
      ],
      tags: [],
      priority: 'medium',
      isActive: false,
      ...initialData
    },
    mode: 'onChange'
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'variants'
  });

  const watchedVariants = watch('variants');
  const watchedTrafficPercentage = watch('trafficPercentage');

  // اعتبارسنجی تقسیم ترافیک
  const totalTrafficSplit = watchedVariants?.reduce((sum, variant) => sum + (variant.trafficSplit || 0), 0) || 0;

  // فیلتر کردن آزمون‌های موجود
  const filteredTests = existingTests.filter(test => {
    const matchesQuery = searchFilters.query === '' || 
      test.name.toLowerCase().includes(searchFilters.query.toLowerCase()) ||
      test.description.toLowerCase().includes(searchFilters.query.toLowerCase()) ||
      test.tags.some(tag => tag.toLowerCase().includes(searchFilters.query.toLowerCase()));
    
    const matchesStatus = searchFilters.status === 'all' || test.status === searchFilters.status;
    const matchesPriority = searchFilters.priority === 'all' || test.priority === searchFilters.priority;
    const matchesTag = searchFilters.tag === '' || test.tags.includes(searchFilters.tag);
    
    return matchesQuery && matchesStatus && matchesPriority && matchesTag;
  });

  const getStatusColor = (status: ExistingABTest['status']) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'running':
        return 'bg-green-100 text-green-800';
      case 'paused':
        return 'bg-orange-100 text-orange-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: ExistingABTest['status']) => {
    switch (status) {
      case 'draft': return 'پیش‌نویس';
      case 'running': return 'در حال اجرا';
      case 'paused': return 'متوقف شده';
      case 'completed': return 'تکمیل شده';
      default: return status;
    }
  };

  const getPriorityColor = (priority: ExistingABTest['priority']) => {
    switch (priority) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-orange-600';
      case 'high': return 'text-red-600';
      case 'critical': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  const addVariant = () => {
    if (fields.length < 5) {
      append({
        name: `ورژن ${String.fromCharCode(65 + fields.length)}`,
        description: '',
        trafficSplit: Math.floor(100 / (fields.length + 1)),
        config: {}
      });
    }
  };

  const removeVariant = (index: number) => {
    if (fields.length > 2) {
      remove(index);
    }
  };

  const handleFormSubmit = (data: ABTestFormData) => {
    if (totalTrafficSplit !== 100) {
      alert('مجموع تقسیم ترافیک باید ۱۰۰ درصد باشد');
      return;
    }
    
    onSubmit?.(data);
  };

  const resetForm = () => {
    reset();
  };

  // تمامی تگ‌های منحصربه‌فرد
  const allTags = Array.from(new Set(existingTests.flatMap(test => test.tags)));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-lg shadow-sm border ${className}`}
      dir="rtl"
    >
      {/* هدر */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="p-2 bg-purple-100 rounded-lg">
              <BeakerIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {editMode ? 'ویرایش A/B Test' : 'ایجاد A/B Test جدید'}
              </h3>
              <p className="text-sm text-gray-600">
                طراحی و مدیریت آزمون‌های A/B برای بهینه‌سازی
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 space-x-reverse">
            <button
              onClick={() => setCurrentView(currentView === 'form' ? 'list' : 'form')}
              className={`px-3 py-2 text-sm rounded-md transition-colors ${
                currentView === 'form'
                  ? 'bg-purple-100 text-purple-700'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {currentView === 'form' ? 'نمایش لیست' : 'فرم جدید'}
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {currentView === 'list' ? (
          <div className="space-y-6">
            {/* جستجوی پیشرفته */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-gray-900">جستجو و فیلتر</h4>
                <button
                  onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                  className="flex items-center space-x-1 space-x-reverse text-sm text-gray-600 hover:text-gray-800"
                >
                  <AdjustmentsHorizontalIcon className="w-4 h-4" />
                  <span>جستجوی پیشرفته</span>
                </button>
              </div>

              {/* جستجوی ساده */}
              <div className="relative mb-4">
                <MagnifyingGlassIcon className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchFilters.query}
                  onChange={(e) => setSearchFilters(prev => ({ ...prev, query: e.target.value }))}
                  className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="جستجو در نام، توضیحات یا تگ‌ها..."
                />
              </div>

              {/* فیلترهای پیشرفته */}
              <AnimatePresence>
                {showAdvancedSearch && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="grid grid-cols-1 md:grid-cols-4 gap-4"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        وضعیت
                      </label>
                      <select
                        value={searchFilters.status}
                        onChange={(e) => setSearchFilters(prev => ({ 
                          ...prev, 
                          status: e.target.value as SearchFilters['status'] 
                        }))}
                        className="w-full p-2 border border-gray-300 rounded-md text-sm"
                      >
                        <option value="all">همه وضعیت‌ها</option>
                        <option value="draft">پیش‌نویس</option>
                        <option value="running">در حال اجرا</option>
                        <option value="paused">متوقف شده</option>
                        <option value="completed">تکمیل شده</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        اولویت
                      </label>
                      <select
                        value={searchFilters.priority}
                        onChange={(e) => setSearchFilters(prev => ({ 
                          ...prev, 
                          priority: e.target.value as SearchFilters['priority'] 
                        }))}
                        className="w-full p-2 border border-gray-300 rounded-md text-sm"
                      >
                        <option value="all">همه اولویت‌ها</option>
                        <option value="low">کم</option>
                        <option value="medium">متوسط</option>
                        <option value="high">زیاد</option>
                        <option value="critical">بحرانی</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        بازه زمانی
                      </label>
                      <select
                        value={searchFilters.dateRange}
                        onChange={(e) => setSearchFilters(prev => ({ 
                          ...prev, 
                          dateRange: e.target.value as SearchFilters['dateRange'] 
                        }))}
                        className="w-full p-2 border border-gray-300 rounded-md text-sm"
                      >
                        <option value="all">همه زمان‌ها</option>
                        <option value="week">هفته اخیر</option>
                        <option value="month">ماه اخیر</option>
                        <option value="quarter">سه ماه اخیر</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        تگ
                      </label>
                      <select
                        value={searchFilters.tag}
                        onChange={(e) => setSearchFilters(prev => ({ ...prev, tag: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded-md text-sm"
                      >
                        <option value="">همه تگ‌ها</option>
                        {allTags.map(tag => (
                          <option key={tag} value={tag}>{tag}</option>
                        ))}
                      </select>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* نتایج جستجو */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-gray-900">
                  آزمون‌های موجود ({filteredTests.length})
                </h4>
                <button
                  onClick={() => setCurrentView('form')}
                  className="flex items-center space-x-1 space-x-reverse px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <PlusIcon className="w-4 h-4" />
                  <span>آزمون جدید</span>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredTests.map((test) => (
                  <motion.div
                    key={test.id}
                    whileHover={{ scale: 1.02 }}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h5 className="font-medium text-gray-900 mb-1">{test.name}</h5>
                        <p className="text-sm text-gray-600 line-clamp-2">{test.description}</p>
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(test.status)}`}>
                          {getStatusText(test.status)}
                        </span>
                        <span className={`text-xs font-medium ${getPriorityColor(test.priority)}`}>
                          اولویت {test.priority}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center space-x-1 space-x-reverse">
                        <UserGroupIcon className="w-4 h-4" />
                        <span>{test.participants.toLocaleString('fa-IR')} شرکت‌کننده</span>
                      </div>
                      <div className="flex items-center space-x-1 space-x-reverse">
                        <ChartBarIcon className="w-4 h-4" />
                        <span>{test.variants} ورژن</span>
                      </div>
                      <div className="flex items-center space-x-1 space-x-reverse">
                        <CalendarIcon className="w-4 h-4" />
                        <span>{test.startDate}</span>
                      </div>
                      <div className="flex items-center space-x-1 space-x-reverse">
                        <CalendarIcon className="w-4 h-4" />
                        <span>{test.endDate}</span>
                      </div>
                    </div>

                    {test.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {test.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        {test.status === 'running' && (
                          <button className="p-1 text-orange-600 hover:text-orange-700">
                            <PauseIcon className="w-4 h-4" />
                          </button>
                        )}
                        {test.status === 'paused' && (
                          <button className="p-1 text-green-600 hover:text-green-700">
                            <PlayIcon className="w-4 h-4" />
                          </button>
                        )}
                        <button className="p-1 text-red-600 hover:text-red-700">
                          <StopIcon className="w-4 h-4" />
                        </button>
                      </div>
                      <button className="text-sm text-purple-600 hover:text-purple-700">
                        مشاهده جزئیات
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {filteredTests.length === 0 && (
                <div className="text-center py-8">
                  <BeakerIcon className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500">آزمونی با فیلتر انتخابی یافت نشد</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            {/* اطلاعات کلی */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-4">اطلاعات کلی</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    نام آزمون *
                  </label>
                  <input
                    {...register('name')}
                    type="text"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 ${
                      errors.name ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="نام توصیفی برای آزمون"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    اولویت
                  </label>
                  <select
                    {...register('priority')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="low">کم</option>
                    <option value="medium">متوسط</option>
                    <option value="high">زیاد</option>
                    <option value="critical">بحرانی</option>
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  توضیحات *
                </label>
                <textarea
                  {...register('description')}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 resize-none ${
                    errors.description ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="توضیح مختصر از هدف و روش آزمون"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  فرضیه آزمون *
                </label>
                <textarea
                  {...register('hypothesis')}
                  rows={2}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 resize-none ${
                    errors.hypothesis ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="فرضیه‌ای که می‌خواهید آزمون کنید"
                />
                {errors.hypothesis && (
                  <p className="mt-1 text-sm text-red-600">{errors.hypothesis.message}</p>
                )}
              </div>
            </div>

            {/* تنظیمات آزمون */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-4">تنظیمات آزمون</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    متریک هدف *
                  </label>
                  <select
                    {...register('targetMetric')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="conversion_rate">نرخ تبدیل</option>
                    <option value="click_through_rate">نرخ کلیک</option>
                    <option value="bounce_rate">نرخ پرش</option>
                    <option value="time_on_page">زمان حضور در صفحه</option>
                    <option value="revenue">درآمد</option>
                    <option value="user_engagement">تعامل کاربر</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    مخاطب هدف *
                  </label>
                  <select
                    {...register('targetAudience')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="all_users">همه کاربران</option>
                    <option value="new_users">کاربران جدید</option>
                    <option value="returning_users">کاربران بازگشتی</option>
                    <option value="mobile_users">کاربران موبایل</option>
                    <option value="desktop_users">کاربران دسکتاپ</option>
                    <option value="students">دانش‌آموزان</option>
                    <option value="teachers">معلمان</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    درصد ترافیک *
                  </label>
                  <input
                    {...register('trafficPercentage', { valueAsNumber: true })}
                    type="number"
                    min="1"
                    max="100"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 ${
                      errors.trafficPercentage ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="درصد کاربرانی که در آزمون شرکت می‌کنند"
                  />
                  {errors.trafficPercentage && (
                    <p className="mt-1 text-sm text-red-600">{errors.trafficPercentage.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    تاریخ شروع *
                  </label>
                  <input
                    {...register('startDate')}
                    type="date"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 ${
                      errors.startDate ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.startDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    تاریخ پایان *
                  </label>
                  <input
                    {...register('endDate')}
                    type="date"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 ${
                      errors.endDate ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.endDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.endDate.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* ورژن‌ها (Variants) */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-gray-900">ورژن‌های آزمون</h4>
                <button
                  type="button"
                  onClick={addVariant}
                  disabled={fields.length >= 5}
                  className="flex items-center space-x-1 space-x-reverse px-3 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  <PlusIcon className="w-4 h-4" />
                  <span>افزودن ورژن</span>
                </button>
              </div>

              {/* هشدار تقسیم ترافیک */}
              {totalTrafficSplit !== 100 && (
                <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <ExclamationTriangleIcon className="w-5 h-5 text-orange-600" />
                    <span className="text-sm text-orange-800">
                      مجموع تقسیم ترافیک باید ۱۰۰ درصد باشد. فعلاً: {totalTrafficSplit}%
                    </span>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {fields.map((field, index) => (
                  <motion.div
                    key={field.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border border-gray-200 rounded-lg p-4 bg-white"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-medium text-gray-900">ورژن {index + 1}</h5>
                      {fields.length > 2 && (
                        <button
                          type="button"
                          onClick={() => removeVariant(index)}
                          className="p-1 text-red-600 hover:text-red-700"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          نام ورژن *
                        </label>
                        <input
                          {...register(`variants.${index}.name`)}
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                          placeholder="نام ورژن"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          درصد ترافیک *
                        </label>
                        <input
                          {...register(`variants.${index}.trafficSplit`, { valueAsNumber: true })}
                          type="number"
                          min="0"
                          max="100"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                          placeholder="درصد"
                        />
                      </div>

                      <div className="md:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          توضیحات *
                        </label>
                        <input
                          {...register(`variants.${index}.description`)}
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                          placeholder="توضیح مختصر از تغییرات"
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* دکمه‌های عملیات */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-2 space-x-reverse">
                <div className="flex items-center">
                  <input
                    {...register('isActive')}
                    id="isActive"
                    type="checkbox"
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <label htmlFor="isActive" className="mr-2 text-sm text-gray-700">
                    فعال کردن آزمون پس از ایجاد
                  </label>
                </div>
              </div>

              <div className="flex items-center space-x-2 space-x-reverse">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  پاک کردن
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentView('list')}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={!isValid || totalTrafficSplit !== 100}
                  className="flex items-center space-x-2 space-x-reverse px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  <CheckCircleIcon className="w-4 h-4" />
                  <span>{editMode ? 'ذخیره تغییرات' : 'ایجاد آزمون'}</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </motion.div>
  );
};

export default ABTestForm; 