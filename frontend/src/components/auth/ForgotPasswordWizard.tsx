/**
 * کامپوننت ویزارد فراموشی رمز عبور - Forgot Password Wizard Component
 * ویزارد ۳ مرحله‌ای: ایمیل → کد ملی → کد تأیید
 * شامل اعتبارسنجی با Zod، انیمیشن‌های Framer Motion، و تایمر ۱۰ دقیقه‌ای
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  ArrowLeft, 
  Mail, 
  Phone, 
  Shield, 
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { authService } from '@/services/api';

// اسکماهای اعتبارسنجی برای هر مرحله
const step1Schema = z.object({
  email: z
    .string()
    .min(1, 'ایمیل یا شماره موبایل الزامی است')
    .refine(
      (value) => {
        // بررسی ایمیل
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // بررسی شماره موبایل ایرانی (09xxxxxxxxx)
        const mobileRegex = /^09\d{9}$/;
        return emailRegex.test(value) || mobileRegex.test(value);
      },
      'فرمت ایمیل یا شماره موبایل صحیح نیست'
    ),
});

const step2Schema = z.object({
  nationalId: z
    .string()
    .min(10, 'کد ملی باید ۱۰ رقم باشد')
    .max(10, 'کد ملی باید ۱۰ رقم باشد')
    .regex(/^\d{10}$/, 'کد ملی باید فقط شامل عدد باشد')
    .refine((value) => {
      // اعتبارسنجی کد ملی ایرانی
      if (!/^\d{10}$/.test(value)) return false;
      
      const check = parseInt(value[9]);
      const sum = Array.from(value.slice(0, 9))
        .reduce((acc, digit, index) => acc + parseInt(digit) * (10 - index), 0);
      
      const remainder = sum % 11;
      
      if (remainder < 2) {
        return check === remainder;
      } else {
        return check === 11 - remainder;
      }
    }, 'کد ملی وارد شده معتبر نیست'),
});

const step3Schema = z.object({
  code: z
    .string()
    .min(6, 'کد تأیید باید ۶ رقم باشد')
    .max(6, 'کد تأیید باید ۶ رقم باشد')
    .regex(/^\d{6}$/, 'کد تأیید باید فقط شامل عدد باشد'),
});

type Step1Data = z.infer<typeof step1Schema>;
type Step2Data = z.infer<typeof step2Schema>;
type Step3Data = z.infer<typeof step3Schema>;

interface ForgotPasswordWizardProps {
  onSuccess?: (token: string) => void;
  onCancel?: () => void;
}

export default function ForgotPasswordWizard({
  onSuccess,
  onCancel,
}: ForgotPasswordWizardProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // داده‌های جمع‌آوری شده از مراحل قبل
  const [wizardData, setWizardData] = useState<{
    email?: string;
    nationalId?: string;
    resetToken?: string;
    expiresAt?: string;
  }>({});

  // تایمر ۱۰ دقیقه‌ای برای توکن
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [canResendCode, setCanResendCode] = useState(false);

  // مراحل ویزارد
  const steps = [
    { number: 1, title: 'ایمیل یا موبایل', icon: Mail },
    { number: 2, title: 'کد ملی', icon: Shield },
    { number: 3, title: 'کد تأیید', icon: Phone },
  ];

  // فرم مرحله ۱ - ایمیل/موبایل
  const step1Form = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    mode: 'onBlur',
  });

  // فرم مرحله ۲ - کد ملی
  const step2Form = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    mode: 'onBlur',
  });

  // فرم مرحله ۳ - کد تأیید
  const step3Form = useForm<Step3Data>({
    resolver: zodResolver(step3Schema),
    mode: 'onBlur',
  });

  // مدیریت تایمر
  useEffect(() => {
    if (timeRemaining && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0) {
      setCanResendCode(true);
    }
  }, [timeRemaining]);

  // شروع تایمر پس از ارسال کد
  const startTimer = (expiresAt: string) => {
    const expireTime = new Date(expiresAt).getTime();
    const now = new Date().getTime();
    const remainingSeconds = Math.floor((expireTime - now) / 1000);
    setTimeRemaining(Math.max(0, remainingSeconds));
    setCanResendCode(false);
  };

  // فرمت کردن زمان باقی‌مانده
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // بررسی rate limiting برای جلوگیری از سوءاستفاده
  const checkRateLimit = (action: string) => {
    const lastAttempt = localStorage.getItem(`last_${action}_attempt`);
    const now = Date.now();
    
    if (lastAttempt) {
      const timeDiff = now - parseInt(lastAttempt);
      // محدودیت ۳۰ ثانیه بین هر درخواست
      if (timeDiff < 30000) {
        throw new Error(`لطفاً ۳۰ ثانیه صبر کنید و دوباره تلاش کنید`);
      }
    }
    
    localStorage.setItem(`last_${action}_attempt`, now.toString());
  };

  // مرحله ۱: ارسال ایمیل/موبایل
  const handleStep1Submit = async (data: Step1Data) => {
    try {
      setError(null);
      setIsLoading(true);
      
      checkRateLimit('forgot_password');
      
      setWizardData(prev => ({ ...prev, email: data.email }));
      setCurrentStep(2);
      setSuccess('اطلاعات دریافت شد. لطفاً کد ملی خود را وارد کنید.');
      
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('خطای غیرمنتظره‌ای رخ داد');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // مرحله ۲: ارسال کد ملی و درخواست کد تأیید
  const handleStep2Submit = async (data: Step2Data) => {
    try {
      setError(null);
      setIsLoading(true);
      
      checkRateLimit('verify_identity');

      // ارسال درخواست به سرور
      const response = await authService.forgotPassword({
        email: wizardData.email!,
        nationalId: data.nationalId,
      });

      setWizardData(prev => ({
        ...prev,
        nationalId: data.nationalId,
        resetToken: response.token,
        expiresAt: response.expiresAt,
      }));

      // شروع تایمر
      startTimer(response.expiresAt);
      
      setCurrentStep(3);
      setSuccess('کد تأیید به ایمیل/موبایل شما ارسال شد.');
      
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('not found')) {
          setError('کاربری با این مشخصات یافت نشد');
        } else if (error.message.includes('blocked')) {
          setError('حساب کاربری شما موقتاً مسدود شده است');
        } else {
          setError(error.message);
        }
      } else {
        setError('خطای غیرمنتظره‌ای رخ داد');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // مرحله ۳: تأیید کد
  const handleStep3Submit = async (data: Step3Data) => {
    try {
      setError(null);
      setIsLoading(true);
      
      const response = await authService.verifyResetCode({
        token: wizardData.resetToken!,
        code: data.code,
      });

      if (response.success) {
        setSuccess('کد تأیید شد! در حال هدایت...');
        
        // هدایت به صفحه ریست رمز با توکن
        setTimeout(() => {
          if (onSuccess) {
            onSuccess(wizardData.resetToken!);
          } else {
            router.push(`/auth/reset-password?token=${wizardData.resetToken}`);
          }
        }, 1500);
      }
      
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('invalid') || error.message.includes('expired')) {
          setError('کد تأیید نامعتبر یا منقضی شده است');
        } else {
          setError(error.message);
        }
      } else {
        setError('خطای غیرمنتظره‌ای رخ داد');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ارسال مجدد کد تأیید
  const handleResendCode = async () => {
    try {
      setError(null);
      setIsLoading(true);
      
      checkRateLimit('resend_code');
      
      const response = await authService.resendResetCode(wizardData.resetToken!);
      
      if (response.success) {
        setSuccess('کد تأیید جدید ارسال شد');
        // بازنشانی تایمر
        startTimer(new Date(Date.now() + 10 * 60 * 1000).toISOString());
      }
      
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('خطای ارسال مجدد کد');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // بازگشت به مرحله قبل
  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError(null);
      setSuccess(null);
    }
  };

  // انیمیشن‌های مراحل
  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6" dir="rtl">
      {/* هدر ویزارد */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">فراموشی رمز عبور</h2>
        <p className="text-gray-600">مراحل بازیابی رمز عبور خود را دنبال کنید</p>
      </div>

      {/* نشانگر مراحل */}
      <div className="flex justify-between items-center mb-8">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = currentStep === step.number;
          const isCompleted = currentStep > step.number;
          
          return (
            <div key={step.number} className="flex items-center">
              <motion.div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  isCompleted
                    ? 'bg-green-500 border-green-500 text-white'
                    : isActive
                    ? 'bg-blue-500 border-blue-500 text-white'
                    : 'bg-gray-100 border-gray-300 text-gray-400'
                }`}
                animate={{
                  scale: isActive ? 1.1 : 1,
                  backgroundColor: isCompleted ? '#10b981' : isActive ? '#3b82f6' : '#f3f4f6',
                }}
                transition={{ duration: 0.2 }}
              >
                {isCompleted ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </motion.div>
              
              <div className="mr-2 text-xs">
                <div className={`font-medium ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                  {step.title}
                </div>
              </div>
              
              {index < steps.length - 1 && (
                <div className={`w-8 h-0.5 mx-2 ${
                  currentStep > step.number ? 'bg-green-500' : 'bg-gray-300'
                }`} />
              )}
            </div>
          );
        })}
      </div>

      {/* پیام‌های وضعیت */}
      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
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
            exit={{ opacity: 0, y: -10 }}
            className="bg-green-50 border border-green-200 rounded-md p-4 mb-4"
          >
            <div className="flex">
              <CheckCircle className="h-5 w-5 text-green-400 ml-2" />
              <p className="text-sm text-green-800">{success}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* محتوای مراحل */}
      <AnimatePresence mode="wait">
        {/* مرحله ۱: ایمیل/موبایل */}
        {currentStep === 1 && (
          <motion.div
            key="step1"
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <form onSubmit={step1Form.handleSubmit(handleStep1Submit)} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  ایمیل یا شماره موبایل
                </label>
                <input
                  {...step1Form.register('email')}
                  type="text"
                  id="email"
                  dir="ltr"
                  placeholder="example@domain.com یا 09123456789"
                  className={`appearance-none rounded-md relative block w-full px-3 py-2 border text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors ${
                    step1Form.formState.errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {step1Form.formState.errors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {step1Form.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onCancel}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4 inline" />
                      در حال بررسی...
                    </>
                  ) : (
                    <>
                      ادامه
                      <ArrowLeft className="mr-2 h-4 w-4 inline" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* مرحله ۲: کد ملی */}
        {currentStep === 2 && (
          <motion.div
            key="step2"
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <form onSubmit={step2Form.handleSubmit(handleStep2Submit)} className="space-y-4">
              <div>
                <label htmlFor="nationalId" className="block text-sm font-medium text-gray-700 mb-1">
                  کد ملی
                </label>
                <input
                  {...step2Form.register('nationalId')}
                  type="text"
                  id="nationalId"
                  dir="ltr"
                  placeholder="1234567890"
                  maxLength={10}
                  className={`appearance-none rounded-md relative block w-full px-3 py-2 border text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors ${
                    step2Form.formState.errors.nationalId ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {step2Form.formState.errors.nationalId && (
                  <p className="mt-1 text-sm text-red-600">
                    {step2Form.formState.errors.nationalId.message}
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <ArrowRight className="ml-2 h-4 w-4 inline" />
                  قبلی
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4 inline" />
                      ارسال کد...
                    </>
                  ) : (
                    <>
                      ارسال کد
                      <ArrowLeft className="mr-2 h-4 w-4 inline" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* مرحله ۳: کد تأیید */}
        {currentStep === 3 && (
          <motion.div
            key="step3"
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <form onSubmit={step3Form.handleSubmit(handleStep3Submit)} className="space-y-4">
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                  کد تأیید
                </label>
                <input
                  {...step3Form.register('code')}
                  type="text"
                  id="code"
                  dir="ltr"
                  placeholder="123456"
                  maxLength={6}
                  className={`appearance-none rounded-md relative block w-full px-3 py-2 border text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors text-center text-lg tracking-widest ${
                    step3Form.formState.errors.code ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {step3Form.formState.errors.code && (
                  <p className="mt-1 text-sm text-red-600">
                    {step3Form.formState.errors.code.message}
                  </p>
                )}
              </div>

              {/* تایمر و ارسال مجدد */}
              {timeRemaining !== null && (
                <div className="text-center">
                  {timeRemaining > 0 ? (
                    <div className="flex items-center justify-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 ml-1" />
                      زمان باقی‌مانده: {formatTime(timeRemaining)}
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendCode}
                      disabled={isLoading || !canResendCode}
                      className="text-sm text-blue-600 hover:text-blue-500 disabled:opacity-50 transition-colors"
                    >
                      <RefreshCw className="w-4 h-4 ml-1 inline" />
                      ارسال مجدد کد
                    </button>
                  )}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <ArrowRight className="ml-2 h-4 w-4 inline" />
                  قبلی
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4 inline" />
                      تأیید...
                    </>
                  ) : (
                    <>
                      تأیید کد
                      <CheckCircle className="mr-2 h-4 w-4 inline" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}