"use client"

import React from "react";
import { motion } from "framer-motion";
import { ResetPasswordHeader } from "@/components/auth/ResetPasswordHeader";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

/**
 * صفحه ریست رمز عبور
 * مسیر: /auth/reset-password
 * URL نمایشی: /reset-password (با rewrite)
 */
export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* پس‌زمینه کارت */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8">
          {/* Header */}
          <ResetPasswordHeader />
          
          {/* Form */}
          <ResetPasswordForm />
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
        </motion.div>
      </motion.div>
    </div>
  );
} 