'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { useMutation } from '@tanstack/react-query';
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  PhoneIcon,
  EnvelopeIcon,
  UserIcon,
  ChatBubbleLeftRightIcon,
  TagIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline';
import { contactService } from '@/services/api';

// اعتبارسنجی فارسی با Zod
const contactFormSchema = z.object({
  name: z
    .string()
    .min(1, 'نام الزامی است')
    .min(2, 'نام باید حداقل ۲ کاراکتر باشد')
    .max(50, 'نام نباید بیش از ۵۰ کاراکتر باشد')
    .regex(/^[\u0600-\u06FF\s]+$/, 'نام باید به فارسی باشد'),
  
  email: z
    .string()
    .min(1, 'ایمیل الزامی است')
    .email('آدرس ایمیل معتبر نیست')
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'فرمت ایمیل صحیح نیست'),
  
  phone: z
    .string()
    .optional()
    .refine((phone) => {
      if (!phone) return true;
      // اعتبارسنجی شماره موبایل ایرانی
      const iranMobileRegex = /^(\+98|0)?9\d{9}$/;
      return iranMobileRegex.test(phone.replace(/\s/g, ''));
    }, 'شماره موبایل معتبر نیست (مثال: 09123456789)'),
  
  nationalId: z
    .string()
    .optional()
    .refine((nationalId) => {
      if (!nationalId) return true;
      // اعتبارسنجی کد ملی ایرانی
      if (nationalId.length !== 10) return false;
      if (/^(\d)\1{9}$/.test(nationalId)) return false; // تمام ارقام یکسان
      
      const check = parseInt(nationalId[9]);
      const sum = nationalId
        .slice(0, 9)
        .split('')
        .reduce((acc, digit, index) => acc + parseInt(digit) * (10 - index), 0);
      
      const remainder = sum % 11;
      return remainder < 2 ? check === remainder : check === 11 - remainder;
    }, 'کد ملی معتبر نیست'),
  
  message: z
    .string()
    .min(1, 'پیام الزامی است')
    .min(10, 'پیام باید حداقل ۱۰ کاراکتر باشد')
    .max(1000, 'پیام نباید بیش از ۱۰۰۰ کاراکتر باشد'),
  
  category: z.enum(['general', 'support', 'bug_report', 'feature_request', 'partnership', 'complaint'], {
    errorMap: () => ({ message: 'لطفاً دسته‌بندی را انتخاب کنید' })
  }),
  
  priority: z.enum(['low', 'medium', 'high', 'urgent'], {
    errorMap: () => ({ message: 'لطفاً اولویت را انتخاب کنید' })
  }),
  
  isStudent: z.boolean().optional(),
  
  agreeToTerms: z
    .boolean()
    .refine((val) => val === true, 'پذیرش قوانین الزامی است')
});

type ContactFormData = z.infer<typeof contactFormSchema>;

// گزینه‌های دسته‌بندی
const categoryOptions = [
  { value: 'general', label: 'سوال عمومی', icon: ChatBubbleLeftRightIcon },
  { value: 'support', label: 'پشتیبانی فنی', icon: ExclamationTriangleIcon },
  { value: 'bug_report', label: 'گزارش باگ', icon: ExclamationTriangleIcon },
  { value: 'feature_request', label: 'درخواست قابلیت', icon: TagIcon },
  { value: 'partnership', label: 'همکاری', icon: UserIcon },
  { value: 'complaint', label: 'شکایت', icon: ExclamationTriangleIcon }
];

// گزینه‌های اولویت
const priorityOptions = [
  { value: 'low', label: 'کم', color: 'text-green-600 bg-green-50' },
  { value: 'medium', label: 'متوسط', color: 'text-orange-600 bg-orange-50' },
  { value: 'high', label: 'زیاد', color: 'text-red-600 bg-red-50' },
  { value: 'urgent', label: 'فوری', color: 'text-purple-600 bg-purple-50' }
];

export default function ContactForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { 
      category: 'general',
      priority: 'medium',
      isStudent: false,
      agreeToTerms: false
    },
    mode: 'onChange'
  });

  const watchedPriority = watch('priority');
  const watchedMessage = watch('message');

  const contactMutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      setSubmitError(null);
      return contactService.sendMessage(data);
    },
    onSuccess: () => {
      setIsSubmitted(true);
      reset();
      setTimeout(() => setIsSubmitted(false), 8000);
    },
    onError: (error: Error) => {
      setSubmitError(error.message || 'خطا در ارسال پیام. لطفاً دوباره تلاش کنید.');
    }
  });

  const onSubmit = (data: ContactFormData) => {
    // پاک‌سازی داده‌ها قبل از ارسال
    const cleanData = {
      ...data,
      phone: data.phone?.replace(/\s/g, ''), // حذف فاصله‌ها
      name: data.name.trim(),
      message: data.message.trim()
    };
    
    contactMutation.mutate(cleanData);
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center"
        dir="rtl"
      >
        <CheckCircleIcon className="w-16 h-16 text-green-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-green-800 mb-2">
          پیام شما با موفقیت ارسال شد!
        </h3>
        <p className="text-green-700">
          پیام شما دریافت شد و به زودی پاسخ داده خواهد شد.
        </p>
        <p className="text-sm text-green-600 mt-2">
          معمولاً پاسخ‌ها ظرف ۲۴ ساعت ارسال می‌شوند.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8"
      dir="rtl"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">ارسال پیام</h2>
        <p className="text-gray-600">
          برای ارتباط با ما از فرم زیر استفاده کنید. تمامی پیام‌ها بررسی و پاسخ داده می‌شوند.
        </p>
      </div>
      
      {submitError && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6"
        >
          <div className="flex items-center space-x-2 space-x-reverse">
            <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
            <p className="text-red-800">{submitError}</p>
          </div>
        </motion.div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* نام */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <UserIcon className="w-4 h-4 inline ml-1" />
            نام و نام خانوادگی *
          </label>
          <input
            {...register('name')}
            type="text"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
              errors.name ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
            }`}
            placeholder="نام و نام خانوادگی خود را به فارسی وارد کنید"
          />
          {errors.name && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-2 text-sm text-red-600"
            >
              {errors.name.message}
            </motion.p>
          )}
        </div>

        {/* ایمیل */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <EnvelopeIcon className="w-4 h-4 inline ml-1" />
            آدرس ایمیل *
          </label>
          <input
            {...register('email')}
            type="email"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
              errors.email ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
            }`}
            placeholder="example@email.com"
            dir="ltr"
          />
          {errors.email && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-2 text-sm text-red-600"
            >
              {errors.email.message}
            </motion.p>
          )}
        </div>

        {/* شماره موبایل (اختیاری) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <PhoneIcon className="w-4 h-4 inline ml-1" />
            شماره موبایل (اختیاری)
          </label>
          <input
            {...register('phone')}
            type="tel"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
              errors.phone ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
            }`}
            placeholder="09123456789"
            dir="ltr"
          />
          {errors.phone && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-2 text-sm text-red-600"
            >
              {errors.phone.message}
            </motion.p>
          )}
        </div>

        {/* کد ملی (اختیاری) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            کد ملی (اختیاری)
          </label>
          <input
            {...register('nationalId')}
            type="text"
            maxLength={10}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
              errors.nationalId ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
            }`}
            placeholder="1234567890"
            dir="ltr"
          />
          {errors.nationalId && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-2 text-sm text-red-600"
            >
              {errors.nationalId.message}
            </motion.p>
          )}
        </div>

        {/* دسته‌بندی */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <TagIcon className="w-4 h-4 inline ml-1" />
            دسته‌بندی پیام *
          </label>
          <select
            {...register('category')}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
              errors.category ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
            }`}
          >
            {categoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.category && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-2 text-sm text-red-600"
            >
              {errors.category.message}
            </motion.p>
          )}
        </div>

        {/* اولویت */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            اولویت پیام *
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {priorityOptions.map((option) => (
              <label
                key={option.value}
                className={`relative flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-colors ${
                  watchedPriority === option.value
                    ? `${option.color} border-current`
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <input
                  {...register('priority')}
                  type="radio"
                  value={option.value}
                  className="sr-only"
                />
                <span className="text-sm font-medium">{option.label}</span>
              </label>
            ))}
          </div>
          {errors.priority && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-2 text-sm text-red-600"
            >
              {errors.priority.message}
            </motion.p>
          )}
        </div>

        {/* چک‌باکس دانش‌آموز */}
        <div className="flex items-center">
          <input
            {...register('isStudent')}
            id="isStudent"
            type="checkbox"
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="isStudent" className="mr-2 text-sm text-gray-700">
            من دانش‌آموز هستم
          </label>
        </div>

        {/* پیام */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <ChatBubbleLeftRightIcon className="w-4 h-4 inline ml-1" />
            پیام شما *
          </label>
          <textarea
            {...register('message')}
            rows={6}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors resize-none ${
              errors.message ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
            }`}
            placeholder="پیام خود را با جزئیات کامل اینجا بنویسید..."
          />
          <div className="flex justify-between items-center mt-1">
            {errors.message ? (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-red-600"
              >
                {errors.message.message}
              </motion.p>
            ) : (
              <span className="text-sm text-gray-500">
                حداقل ۱۰ کاراکتر الزامی است
              </span>
            )}
            <span className={`text-sm ${
              watchedMessage?.length > 900 ? 'text-red-600' : 'text-gray-500'
            }`}>
              {watchedMessage?.length || 0}/1000
            </span>
          </div>
        </div>

        {/* پذیرش قوانین */}
        <div className="flex items-start">
          <input
            {...register('agreeToTerms')}
            id="agreeToTerms"
            type="checkbox"
            className={`w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1 ${
              errors.agreeToTerms ? 'border-red-300' : ''
            }`}
          />
          <label htmlFor="agreeToTerms" className="mr-2 text-sm text-gray-700">
            من <a href="/terms" className="text-blue-600 hover:underline">قوانین و مقررات</a> را مطالعه کرده و می‌پذیرم *
          </label>
        </div>
        {errors.agreeToTerms && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-red-600"
          >
            {errors.agreeToTerms.message}
          </motion.p>
        )}

        {/* دکمه ارسال */}
        <button
          type="submit"
          disabled={contactMutation.isPending || !isValid}
          className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 space-x-reverse ${
            contactMutation.isPending || !isValid
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
          } text-white`}
        >
          {contactMutation.isPending ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>در حال ارسال...</span>
            </>
          ) : (
            <>
              <PaperAirplaneIcon className="w-4 h-4" />
              <span>ارسال پیام</span>
            </>
          )}
        </button>
      </form>

      {/* راهنمایی */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="text-sm font-medium text-blue-900 mb-2">نکات مهم:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• تمامی فیلدهای ستاره‌دار الزامی هستند</li>
          <li>• پاسخ‌ها معمولاً ظرف ۲۴ ساعت ارسال می‌شوند</li>
          <li>• برای پیگیری سریع‌تر، شماره موبایل خود را وارد کنید</li>
          <li>• در صورت مشکل فنی، لطفاً جزئیات کامل ارائه دهید</li>
        </ul>
      </div>
    </motion.div>
  );
} 