"use client"

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
// import { useLogin } from "@/hooks/useAuth"; // Temporarily disabled for build
import { Eye, EyeOff, Mail, Lock, Loader2 } from "lucide-react";

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
      remember: false,
    },
  });

  // const loginMutation = useLogin(); // Temporarily disabled for build
  const watchedEmail = watch("email");

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

        {/* فیلد ایمیل/موبایل */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-foreground">
            ایمیل یا شماره موبایل
          </Label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <Mail className="h-4 w-4" />
            </div>
            <Input
              id="email"
              type="text"
              placeholder={isEmailInput ? "example@domain.com" : "09123456789"}
              className="pl-10 text-right"
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
                className="text-sm text-destructive"
                data-testid="email-error"
                role="alert"
              >
                {errors.email.message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* فیلد رمز عبور */}
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium text-foreground">
            رمز عبور
          </Label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <Lock className="h-4 w-4" />
            </div>
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="حداقل ۸ کاراکتر"
              className="pl-10 pr-10 text-right"
              data-testid="password-input"
              aria-label="رمز عبور"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
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
                className="text-sm text-destructive"
                data-testid="password-error"
                role="alert"
              >
                {errors.password.message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* چک‌باکس یادآوری و فراموشی رمز */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 space-x-reverse">
            <input
              id="remember"
              type="checkbox"
              className="rounded border-gray-300 text-primary focus:ring-primary"
              {...register("remember")}
            />
            <Label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
              مرا به خاطر بسپار
            </Label>
          </div>
          <a
            href="/auth/forgot-password"
            className="text-sm text-primary hover:text-primary/80 transition-colors"
          >
            فراموشی رمز عبور؟
          </a>
        </div>

        {/* دکمه ورود */}
        <Button
          type="submit"
          className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-300 shadow-lg hover:shadow-xl"
                     disabled={isSubmitting}
          data-testid="login-button"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              در حال ورود...
            </>
          ) : (
            "ورود"
          )}
        </Button>

        {/* نشانگر وضعیت */}
                 <AnimatePresence>
           {isSubmitting && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center gap-2 text-sm text-muted-foreground"
            >
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
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
        className="text-center pt-4 border-t border-border/50"
      >
        <p className="text-sm text-muted-foreground">
          حساب کاربری ندارید؟{" "}
          <a
            href="/auth/register"
            className="text-primary hover:text-primary/80 font-medium transition-colors"
          >
            ثبت‌نام کنید
          </a>
        </p>
      </motion.div>
    </motion.div>
  );
}; 