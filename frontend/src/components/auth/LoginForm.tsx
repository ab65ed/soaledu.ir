"use client"

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
// import { useLogin } from "@/hooks/useAuth"; // Temporarily disabled for build
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  Loader2, 
  UserCog,
  GraduationCap,
  PenTool,
  Shield,
  Headphones,
  ChevronDown
} from "lucide-react";

// تعریف نقش‌های کاربری
const USER_ROLES = {
  learner: {
    value: "learner",
    label: "فراگیر",
    description: "دانش‌آموز / دانشجو",
    icon: GraduationCap,
    color: "text-blue-600"
  },
  designer: {
    value: "designer",
    label: "طراح سوال",
    description: "طراح و تولیدکننده سوال",
    icon: PenTool,
    color: "text-purple-600"
  },
  admin: {
    value: "admin",
    label: "مدیر سیستم",
    description: "مدیر کل پلتفرم",
    icon: Shield,
    color: "text-red-600"
  },
  expert: {
    value: "expert",
    label: "کارشناس",
    description: "کارشناس موضوعی",
    icon: UserCog,
    color: "text-green-600"
  },
  support: {
    value: "support",
    label: "پشتیبانی",
    description: "تیم پشتیبانی",
    icon: Headphones,
    color: "text-orange-600"
  }
} as const;

// اسکیمای اعتبارسنجی
const loginSchema = z.object({
  email: z.string()
    .min(1, "ایمیل یا شماره موبایل الزامی است")
    .refine(
      (value) => {
        // بررسی ایمیل معتبر
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // بررسی شماره موبایل ایرانی
        const mobileRegex = /^09\d{9}$/;
        return emailRegex.test(value) || mobileRegex.test(value);
      },
      "فرمت ایمیل یا شماره موبایل صحیح نیست"
    ),
  password: z.string()
    .min(8, "رمز عبور حداقل ۸ کاراکتر باشد")
    .max(128, "رمز عبور نباید بیشتر از ۱۲۸ کاراکتر باشد"),
  role: z.enum(["learner", "designer", "admin", "expert", "support"], {
    required_error: "انتخاب نقش کاربری الزامی است",
  }),
  remember: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

/**
 * کامپوننت فرم اصلی لاگین
 * شامل اعتبارسنجی، انیمیشن، و مدیریت خطا
 */
export const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "learner", // پیش‌فرض روی فراگیر
      remember: false,
    },
  });

  // const loginMutation = useLogin(); // Temporarily disabled for build
  const watchedEmail = watch("email");
  const watchedRole = watch("role");

  // تشخیص نوع ورودی (ایمیل یا موبایل)
  const isEmailInput = watchedEmail?.includes("@");

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoginError(null);
      // Simulate login for now
      console.log("Login attempt:", data);
      // TODO: Replace with actual API call
      // await loginMutation.mutateAsync({
      //   email: data.email,
      //   password: data.password,
      //   role: data.role,
      // });
         } catch (error: unknown) {
       const errorMessage = error instanceof Error 
         ? error.message 
         : typeof error === 'object' && error !== null && 'response' in error
         ? (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'خطای نامشخص'
         : 'خطایی در ورود رخ داد. لطفاً دوباره تلاش کنید.';
       
       setLoginError(errorMessage);
    }
  };

  const selectedRole = USER_ROLES[watchedRole];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" data-testid="login-form">
        {/* نمایش خطای لاگین */}
        <AnimatePresence>
          {loginError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Alert variant="destructive">
                <AlertDescription className="text-sm">
                  {loginError}
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* انتخاب نقش کاربری */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="space-y-2"
        >
          <label className="text-sm font-medium text-gray-900 block">
            نقش کاربری
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
              <ChevronDown className="h-4 w-4" />
            </div>
            {selectedRole && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <selectedRole.icon className={`h-4 w-4 ${selectedRole.color}`} />
              </div>
            )}
            <select
              {...register("role")}
              className="w-full h-12 pl-10 pr-10 text-right bg-white border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
              style={{ fontFamily: 'var(--font-family-yekanbakh)' }}
            >
              {Object.values(USER_ROLES).map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label} - {role.description}
                </option>
              ))}
            </select>
          </div>
          <AnimatePresence>
            {errors.role && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-sm text-red-600"
                role="alert"
              >
                {errors.role.message}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* فیلد ایمیل/موبایل */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="space-y-2"
        >
          <label htmlFor="email" className="text-sm font-medium text-gray-900 block">
            ایمیل یا شماره موبایل
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              <Mail className="h-4 w-4" />
            </div>
            <Input
              id="email"
              type="text"
              placeholder={isEmailInput ? "example@domain.com" : "09123456789"}
              className="pl-10 text-right h-12"
              data-testid="email-input"
              aria-label="ایمیل یا شماره موبایل"
              {...register("email")}
            />
          </div>
          <AnimatePresence>
            {errors.email && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-sm text-red-600"
                data-testid="email-error"
                role="alert"
              >
                {errors.email.message}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* فیلد رمز عبور */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="space-y-2"
        >
          <label htmlFor="password" className="text-sm font-medium text-gray-900 block">
            رمز عبور
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              <Lock className="h-4 w-4" />
            </div>
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="حداقل ۸ کاراکتر"
              className="pl-10 pr-10 text-right h-12"
              data-testid="password-input"
              aria-label="رمز عبور"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-900 transition-colors"
              aria-label={showPassword ? "مخفی کردن رمز عبور" : "نمایش رمز عبور"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <AnimatePresence>
            {errors.password && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-sm text-red-600"
                data-testid="password-error"
                role="alert"
              >
                {errors.password.message}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* چک‌باکس یادآوری و فراموشی رمز */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center space-x-2 space-x-reverse">
            <input
              id="remember"
              type="checkbox"
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              {...register("remember")}
            />
            <label htmlFor="remember" className="text-sm text-gray-600 cursor-pointer">
              مرا به خاطر بسپار
            </label>
          </div>
          <a
                          href="/forgot-password"
            className="text-sm text-blue-600 hover:text-blue-500 transition-colors"
          >
            فراموشی رمز عبور؟
          </a>
        </motion.div>

        {/* دکمه ورود */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <Button
            type="submit"
            className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white transition-all duration-300 shadow-lg hover:shadow-xl"
            disabled={isSubmitting}
            data-testid="login-button"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                در حال ورود...
              </>
            ) : (
              <>
                {selectedRole && <selectedRole.icon className="ml-2 h-4 w-4" />}
                ورود به عنوان {selectedRole?.label}
              </>
            )}
          </Button>
        </motion.div>

        {/* نشانگر وضعیت */}
        <AnimatePresence>
          {isSubmitting && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center gap-2 text-sm text-gray-600"
            >
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
              <span className="mr-2">درحال احراز هویت...</span>
            </motion.div>
          )}
        </AnimatePresence>
      </form>

      {/* لینک ثبت‌نام */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="text-center pt-4 border-t border-gray-200/50"
      >
        <p className="text-sm text-gray-600">
          حساب کاربری ندارید؟{" "}
          <a
                          href="/register"
            className="text-blue-600 hover:text-blue-500 font-medium transition-colors"
          >
            ثبت‌نام کنید
          </a>
        </p>
      </motion.div>
    </motion.div>
  );
}; 