"use client"

import React from "react";
import { motion } from "framer-motion";
import { KeyRound, Mail } from "lucide-react";

/**
 * کامپوننت Header صفحه فراموشی رمز عبور
 */
export const ForgotPasswordHeader: React.FC = () => {
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
        className="relative mx-auto mb-6 w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg"
      >
        <KeyRound className="w-10 h-10 text-white" />
        
        {/* انیمیشن آیکون ایمیل */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ 
            opacity: [0, 1, 0],
            x: [20, 0, -20],
            rotate: [0, 360]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatDelay: 1
          }}
          className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-md"
        >
          <Mail className="w-4 h-4 text-white" />
        </motion.div>
      </motion.div>

      {/* عنوان */}
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-3xl font-bold text-gray-900 mb-3"
      >
        فراموشی رمز عبور
      </motion.h1>

      {/* توضیحات */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-gray-600 text-lg max-w-md mx-auto leading-relaxed"
      >
        نگران نباشید! ایمیل یا شماره موبایل خود را وارد کنید تا لینک بازیابی رمز عبور برایتان ارسال شود
      </motion.p>

      {/* خط جداکننده */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mt-6"
      />
    </motion.div>
  );
}; 