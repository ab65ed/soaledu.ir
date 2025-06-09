/**
 * کامپوننت فرم ورود - Login Form Component
 * شامل اعتبارسنجی با Zod، React Hook Form، و انیمیشن‌های Framer Motion
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '@/stores/authStore';
import { authService } from '@/services/api';

// اسکمای اعتبارسنجی با Zod
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'ایمیل یا شماره موبایل الزامی است')
    .refine(
      (value) => {
        // بررسی ایمیل
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // بررسی شماره موبایل ایرانی
        const mobileRegex = /^(\+98|0)?9\d{9}$/;
        return emailRegex.test(value) || mobileRegex.test(value);
      },
      'فرمت ایمیل یا شماره موبایل صحیح نیست'
    ),
  password: z
    .string()
    .min(12, 'رمز عبور باید حداقل ۱۲ کاراکتر باشد')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'رمز عبور باید شامل حروف بزرگ، کوچک، عدد و کاراکتر خاص باشد'
    ),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const { login, setLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
  });

  // Rate limiting: ذخیره زمان آخرین درخواست
  const checkRateLimit = () => {
    const lastAttempt = localStorage.getItem('lastLoginAttempt');
    const now = Date.now();
    
    if (lastAttempt) {
      const timeDiff = now - parseInt(lastAttempt);
      // محدودیت ۵ درخواست در دقیقه (12 ثانیه بین هر درخواست)
      if (timeDiff < 12000) {
        throw new Error('لطفاً کمی صبر کنید و دوباره تلاش کنید');
      }
    }
    
    localStorage.setItem('lastLoginAttempt', now.toString());
  };

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoginError(null);
      setLoading(true);
      
      // بررسی rate limiting
      checkRateLimit();

      // ارسال درخواست ورود
      const response = await authService.login({
        email: data.email,
        password: data.password,
      });

      // ذخیره اطلاعات کاربر و هدایت
      login(response.user, response.token);
      
      // هدایت به داشبورد مناسب
      const dashboardRoute = response.user.role ? `/${response.user.role}` : '/';
      router.push(dashboardRoute);

    } catch (error) {
      setLoading(false);
      
      if (error instanceof Error) {
        // بررسی نوع خطا برای نمایش پیام مناسب
        if (error.message.includes('credentials')) {
          setError('email', { message: 'ایمیل یا رمز عبور اشتباه است' });
          setError('password', { message: 'ایمیل یا رمز عبور اشتباه است' });
        } else if (error.message.includes('blocked')) {
          setLoginError('حساب کاربری شما موقتاً مسدود شده است. لطفاً با پشتیبانی تماس بگیرید.');
        } else {
          setLoginError(error.message);
        }
      } else {
        setLoginError('خطای غیرمنتظره‌ای رخ داد. لطفاً دوباره تلاش کنید.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* پیام خطای کلی */}
      {loginError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-md p-4"
        >
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="mr-3">
              <p className="text-sm text-red-800">{loginError}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* فیلد ایمیل/موبایل */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          ایمیل یا شماره موبایل
        </label>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <input
            {...register('email')}
            type="text"
            id="email"
            dir="ltr"
            placeholder="example@domain.com یا 09123456789"
            className={`appearance-none rounded-md relative block w-full px-3 py-2 border text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition-colors ${
              errors.email ? 'border-red-300' : 'border-gray-300'
            }`}
          />
        </motion.div>
        {errors.email && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1 text-sm text-red-600"
          >
            {errors.email.message}
          </motion.p>
        )}
      </div>

      {/* فیلد رمز عبور */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          رمز عبور
        </label>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="relative"
        >
          <input
            {...register('password')}
            type={showPassword ? 'text' : 'password'}
            id="password"
            dir="ltr"
            placeholder="حداقل ۱۲ کاراکتر"
            className={`appearance-none rounded-md relative block w-full px-3 py-2 pl-10 border text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition-colors ${
              errors.password ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          <button
            type="button"
            className="absolute inset-y-0 left-0 pl-3 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
            ) : (
              <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
            )}
          </button>
        </motion.div>
        {errors.password && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1 text-sm text-red-600"
          >
            {errors.password.message}
          </motion.p>
        )}
      </div>

      {/* چک‌باکس مرا به خاطر بسپار */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="remember-me" className="mr-2 block text-sm text-gray-900">
            مرا به خاطر بسپار
          </label>
        </div>

        <div className="text-sm">
          <a
            href="/auth/forgot-password"
            className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
          >
            رمز عبور را فراموش کرده‌اید؟
          </a>
        </div>
      </div>

      {/* دکمه ورود */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <button
          type="submit"
          disabled={isSubmitting}
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin -ml-1 mr-3 h-4 w-4" />
              در حال ورود...
            </>
          ) : (
            'ورود'
          )}
        </button>
      </motion.div>
    </form>
  );
} 