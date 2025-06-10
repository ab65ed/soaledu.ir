'use client';

/**
 * صفحه فراموشی رمز عبور - Forgot Password Page
 * صفحه شامل ویزارد ۳ مرحله‌ای برای بازیابی رمز عبور
 */

import Link from 'next/link';
import { useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import ForgotPasswordWizard from '@/components/auth/ForgotPasswordWizard';

export default function ForgotPasswordPage() {
  const router = useRouter();

  // تنظیم metadata از طریق Head
  useEffect(() => {
    document.title = 'فراموشی رمز عبور | سوال‌ایدو';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'بازیابی رمز عبور حساب کاربری خود در سوال‌ایدو');
    }
    const metaRobots = document.querySelector('meta[name="robots"]');
    if (metaRobots) {
      metaRobots.setAttribute('content', 'noindex, nofollow');
    }
  }, []);

  return (
    <>
      <Head>
        <title>فراموشی رمز عبور | سوال‌ایدو</title>
        <meta name="description" content="بازیابی رمز عبور حساب کاربری خود در سوال‌ایدو" />
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

          {/* ویزارد فراموشی رمز */}
          <ForgotPasswordWizard
            onCancel={() => {
              // هدایت به صفحه ورود
              router.push('/auth/login');
            }}
          />

          {/* فوتر */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              حساب کاربری ندارید؟{' '}
              <Link
                href="/auth/register"
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
              >
                ثبت‌نام کنید
              </Link>
            </p>
          </div>

          {/* لینک‌های کمکی */}
          <div className="mt-6 text-center">
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-sm text-gray-500">
              <Link
                href="/contact"
                className="hover:text-gray-700 transition-colors"
              >
                تماس با پشتیبانی
              </Link>
              <span className="hidden sm:inline">•</span>
              <Link
                href="/help/password-recovery"
                className="hover:text-gray-700 transition-colors"
              >
                راهنمای بازیابی رمز
              </Link>
              <span className="hidden sm:inline">•</span>
              <Link
                href="/privacy"
                className="hover:text-gray-700 transition-colors"
              >
                حریم خصوصی
              </Link>
            </div>
          </div>

          {/* اطلاعات امنیتی */}
          <div className="mt-8 max-w-md mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200 p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-2">
                اطلاعات امنیتی
              </h3>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• کد تأیید فقط ۱۰ دقیقه معتبر است</li>
                <li>• در صورت عدم دریافت کد، پوشه spam را بررسی کنید</li>
                <li>• حداکثر ۳ بار در ساعت می‌توانید درخواست دهید</li>
                <li>• اطلاعات شما به صورت امن ارسال می‌شود</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 