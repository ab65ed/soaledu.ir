"use client"

import React, { useState, useMemo, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
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
  ChevronDown,
  ArrowLeft
} from "lucide-react";

// تعریف نقش‌های کاربری
const USER_ROLES = {
  learner: {
    value: "learner",
    label: "فراگیر",
    subtitle: "دانش‌آموز / دانش‌جو",
    icon: GraduationCap,
    color: "text-blue-600"
  },
  designer: {
    value: "designer",
    label: "طراح سوال",
    subtitle: "سازنده / طراح آزمون",
    icon: PenTool,
    color: "text-purple-600"
  },
  admin: {
    value: "admin",
    label: "مدیر سیستم",
    subtitle: "مدیر کل / ناظر سیستم",
    icon: Shield,
    color: "text-red-600"
  },
  expert: {
    value: "expert",
    label: "کارشناس",
    subtitle: "بررسی‌کننده / تأیید‌کننده",
    icon: UserCog,
    color: "text-green-600"
  },
  support: {
    value: "support",
    label: "پشتیبانی",
    subtitle: "پشتیبانی فنی / راهنمایی",
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
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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
 */
export const LoginForm: React.FC = React.memo(() => {
  const [showPassword, setShowPassword] = useState(false);

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
      role: "learner",
      remember: false,
    },
  });

  const watchedRole = watch("role");

  const selectedRole = useMemo(() => 
    USER_ROLES[watchedRole], 
    [watchedRole]
  );

  const userRoleOptions = useMemo(() => 
    Object.values(USER_ROLES), 
    []
  );

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  const onSubmit = useCallback(async (data: LoginFormData) => {
    try {
      console.log("Login attempt:", data);
      console.log(`ورود موفقیت‌آمیز! خوش آمدید! شما به عنوان ${selectedRole.label} وارد شدید.`);
         } catch (error: unknown) {
       const errorMessage = error instanceof Error 
         ? error.message 
         : 'خطایی در ورود رخ داد. لطفاً دوباره تلاش کنید.';
       
      console.error("خطا در ورود:", errorMessage);
    }
  }, [selectedRole.label]);

  return (
    <Card className="backdrop-blur-sm border-white/40 shadow-xl">
      <CardContent className="p-6">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" data-testid="login-form">

        {/* انتخاب نقش کاربری */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="space-y-3"
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
              className="w-full h-12 pl-10 pr-10 text-right bg-white border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none transition-colors"
              style={{ fontFamily: 'var(--font-family-yekanbakh)' }}
              title="انتخاب نقش کاربری - برای راهنمایی بر روی آیکون کلیک کنید"
            >
              {userRoleOptions.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label} / {role.subtitle}
                </option>
              ))}
            </select>
            
            {/* Tooltip راهنما */}
            <div className="absolute left-12 top-1/2 -translate-y-1/2 group">
              <div className="w-4 h-4 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center cursor-help">
                ?
              </div>
              <div className="absolute bottom-6 left-0 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-2 px-3 whitespace-nowrap z-50">
                راهنمای نقش‌های کاربری
                <div className="absolute top-full left-2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
              </div>
            </div>
          </div>
          
          {errors.role && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="text-sm text-red-600 mt-1"
            >
              {errors.role.message}
            </motion.p>
          )}
        </motion.div>

        {/* فیلد ایمیل/موبایل */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="space-y-2"
        >
              <label className="text-sm font-medium text-gray-900 block">
            ایمیل یا شماره موبایل
          </label>
          <div className="relative">
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
              <Mail className="h-4 w-4" />
            </div>
            <Input
                  {...register("email")}
              type="text"
                  placeholder="example@domain.com یا 09123456789"
                  className="h-12 pr-10 text-right transition-all"
                  style={{ fontFamily: 'var(--font-family-yekanbakh)' }}
                  dir="ltr"
              data-testid="email-input"
            />
          </div>
          <AnimatePresence>
            {errors.email && (
              <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                className="text-sm text-red-600"
                data-testid="email-error"
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
              <label className="text-sm font-medium text-gray-900 block">
            رمز عبور
          </label>
          <div className="relative">
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
              <Lock className="h-4 w-4" />
            </div>
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 hover:bg-transparent"
                    onClick={togglePasswordVisibility}
                    data-testid="password-toggle"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
            <Input
                  {...register("password")}
              type={showPassword ? "text" : "password"}
                  placeholder="رمز عبور خود را وارد کنید"
                  className="h-12 px-10 text-right transition-all"
                  style={{ fontFamily: 'var(--font-family-yekanbakh)' }}
              data-testid="password-input"
                />
          </div>
          <AnimatePresence>
            {errors.password && (
              <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                className="text-sm text-red-600"
              >
                {errors.password.message}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

            {/* چک‌باکس یادآوری */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
              className="flex items-center gap-2"
        >
            <input
                {...register("remember")}
                type="checkbox"
              id="remember"
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
              <label htmlFor="remember" className="text-sm text-gray-700 cursor-pointer select-none">
              مرا به خاطر بسپار
            </label>
        </motion.div>

        {/* دکمه ورود */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <Button
            type="submit"
            disabled={isSubmitting}
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-md transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            data-testid="login-button"
          >
            {isSubmitting ? (
              <>
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" data-testid="loading-spinner" />
                در حال ورود...
              </>
            ) : (
              <>
                    ورود به عنوان {selectedRole.label}
                    <ArrowLeft className="mr-2 h-4 w-4" />
              </>
            )}
          </Button>
        </motion.div>

            {/* لینک‌های Navigation */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.6 }}
              className="flex items-center justify-between text-sm pt-2"
            >
          <a
                          href="/register"
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                data-testid="register-link"
          >
                ثبت نام کنید
          </a>
              <span className="text-gray-300">|</span>
              <a
                href="/forgot-password"
                className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
                data-testid="forgot-password-link"
              >
                فراموشی رمز عبور
              </a>
      </motion.div>
          </form>
    </motion.div>
      </CardContent>
    </Card>
  );
});

LoginForm.displayName = "LoginForm"; 