/**
 * کامپوننت فرم ریست رمز عبور - Reset Password Form Component
 * فرم تغییر رمز عبور با انیمیشن، اعتبارسنجی قوی، و امنیت
 */

'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { 
  Eye, 
  EyeOff, 
  Lock, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Shield,
  Check,
  X
} from 'lucide-react';
import { authService } from '@/services/api';

// اسکمای اعتبارسنجی رمز عبور قوی
const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(12, 'رمز عبور باید حداقل ۱۲ کاراکتر باشد')
    .max(128, 'رمز عبور نباید بیشتر از ۱۲۸ کاراکتر باشد')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'رمز عبور باید شامل حروف بزرگ، کوچک، عدد و کاراکتر خاص باشد'
    ),
  confirmPassword: z.string().min(1, 'تأیید رمز عبور الزامی است'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'رمزهای عبور مطابقت ندارند',
  path: ['confirmPassword'],
});

type ResetPasswordData = z.infer<typeof resetPasswordSchema>;

interface ResetPasswordFormProps {
  token?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

// کامپوننت نشانگر قدرت رمز عبور
function PasswordStrengthIndicator({ password }: { password: string }) {
  if (!password) return null;

  const checks = [
    { label: 'حداقل ۱۲ کاراکتر', test: password.length >= 12 },
    { label: 'حروف بزرگ و کوچک', test: /^(?=.*[a-z])(?=.*[A-Z])/.test(password) },
    { label: 'حداقل یک عدد', test: /\d/.test(password) },
    { label: 'کاراکتر خاص (@$!%*?&)', test: /[@$!%*?&]/.test(password) },
    { label: 'بدون کلمات متداول', test: !/(password|123456|qwerty|admin)/i.test(password) },
  ];

  const passedChecks = checks.filter(check => check.test).length;
  const strength = passedChecks / checks.length;

  const getStrengthColor = () => {
    if (strength < 0.4) return 'bg-red-500';
    if (strength < 0.7) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStrengthText = () => {
    if (strength < 0.4) return 'ضعیف';
    if (strength < 0.7) return 'متوسط';
    return 'قوی';
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      className="mt-2 p-3 bg-gray-50 rounded-md"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">قدرت رمز عبور:</span>
        <span className={`text-sm font-medium ${
          strength < 0.4 ? 'text-red-600' : 
          strength < 0.7 ? 'text-yellow-600' : 'text-green-600'
        }`}>
          {getStrengthText()}
        </span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
        <motion.div
          className={`h-2 rounded-full ${getStrengthColor()}`}
          initial={{ width: 0 }}
          animate={{ width: `${strength * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div className="space-y-1">
        {checks.map((check, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center text-xs"
          >
            {check.test ? (
              <Check className="w-3 h-3 text-green-500 ml-1" />
            ) : (
              <X className="w-3 h-3 text-red-500 ml-1" />
            )}
            <span className={check.test ? 'text-green-700' : 'text-red-700'}>
              {check.label}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default function ResetPasswordForm({
  token: propToken,
  onSuccess,
  onCancel,
}: ResetPasswordFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = propToken || searchParams.get('token');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setError: setFormError,
  } = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onBlur',
  });

  const watchedPassword = watch('password', '');

  // بررسی معتبر بودن توکن
  if (!token) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6 text-center" 
        dir="rtl"
      >
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">لینک نامعتبر</h2>
        <p className="text-gray-600 mb-4">
          لینک بازیابی رمز عبور نامعتبر یا منقضی شده است.
        </p>
        <button
          onClick={() => router.push('/auth/forgot-password')}
          className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          درخواست لینک جدید
        </button>
      </motion.div>
    );
  }

  // بررسی rate limiting برای جلوگیری از سوءاستفاده
  const checkRateLimit = () => {
    const lastAttempt = localStorage.getItem('lastResetPasswordAttempt');
    const now = Date.now();
    
    if (lastAttempt) {
      const timeDiff = now - parseInt(lastAttempt);
      // محدودیت ۳ درخواست در دقیقه (20 ثانیه بین هر درخواست)
      if (timeDiff < 20000) {
        throw new Error('لطفاً ۲۰ ثانیه صبر کنید و دوباره تلاش کنید');
      }
    }
    
    localStorage.setItem('lastResetPasswordAttempt', now.toString());
  };

  const onSubmit = async (data: ResetPasswordData) => {
    try {
      setError(null);
      setIsLoading(true);
      
      // بررسی rate limiting
      checkRateLimit();

      // ارسال درخواست تغییر رمز
      const response = await authService.resetPassword({
        token: token!,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });

      if (response.success) {
        setSuccess('رمز عبور با موفقیت تغییر کرد! در حال هدایت به صفحه ورود...');
        
        // پاک کردن اطلاعات محلی
        localStorage.removeItem('lastResetPasswordAttempt');
        
        // هدایت یا فراخوانی callback
        setTimeout(() => {
          if (onSuccess) {
            onSuccess();
          } else {
            router.push('/auth/login?message=password-reset-success');
          }
        }, 2000);
      }

    } catch (error) {
      setIsLoading(false);
      
      if (error instanceof Error) {
        if (error.message.includes('expired')) {
          setError('لینک بازیابی منقضی شده است. لطفاً لینک جدید درخواست کنید.');
        } else if (error.message.includes('invalid')) {
          setError('لینک بازیابی نامعتبر است.');
        } else if (error.message.includes('weak')) {
          setFormError('password', { message: 'رمز عبور انتخابی ضعیف است' });
        } else {
          setError(error.message);
        }
      } else {
        setError('خطای غیرمنتظره‌ای رخ داد. لطفاً دوباره تلاش کنید.');
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6"
      dir="rtl"
    >
      {/* هدر */}
      <div className="text-center mb-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <Lock className="w-8 h-8 text-blue-600" />
        </motion.div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">تعیین رمز عبور جدید</h2>
        <p className="text-gray-600">رمز عبور قوی و امن انتخاب کنید</p>
      </div>

      {/* پیام‌های وضعیت */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-md p-4 mb-4"
        >
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400 ml-2" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        </motion.div>
      )}

      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 rounded-md p-4 mb-4"
        >
          <div className="flex">
            <CheckCircle className="h-5 w-5 text-green-400 ml-2" />
            <p className="text-sm text-green-800">{success}</p>
          </div>
        </motion.div>
      )}

      {/* فرم */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* فیلد رمز عبور جدید */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            رمز عبور جدید
          </label>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="relative"
          >
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              id="password"
              dir="ltr"
              placeholder="حداقل ۱۲ کاراکتر، شامل حروف، اعداد و علائم"
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
          
          {/* نشانگر قدرت رمز عبور */}
          <PasswordStrengthIndicator password={watchedPassword} />
        </div>

        {/* فیلد تأیید رمز عبور */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            تأیید رمز عبور
          </label>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <input
              {...register('confirmPassword')}
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              dir="ltr"
              placeholder="رمز عبور را دوباره وارد کنید"
              className={`appearance-none rounded-md relative block w-full px-3 py-2 pl-10 border text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition-colors ${
                errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            <button
              type="button"
              className="absolute inset-y-0 left-0 pl-3 flex items-center"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </motion.div>
          {errors.confirmPassword && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1 text-sm text-red-600"
            >
              {errors.confirmPassword.message}
            </motion.p>
          )}
        </div>

        {/* نکات امنیتی */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-blue-50 border border-blue-200 rounded-md p-4"
        >
          <div className="flex">
            <Shield className="h-5 w-5 text-blue-400 ml-2 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">نکات امنیتی:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>از رمز عبور قوی و یکتا استفاده کنید</li>
                <li>رمز عبور خود را با کسی به اشتراک نگذارید</li>
                <li>به طور منظم رمز عبور خود را تغییر دهید</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* دکمه‌ها */}
        <div className="flex gap-3 pt-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              انصراف
            </button>
          )}
          
          <motion.button
            type="submit"
            disabled={isSubmitting || isLoading}
            className="flex-1 py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isSubmitting || isLoading ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-3 h-4 w-4 inline" />
                در حال تغییر رمز...
              </>
            ) : (
              <>
                <Lock className="ml-2 h-4 w-4 inline" />
                تغییر رمز عبور
              </>
            )}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}