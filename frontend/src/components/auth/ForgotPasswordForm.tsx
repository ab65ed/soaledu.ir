"use client"

import React, { useState, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Mail, 
  Phone, 
  CreditCard,
  Loader2, 
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Info
} from "lucide-react";
import { useForgotPassword } from "@/hooks/useAuth";

// اسکیمای اعتبارسنجی
const forgotPasswordSchema = z.object({
  identifier: z.string()
    .min(1, "ایمیل یا شماره موبایل الزامی است")
    .refine((value) => {
      // بررسی ایمیل یا شماره موبایل
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const mobileRegex = /^09\d{9}$/;
      return emailRegex.test(value) || mobileRegex.test(value);
    }, "فرمت ایمیل یا شماره موبایل صحیح نیست"),
  
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
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

/**
 * کامپوننت فرم فراموشی رمز عبور
 */
export const ForgotPasswordForm: React.FC = () => {
  const [requestError, setRequestError] = useState<string | null>(null);
  const [requestSuccess, setRequestSuccess] = useState(false);
  const [identifierType, setIdentifierType] = useState<'email' | 'mobile' | null>(null);

  const forgotPasswordMutation = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    watch,
    trigger,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onChange",
    defaultValues: {
      identifier: "",
      nationalId: "",
    },
  });

  const watchedIdentifier = watch("identifier");

  // تشخیص نوع شناسه (ایمیل یا موبایل)
  const detectedType = useMemo(() => {
    if (!watchedIdentifier) return null;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^09\d{9}$/;
    
    if (emailRegex.test(watchedIdentifier)) return 'email';
    if (mobileRegex.test(watchedIdentifier)) return 'mobile';
    return null;
  }, [watchedIdentifier]);

  // تابع ارسال فرم
  const onSubmit = useCallback(async (data: ForgotPasswordFormData) => {
    try {
      setRequestError(null);
      setRequestSuccess(false);
      
      await forgotPasswordMutation.mutateAsync({
        identifier: data.identifier,
        nationalId: data.nationalId,
      });
      
      setRequestSuccess(true);
      setIdentifierType(detectedType);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : "خطایی در ارسال درخواست رخ داد";
      setRequestError(errorMessage);
    }
  }, [forgotPasswordMutation, detectedType]);

  // انیمیشن‌های فرم
  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  if (requestSuccess) {
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
            درخواست با موفقیت ارسال شد
          </h3>
          
          <p className="text-gray-600 mb-6">
            {identifierType === 'email' 
              ? "لینک بازیابی رمز عبور به ایمیل شما ارسال شد"
              : "کد بازیابی به شماره موبایل شما پیامک شد"
            }
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-right">
                <p className="text-sm text-blue-800 font-medium mb-2">
                  مراحل بعدی:
                </p>
                <ul className="text-sm text-blue-700 space-y-1">
                  {identifierType === 'email' ? (
                    <>
                      <li>• ایمیل خود را بررسی کنید</li>
                      <li>• روی لینک بازیابی کلیک کنید</li>
                      <li>• رمز عبور جدید تعیین کنید</li>
                    </>
                  ) : (
                    <>
                      <li>• پیامک دریافتی را بررسی کنید</li>
                      <li>• کد ۶ رقمی را وارد کنید</li>
                      <li>• رمز عبور جدید تعیین کنید</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Button 
              onClick={() => window.location.href = '/login'}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              بازگشت به صفحه ورود
              <ArrowRight className="w-4 h-4 mr-2" />
            </Button>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={formVariants}
      initial="hidden"
      animate="visible"
      className="max-w-md mx-auto"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* نمایش خطا */}
        <AnimatePresence mode="wait">
          {requestError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  {requestError}
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* راهنمای مراحل */}
        <motion.div variants={itemVariants} className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-right">
              <p className="text-sm text-blue-800 font-medium mb-2">
                مراحل بازیابی رمز عبور:
              </p>
              <ol className="text-sm text-blue-700 space-y-1">
                <li>۱. ایمیل یا شماره موبایل خود را وارد کنید</li>
                <li>۲. کد ملی خود را برای تأیید هویت وارد کنید</li>
                <li>۳. کد بازیابی را از ایمیل/پیامک دریافت کنید</li>
                <li>۴. رمز عبور جدید تعیین کنید</li>
              </ol>
            </div>
          </div>
        </motion.div>

        {/* فیلد ایمیل یا موبایل */}
        <motion.div variants={itemVariants} className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            ایمیل یا شماره موبایل
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              {detectedType === 'email' ? (
                <Mail className="h-5 w-5 text-gray-400" />
              ) : detectedType === 'mobile' ? (
                <Phone className="h-5 w-5 text-gray-400" />
              ) : (
                <Mail className="h-5 w-5 text-gray-400" />
              )}
            </div>
            <Input
              {...register("identifier")}
              type="text"
              placeholder="example@email.com یا ۰۹۱۲۳۴۵۶۷۸۹"
              className={`pr-10 text-right ${errors.identifier ? "border-red-500" : ""}`}
              onChange={(e) => {
                register("identifier").onChange(e);
                trigger("identifier");
              }}
            />
          </div>
          {detectedType && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-green-600"
            >
              {detectedType === 'email' ? '✓ ایمیل شناسایی شد' : '✓ شماره موبایل شناسایی شد'}
            </motion.p>
          )}
          {errors.identifier && (
            <p className="text-sm text-red-600">{errors.identifier.message}</p>
          )}
        </motion.div>

        {/* فیلد کد ملی */}
        <motion.div variants={itemVariants} className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            کد ملی (برای تأیید هویت)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <CreditCard className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              {...register("nationalId")}
              type="text"
              placeholder="۱۲۳۴۵۶۷۸۹۰"
              maxLength={10}
              className={`pr-10 text-right ${errors.nationalId ? "border-red-500" : ""}`}
              onChange={(e) => {
                register("nationalId").onChange(e);
                trigger("nationalId");
              }}
            />
          </div>
          {errors.nationalId && (
            <p className="text-sm text-red-600">{errors.nationalId.message}</p>
          )}
        </motion.div>

        {/* دکمه ارسال */}
        <motion.div variants={itemVariants}>
          <Button
            type="submit"
            disabled={isSubmitting || !isValid}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                در حال ارسال...
              </>
            ) : (
              <>
                ارسال درخواست بازیابی
                <ArrowRight className="mr-2 h-4 w-4" />
              </>
            )}
          </Button>
        </motion.div>

        {/* لینک بازگشت */}
        <motion.div variants={itemVariants} className="text-center">
          <Button
            type="button"
            variant="ghost"
            onClick={() => window.location.href = '/login'}
            className="text-gray-600 hover:text-gray-800"
          >
            بازگشت به صفحه ورود
          </Button>
        </motion.div>
      </form>
    </motion.div>
  );
}; 