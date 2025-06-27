"use client"

import React from "react";
import { motion } from "framer-motion";

/**
 * کامپوننت فوتر صفحه لاگین
 * شامل لینک‌های مفید و اطلاعات تماس
 * بهینه‌سازی شده برای performance
 */
export const LoginFooter: React.FC = React.memo(() => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="text-center space-y-4"
    >


      {/* لینک‌های مفید */}
      <div className="flex items-center justify-center gap-6 text-sm">
        <a
          href="/about"
          className="text-gray-600 hover:text-gray-900 transition-colors"
        >
          درباره ما
        </a>
        <span className="text-gray-300">|</span>
        <a
          href="/contact"
          className="text-gray-600 hover:text-gray-900 transition-colors"
        >
          تماس با ما
        </a>
        <span className="text-gray-300">|</span>
        <a
          href="/help"
          className="text-gray-600 hover:text-gray-900 transition-colors"
        >
          راهنما
        </a>
      </div>

      {/* اطلاعات کپی‌رایت */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>© ۱۴۰۳ پلتفرم آزمون‌ساز سوال‌ادو. تمامی حقوق محفوظ است.</p>
        <p className="flex items-center justify-center gap-1">
          ساخته شده با
          <span className="text-red-500 animate-pulse">♥</span>
          برای جامعه آموزشی ایران
        </p>
      </div>

      {/* نشانگرهای امنیت و اعتماد */}
      <div className="flex items-center justify-center gap-4 pt-2">
        <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-md text-xs">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-7-4z" clipRule="evenodd" />
          </svg>
          <span className="font-medium">اتصال امن</span>
        </div>
        
        <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-md text-xs">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 12a1 1 0 102 0V7a1 1 0 10-2 0v5zM6 10a4 4 0 118 0 4 4 0 01-8 0zm4-8a8 8 0 100 16 8 8 0 000-16z" />
          </svg>
          <span className="font-medium">حریم خصوصی محفوظ</span>
        </div>
      </div>

      {/* پشتیبانی */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3 border border-gray-200"
      >
        <p className="font-medium mb-1">نیاز به کمک دارید؟</p>
        <p>
          با تیم پشتیبانی ما در تماس باشید:{" "}
          <a href="mailto:support@soaledu.ir" className="text-blue-600 hover:underline">
            support@soaledu.ir
          </a>
        </p>
      </motion.div>
    </motion.div>
  );
});

LoginFooter.displayName = "LoginFooter"; 