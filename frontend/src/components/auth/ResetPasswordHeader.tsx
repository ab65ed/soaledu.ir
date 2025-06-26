"use client"

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Key } from "lucide-react";

/**
 * کامپوننت Header صفحه ریست رمز عبور
 * شامل عنوان، توضیحات و انیمیشن‌های جذاب
 */
export const ResetPasswordHeader: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center mb-8"
    >
      {/* آیکون اصلی */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="relative mx-auto mb-6 w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg"
      >
        <ShieldCheck className="w-10 h-10 text-white" />
        
        {/* انیمیشن آیکون کلید */}
        <motion.div
          initial={{ opacity: 0, rotate: -45 }}
          animate={{ 
            opacity: [0, 1, 0],
            rotate: [-45, 0, 45],
            scale: [0.8, 1.2, 0.8]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatDelay: 1
          }}
          className="absolute -top-2 -left-2 w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center shadow-md"
        >
          <Key className="w-4 h-4 text-white" />
        </motion.div>
      </motion.div>

      {/* عنوان */}
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-3xl font-bold text-gray-900 mb-3"
      >
        تعیین رمز عبور جدید
      </motion.h1>

      {/* توضیحات */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-gray-600 text-lg max-w-md mx-auto leading-relaxed"
      >
        کد تأیید را وارد کرده و رمز عبور جدید و قوی انتخاب کنید
      </motion.p>

      {/* خط جداکننده */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="w-20 h-1 bg-gradient-to-r from-green-500 to-blue-600 rounded-full mx-auto mt-6"
      />
    </motion.div>
  );
}; 