'use client';

/**
 * صفحه ریست رمز عبور - Reset Password Page
 * صفحه شامل فرم تغییر رمز عبور با توکن امنیتی
 */

import Link from 'next/link';
import { Suspense, useEffect } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';

// کامپوننت Loading برای Suspense
function FormLoading() {
  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6 text-center" dir="rtl">
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">در حال بارگذاری...</h2>
      <p className="text-gray-600">لطفاً منتظر بمانید</p>
    </div>
  );
}

export default function ResetPasswordPage() {
  const router = useRouter();

  // تنظیم metadata از طریق Head
  useEffect(() => {
    document.title = 'تعیین رمز عبور جدید | سوال‌ایدو';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'تعیین رمز عبور جدید برای حساب کاربری خود در سوال‌ایدو');
    }
    const metaRobots = document.querySelector('meta[name="robots"]');
    if (metaRobots) {
      metaRobots.setAttribute('content', 'noindex, nofollow');
    }
  }, []);

  return (
    <>
      <Head>
        <title>تعیین رمز عبور جدید | سوال‌ایدو</title>
        <meta name="description" content="تعیین رمز عبور جدید برای حساب کاربری خود در سوال‌ایدو" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8" dir="rtl">
        {/* بک‌گراند انیمیشن */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-1000"></div>
          <div className="absolute top-40 left-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-2000"></div>
        </div>

        {/* محتوای اصلی */}
        <div className="relative">
          {/* هدر و بازگشت */}
          <div className="sm:mx-auto sm:w-full sm:max-w-md mb-8">
            <Link
              href="/auth/login"
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors mb-4"
            >
              <ArrowRight className="w-4 h-4 ml-1" />
              بازگشت به ورود
            </Link>
          </div>

          {/* فرم ریست رمز */}
          <Suspense fallback={<FormLoading />}>
            <ResetPasswordForm
              onCancel={() => {
                // هدایت به صفحه ورود
                router.push('/auth/login');
              }}
            />
          </Suspense>

          {/* فوتر */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              مشکلی دارید؟{' '}
              <Link
                href="/contact"
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
              >
                با پشتیبانی تماس بگیرید
              </Link>
            </p>
          </div>

          {/* لینک‌های کمکی */}
          <div className="mt-6 text-center">
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-sm text-gray-500">
              <Link
                href="/auth/forgot-password"
                className="hover:text-gray-700 transition-colors"
              >
                درخواست لینک جدید
              </Link>
              <span className="hidden sm:inline">•</span>
              <Link
                href="/help/password-reset"
                className="hover:text-gray-700 transition-colors"
              >
                راهنمای تغییر رمز
              </Link>
              <span className="hidden sm:inline">•</span>
              <Link
                href="/security"
                className="hover:text-gray-700 transition-colors"
              >
                نکات امنیتی
              </Link>
            </div>
          </div>

          {/* اطلاعات امنیتی */}
          <div className="mt-8 max-w-md mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200 p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-2">
                الزامات رمز عبور امن
              </h3>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• حداقل ۱۲ کاراکتر</li>
                <li>• ترکیب حروف بزرگ و کوچک</li>
                <li>• شامل اعداد و کاراکترهای خاص</li>
                <li>• بدون اطلاعات شخصی (نام، تاریخ تولد)</li>
                <li>• متفاوت از رمزهای قبلی</li>
              </ul>
            </div>
          </div>

          {/* هشدار امنیتی */}
          <div className="mt-4 max-w-md mx-auto">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="mr-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    نکته امنیتی
                  </h3>
                  <div className="mt-1 text-xs text-yellow-700">
                    <p>
                      پس از تغییر رمز عبور، از تمام دستگاه‌ها خارج شده و مجدداً وارد خواهید شد.
                      این کار برای اطمینان از امنیت حساب شما انجام می‌شود.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 