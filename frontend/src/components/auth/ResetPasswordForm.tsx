"use client"

import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Lock, 
  Eye, 
  EyeOff,
  KeyRound,
  Loader2, 
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Info,
  Timer,
  RefreshCw
} from "lucide-react";
import { useResetPassword, useVerifyResetCode, useResendResetCode } from "@/hooks/useAuth";

// اسکیمای اعتبارسنجی
const resetPasswordSchema = z.object({
  verificationCode: z.string()
    .regex(/^\d{6}$/, "کد تأیید باید ۶ رقم باشد"),
  
  newPassword: z.string()
    .min(8, "رمز عبور حداقل ۸ کاراکتر باشد")
    .max(128, "رمز عبور نباید بیشتر از ۱۲۸ کاراکتر باشد")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
      "رمز عبور باید شامل حروف کوچک، بزرگ، عدد و علامت باشد"),
  
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "تکرار رمز عبور مطابقت ندارد",
  path: ["confirmPassword"],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

/**
 * کامپوننت فرم ریست رمز عبور
 */
export const ResetPasswordForm: React.FC = () => {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

  // دریافت token از URL در client-side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      setToken(urlParams.get('token'));
    }
  }, []);

  const resetPasswordMutation = useResetPassword();
  const verifyCodeMutation = useVerifyResetCode();
  const resendCodeMutation = useResendResetCode();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    watch,
    trigger,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
    defaultValues: {
      verificationCode: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const watchedNewPassword = watch("newPassword");

  // محاسبه قدرت رمز عبور
  const passwordStrength = useMemo(() => {
    if (!watchedNewPassword) return { score: 0, label: "", color: "" };
    
    let score = 0;
    if (watchedNewPassword.length >= 8) score++;
    if (/[a-z]/.test(watchedNewPassword)) score++;
    if (/[A-Z]/.test(watchedNewPassword)) score++;
    if (/\d/.test(watchedNewPassword)) score++;
    if (/[@$!%*?&]/.test(watchedNewPassword)) score++;
    
    const levels = [
      { score: 0, label: "", color: "" },
      { score: 1, label: "ضعیف", color: "text-red-500" },
      { score: 2, label: "ضعیف", color: "text-red-500" },
      { score: 3, label: "متوسط", color: "text-yellow-500" },
      { score: 4, label: "قوی", color: "text-green-500" },
      { score: 5, label: "عالی", color: "text-green-600" },
    ];
    
    return levels[score];
  }, [watchedNewPassword]);

  // مدیریت cooldown ارسال مجدد
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendCooldown > 0) {
      interval = setInterval(() => {
        setResendCooldown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendCooldown]);

  // بررسی وجود token
  useEffect(() => {
    if (!token) {
      router.push('/forgot-password');
    }
  }, [token, router]);

  // تابع ارسال فرم
  const onSubmit = useCallback(async (data: ResetPasswordFormData) => {
    if (!token) return;
    
    try {
      setResetError(null);
      setResetSuccess(false);
      
      // ابتدا کد را تأیید می‌کنیم
      await verifyCodeMutation.mutateAsync({
        token,
        code: data.verificationCode,
      });
      
      // سپس رمز عبور را تغییر می‌دهیم
      await resetPasswordMutation.mutateAsync({
        token,
        code: data.verificationCode,
        newPassword: data.newPassword,
      });
      
      setResetSuccess(true);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : "خطایی در تغییر رمز عبور رخ داد";
      setResetError(errorMessage);
    }
  }, [token, resetPasswordMutation, verifyCodeMutation]);

  // تابع ارسال مجدد کد
  const handleResendCode = useCallback(async () => {
    if (!token || resendCooldown > 0) return;
    
    try {
      await resendCodeMutation.mutateAsync(token);
      setResendCooldown(60); // 60 ثانیه cooldown
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : "خطایی در ارسال مجدد کد رخ داد";
      setResetError(errorMessage);
    }
  }, [token, resendCodeMutation, resendCooldown]);

  if (!token) {
    return (
      <div className="max-w-md mx-auto">
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            لینک بازیابی معتبر نیست. لطفاً مجدداً درخواست بازیابی دهید.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (resetSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md mx-auto"
      >
        <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <CheckCircle className="w-8 h-8 text-green-600" />
          </motion.div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            رمز عبور با موفقیت تغییر کرد
          </h3>
          
          <p className="text-gray-600 mb-6">
            حالا می‌توانید با رمز عبور جدید خود وارد شوید
          </p>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Button 
              onClick={() => router.push('/login')}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              ورود به حساب کاربری
              <ArrowRight className="w-4 h-4 mr-2" />
            </Button>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-md mx-auto"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* نمایش خطا */}
        <AnimatePresence mode="wait">
          {resetError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  {resetError}
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* راهنمای امنیتی */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-blue-50 border border-blue-200 rounded-xl p-4"
        >
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-right">
              <p className="text-sm text-blue-800 font-medium mb-2">
                نکات امنیتی:
              </p>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• کد ۶ رقمی را از ایمیل/پیامک دریافت کرده‌اید</li>
                <li>• رمز عبور جدید باید قوی و منحصر به فرد باشد</li>
                <li>• از اشتراک رمز عبور با دیگران خودداری کنید</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* فیلد کد تأیید */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-2"
        >
          <label className="block text-sm font-medium text-gray-700">
            کد تأیید ۶ رقمی
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <KeyRound className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              {...register("verificationCode")}
              type="text"
              placeholder="۱۲۳۴۵۶"
              maxLength={6}
              className={`pr-10 text-center text-lg tracking-widest ${errors.verificationCode ? "border-red-500" : ""}`}
              onChange={(e) => {
                register("verificationCode").onChange(e);
                trigger("verificationCode");
              }}
            />
          </div>
          {errors.verificationCode && (
            <p className="text-sm text-red-600">{errors.verificationCode.message}</p>
          )}
          
          {/* دکمه ارسال مجدد */}
          <div className="flex justify-center">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={resendCooldown > 0 || resendCodeMutation.isPending}
              onClick={handleResendCode}
              className="text-blue-600 hover:text-blue-700"
            >
              {resendCodeMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  در حال ارسال...
                </>
              ) : resendCooldown > 0 ? (
                <>
                  <Timer className="w-4 h-4 mr-2" />
                  ارسال مجدد ({resendCooldown}s)
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  ارسال مجدد کد
                </>
              )}
            </Button>
          </div>
        </motion.div>

        {/* فیلد رمز عبور جدید */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-2"
        >
          <label className="block text-sm font-medium text-gray-700">
            رمز عبور جدید
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-auto p-0 hover:bg-transparent"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </Button>
            </div>
            <Input
              {...register("newPassword")}
              type={showNewPassword ? "text" : "password"}
              placeholder="رمز عبور جدید"
              className={`px-10 text-right ${errors.newPassword ? "border-red-500" : ""}`}
              onChange={(e) => {
                register("newPassword").onChange(e);
                trigger("newPassword");
              }}
            />
          </div>
          
          {/* نمایش قدرت رمز عبور */}
          {watchedNewPassword && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2"
            >
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    passwordStrength.score <= 2 ? "bg-red-500" :
                    passwordStrength.score === 3 ? "bg-yellow-500" :
                    "bg-green-500"
                  }`}
                  style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                />
              </div>
              <span className={`text-sm font-medium ${passwordStrength.color}`}>
                {passwordStrength.label}
              </span>
            </motion.div>
          )}
          
          {errors.newPassword && (
            <p className="text-sm text-red-600">{errors.newPassword.message}</p>
          )}
        </motion.div>

        {/* فیلد تکرار رمز عبور */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-2"
        >
          <label className="block text-sm font-medium text-gray-700">
            تکرار رمز عبور جدید
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-auto p-0 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </Button>
            </div>
            <Input
              {...register("confirmPassword")}
              type={showConfirmPassword ? "text" : "password"}
              placeholder="تکرار رمز عبور جدید"
              className={`px-10 text-right ${errors.confirmPassword ? "border-red-500" : ""}`}
              onChange={(e) => {
                register("confirmPassword").onChange(e);
                trigger("confirmPassword");
              }}
            />
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
          )}
        </motion.div>

        {/* دکمه تغییر رمز عبور */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            type="submit"
            disabled={isSubmitting || !isValid}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                در حال تغییر رمز عبور...
              </>
            ) : (
              <>
                تغییر رمز عبور
                <ArrowRight className="mr-2 h-4 w-4" />
              </>
            )}
          </Button>
        </motion.div>

        {/* لینک بازگشت */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.push('/login')}
            className="text-gray-600 hover:text-gray-800"
          >
            بازگشت به صفحه ورود
          </Button>
        </motion.div>
      </form>
    </motion.div>
  );
}; 