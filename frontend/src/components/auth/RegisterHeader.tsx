"use client"

import React from "react";
import { motion } from "framer-motion";
import { UserPlus, Sparkles } from "lucide-react";

/**
 * کامپوننت Header صفحه ثبت نام
 * شامل عنوان، توضیحات و انیمیشن‌های جذاب
 */
export const RegisterHeader: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center mb-8"
    >
      {/* آیکون اصلی */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative inline-flex items-center justify-center w-16 h-16 mb-6"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full opacity-20 animate-pulse" />
        <div className="relative bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full p-3">
          <UserPlus className="w-8 h-8 text-white" />
        </div>
        
        {/* افکت درخشش */}
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-1 -right-1"
        >
          <Sparkles className="w-4 h-4 text-yellow-400" />
        </motion.div>
      </motion.div>

      {/* عنوان اصلی */}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="text-3xl font-bold text-gray-900 mb-3"
        style={{ fontFamily: 'var(--font-family-yekanbakh)' }}
      >
        ثبت نام در سوال‌ساز
      </motion.h1>

      {/* توضیحات */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="text-gray-600 text-sm leading-relaxed"
        style={{ fontFamily: 'var(--font-family-yekanbakh)' }}
      >
        حساب کاربری خود را ایجاد کنید و به جمع هزاران کاربر فعال بپیوندید
      </motion.p>

      {/* خط جدا کننده تزئینی */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="mt-6 mb-2"
      >
        <div className="h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent" />
      </motion.div>
    </motion.div>
  );
}; 