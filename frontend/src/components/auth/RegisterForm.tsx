"use client"

import React, { useState, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useRegister } from "@/hooks/useAuth";
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User,
  Phone,
  CreditCard,
  Loader2, 
  UserCog,
  GraduationCap,
  PenTool,
  Shield,
  Headphones,
  ChevronDown,
  CheckCircle,
  AlertCircle,
  Info
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

// اسکیمای اعتبارسنجی پیشرفته
const registerSchema = z.object({
  name: z.string()
    .min(2, "نام باید حداقل ۲ کاراکتر باشد")
    .max(50, "نام نباید بیشتر از ۵۰ کاراکتر باشد")
    .regex(/^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\s\u200C\u200D]+$/, "نام باید به فارسی باشد"),
  
  email: z.string()
    .min(1, "ایمیل الزامی است")
    .email("فرمت ایمیل صحیح نیست")
    .max(100, "ایمیل نباید بیشتر از ۱۰۰ کاراکتر باشد"),
  
  mobile: z.string()
    .regex(/^09\d{9}$/, "شماره موبایل باید به صورت ۰۹xxxxxxxxx باشد"),
  
  nationalId: z.string()
    .regex(/^\d{10}$/, "کد ملی باید ۱۰ رقم باشد")
    .refine((value) => {
      // اعتبارسنجی کد ملی ایرانی
      const check = parseInt(value[9]);
      let sum = 0;
      for (let i = 0; i < 9; i++) {
        sum += parseInt(value[i]) * (10 - i);
      }
      const remainder = sum % 11;
      return (remainder < 2 && check === remainder) || (remainder >= 2 && check === 11 - remainder);
    }, "کد ملی معتبر نیست"),
  
  password: z.string()
    .min(8, "رمز عبور حداقل ۸ کاراکتر باشد")
    .max(128, "رمز عبور نباید بیشتر از ۱۲۸ کاراکتر باشد")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
      "رمز عبور باید شامل حروف کوچک، بزرگ، عدد و علامت باشد"),
  
  confirmPassword: z.string(),
  
  role: z.enum(["learner", "designer", "admin", "expert", "support"], {
    required_error: "انتخاب نقش کاربری الزامی است",
  }),
  
  termsAccepted: z.boolean().refine(val => val === true, {
    message: "پذیرش قوانین الزامی است"
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "تکرار رمز عبور مطابقت ندارد",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

/**
 * کامپوننت فرم ثبت نام با ویژگی‌های پیشرفته
 */
export const RegisterForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [registerSuccess, setRegisterSuccess] = useState(false);

  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    watch,
    trigger,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      mobile: "",
      nationalId: "",
      password: "",
      confirmPassword: "",
      role: "learner",
      termsAccepted: false,
    },
  });

  const watchedRole = watch("role");
  const watchedPassword = watch("password");

  // محاسبه قدرت رمز عبور
  const passwordStrength = useMemo(() => {
    if (!watchedPassword) return { score: 0, label: "", color: "" };
    
    let score = 0;
    if (watchedPassword.length >= 8) score++;
    if (/[a-z]/.test(watchedPassword)) score++;
    if (/[A-Z]/.test(watchedPassword)) score++;
    if (/\d/.test(watchedPassword)) score++;
    if (/[@$!%*?&]/.test(watchedPassword)) score++;
    
    const levels = [
      { score: 0, label: "", color: "" },
      { score: 1, label: "ضعیف", color: "text-red-500" },
      { score: 2, label: "ضعیف", color: "text-red-500" },
      { score: 3, label: "متوسط", color: "text-yellow-500" },
      { score: 4, label: "قوی", color: "text-green-500" },
      { score: 5, label: "عالی", color: "text-green-600" },
    ];
    
    return levels[score];
  }, [watchedPassword]);

  const selectedRole = USER_ROLES[watchedRole];

  // تابع ارسال فرم
  const onSubmit = useCallback(async (data: RegisterFormData) => {
    try {
      setRegisterError(null);
      setRegisterSuccess(false);
      
      await registerMutation.mutateAsync({
        name: data.name,
        email: data.email,
        mobile: data.mobile,
        nationalId: data.nationalId,
        password: data.password,
        role: data.role,
      });
      
      setRegisterSuccess(true);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : typeof error === 'object' && error !== null && 'response' in error
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'خطای نامشخص'
        : 'خطایی در ثبت نام رخ داد. لطفاً دوباره تلاش کنید.';
      
      setRegisterError(errorMessage);
    }
  }, [registerMutation]);

  // اگر ثبت نام موفق بود
  if (registerSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <CheckCircle className="w-8 h-8 text-green-600" />
        </motion.div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">ثبت نام موفق!</h3>
        <p className="text-gray-600 mb-4">حساب کاربری شما با موفقیت ایجاد شد.</p>
        <p className="text-sm text-gray-500">در حال هدایت به داشبورد...</p>
      </motion.div>
    );
  }

  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" data-testid="register-form">
          {/* نمایش خطای ثبت نام */}
          <AnimatePresence>
            {registerError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    {registerError}
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
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="inline w-4 h-4 mr-1 text-gray-400 cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">نقش کاربری تعیین‌کننده دسترسی‌های شما در سیستم است</p>
                </TooltipContent>
              </Tooltip>
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
                className="w-full h-12 pl-10 pr-10 text-right bg-white border border-gray-200 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 appearance-none transition-colors"
                style={{ fontFamily: 'var(--font-family-yekanbakh)' }}
              >
                {Object.values(USER_ROLES).map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label} - {role.description}
                  </option>
                ))}
              </select>
            </div>
            {errors.role && (
              <p className="text-red-500 text-xs mt-1">{errors.role.message}</p>
            )}
          </motion.div>

          {/* نام کامل */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="space-y-2"
          >
            <label className="text-sm font-medium text-gray-900 block">
              نام و نام خانوادگی
            </label>
            <div className="relative">
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                <User className="h-4 w-4" />
              </div>
              <Input
                {...register("name")}
                type="text"
                placeholder="نام و نام خانوادگی خود را وارد کنید"
                className="pr-10 h-12 text-right transition-colors"
                style={{ fontFamily: 'var(--font-family-yekanbakh)' }}
                onBlur={() => trigger("name")}
              />
            </div>
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </motion.div>

          {/* ایمیل */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="space-y-2"
          >
            <label className="text-sm font-medium text-gray-900 block">
              آدرس ایمیل
            </label>
            <div className="relative">
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                <Mail className="h-4 w-4" />
              </div>
              <Input
                {...register("email")}
                type="email"
                placeholder="example@domain.com"
                className="pr-10 h-12 text-right transition-colors"
                style={{ fontFamily: 'var(--font-family-yekanbakh)' }}
                onBlur={() => trigger("email")}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </motion.div>

          {/* شماره موبایل */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="space-y-2"
          >
            <label className="text-sm font-medium text-gray-900 block">
              شماره موبایل
            </label>
            <div className="relative">
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                <Phone className="h-4 w-4" />
              </div>
              <Input
                {...register("mobile")}
                type="tel"
                placeholder="09xxxxxxxxx"
                className="pr-10 h-12 text-right transition-colors"
                style={{ fontFamily: 'var(--font-family-yekanbakh)' }}
                onBlur={() => trigger("mobile")}
              />
            </div>
            {errors.mobile && (
              <p className="text-red-500 text-xs mt-1">{errors.mobile.message}</p>
            )}
          </motion.div>

          {/* کد ملی */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="space-y-2"
          >
            <label className="text-sm font-medium text-gray-900 block">
              کد ملی
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="inline w-4 h-4 mr-1 text-gray-400 cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">کد ملی برای احراز هویت و بازیابی رمز عبور استفاده می‌شود</p>
                </TooltipContent>
              </Tooltip>
            </label>
            <div className="relative">
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                <CreditCard className="h-4 w-4" />
              </div>
              <Input
                {...register("nationalId")}
                type="text"
                placeholder="کد ملی ۱۰ رقمی"
                className="pr-10 h-12 text-right transition-colors"
                style={{ fontFamily: 'var(--font-family-yekanbakh)' }}
                onBlur={() => trigger("nationalId")}
              />
            </div>
            {errors.nationalId && (
              <p className="text-red-500 text-xs mt-1">{errors.nationalId.message}</p>
            )}
          </motion.div>

          {/* رمز عبور */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="space-y-2"
          >
            <label className="text-sm font-medium text-gray-900 block">
              رمز عبور
            </label>
            <div className="relative">
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                <Lock className="h-4 w-4" />
              </div>
              <Input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="رمز عبور قوی انتخاب کنید"
                className="pr-10 pl-10 h-12 text-right transition-colors"
                style={{ fontFamily: 'var(--font-family-yekanbakh)' }}
                onBlur={() => trigger("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            
            {/* نمایش قدرت رمز عبور */}
            {watchedPassword && (
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className={`text-xs ${passwordStrength.color}`}>
                    {passwordStrength.label}
                  </span>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`w-4 h-1 rounded-full ${
                          level <= passwordStrength.score 
                            ? passwordStrength.score <= 2 ? 'bg-red-500' 
                              : passwordStrength.score <= 3 ? 'bg-yellow-500'
                              : 'bg-green-500'
                            : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
            )}
          </motion.div>

          {/* تکرار رمز عبور */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.7 }}
            className="space-y-2"
          >
            <label className="text-sm font-medium text-gray-900 block">
              تکرار رمز عبور
            </label>
            <div className="relative">
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                <Lock className="h-4 w-4" />
              </div>
              <Input
                {...register("confirmPassword")}
                type={showConfirmPassword ? "text" : "password"}
                placeholder="رمز عبور را مجدداً وارد کنید"
                className="pr-10 pl-10 h-12 text-right transition-colors"
                style={{ fontFamily: 'var(--font-family-yekanbakh)' }}
                onBlur={() => trigger("confirmPassword")}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
            )}
          </motion.div>

          {/* چک باکس قوانین */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.8 }}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2 space-x-reverse">
              <input
                {...register("termsAccepted")}
                type="checkbox"
                id="terms"
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <label htmlFor="terms" className="text-sm text-gray-700 cursor-pointer">
                <span>قوانین و مقررات</span>
                <a href="/terms" className="text-purple-600 hover:text-purple-700 mx-1">
                  سایت
                </a>
                <span>و</span>
                <a href="/privacy" className="text-purple-600 hover:text-purple-700 mx-1">
                  حریم خصوصی
                </a>
                <span>را می‌پذیرم</span>
              </label>
            </div>
            {errors.termsAccepted && (
              <p className="text-red-500 text-xs mt-1">{errors.termsAccepted.message}</p>
            )}
          </motion.div>

          {/* دکمه ثبت نام */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.9 }}
          >
            <Button
              type="submit"
              disabled={isSubmitting || !isValid}
              className="w-full h-12 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: 'var(--font-family-yekanbakh)' }}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center space-x-2 space-x-reverse">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>در حال ثبت نام...</span>
                </div>
              ) : (
                "ثبت نام"
              )}
            </Button>
          </motion.div>

          {/* لینک ورود */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 1.0 }}
            className="text-center"
          >
            <p className="text-sm text-gray-600">
              قبلاً ثبت نام کرده‌اید؟{" "}
              <a
                href="/login"
                className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
              >
                وارد شوید
              </a>
            </p>
          </motion.div>
        </form>
      </motion.div>
    </TooltipProvider>
  );
}; 