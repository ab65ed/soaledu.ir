"use client"

import React from "react";
import { motion } from "framer-motion";
import { ForgotPasswordHeader } from "@/components/auth/ForgotPasswordHeader";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

/**
 * صفحه فراموشی رمز عبور
 * مسیر: /auth/forgot-password
 * URL نمایشی: /forgot-password (با rewrite)
 */
export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* پس‌زمینه کارت */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8">
          {/* Header */}
          <ForgotPasswordHeader />
          
          {/* Form */}
          <ForgotPasswordForm />
        </div>

        {/* لینک‌های اضافی */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-6"
        >
          <p className="text-gray-600 text-sm">
            رمز عبور خود را به یاد آوردید؟{" "}
            <a
              href="/login"
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              ورود به حساب
            </a>
          </p>
          <p className="text-gray-600 text-sm mt-2">
            حساب کاربری ندارید؟{" "}
            <a
              href="/register"
              className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
            >
              ثبت نام کنید
            </a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
} 