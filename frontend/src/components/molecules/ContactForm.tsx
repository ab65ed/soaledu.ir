'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useMutation } from '@tanstack/react-query';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { contactService } from '@/services/api';

// تایپ داده‌های فرم
type ContactFormData = {
  name: string;
  email: string;
  phone?: string;
  message: string;
  category: 'general' | 'support' | 'bug_report' | 'feature_request';
};

export default function ContactForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    defaultValues: { category: 'general' },
  });

  const contactMutation = useMutation({
    mutationFn: (data: ContactFormData) => contactService.sendMessage(data),
    onSuccess: () => {
      setIsSubmitted(true);
      reset();
      setTimeout(() => setIsSubmitted(false), 5000);
    },
  });

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center"
      >
        <CheckCircleIcon className="w-16 h-16 text-green-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-green-800 mb-2">
          پیام شما با موفقیت ارسال شد!
        </h3>
      </motion.div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">ارسال پیام</h2>
      
             <form onSubmit={handleSubmit((data) => contactMutation.mutate(data))} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            نام و نام خانوادگی *
          </label>
          <input
            {...register('name')}
            type="text"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="نام خود را وارد کنید"
          />
          {errors.name && (
            <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            آدرس ایمیل *
          </label>
          <input
            {...register('email')}
            type="email"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="example@email.com"
          />
          {errors.email && (
            <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            پیام شما *
          </label>
          <textarea
            {...register('message')}
            rows={6}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="پیام خود را اینجا بنویسید..."
          />
          {errors.message && (
            <p className="mt-2 text-sm text-red-600">{errors.message.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={contactMutation.isPending}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400"
        >
          {contactMutation.isPending ? 'در حال ارسال...' : 'ارسال پیام'}
        </button>
      </form>
    </div>
  );
} 