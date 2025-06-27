"use client"

import React from "react";
import { motion } from "framer-motion";
import { LogIn, Sparkles } from "lucide-react";

/**
 * کامپوننت Header صفحه لاگین
 * شامل آیکون گرادینت و انیمیشن طلایی
 */
export const LoginHeader: React.FC = React.memo(() => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center mb-8"
    >
      {/* آیکون اصلی با گرادینت */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="relative mx-auto mb-6 w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg"
      >
        <LogIn className="w-10 h-10 text-white" />
        
        {/* انیمیشن طلایی */}
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
          <Sparkles className="w-4 h-4 text-white" />
        </motion.div>
      </motion.div>

      {/* عنوان */}
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-3xl font-bold text-gray-800 mb-4 leading-relaxed"
      >
        دروازه{' '}
        <span 
          style={{ 
            color: '#EA384C',
            textShadow: '0 0 10px rgba(234, 56, 76, 0.3), 0 0 20px rgba(234, 56, 76, 0.2)',
            fontWeight: 'bold'
          }}
        >
          دانش
        </span>
        <br />
        در انتظار شماست
      </motion.h1>

      {/* توضیحات */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-gray-600 text-lg max-w-md mx-auto leading-relaxed"
      >
        لطفاً برای ادامه وارد حساب کاربری خود شوید
      </motion.p>

      {/* نشانگر امنیت */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="flex items-center justify-center gap-2 mt-4 px-4 py-2 bg-green-50 border border-green-200 rounded-full text-green-700 text-sm font-medium w-fit mx-auto"
      >
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span>ورود امن و محافظت شده</span>
      </motion.div>

      {/* خط جداکننده */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mt-6"
      />
    </motion.div>
  );
});

LoginHeader.displayName = "LoginHeader";

export default LoginHeader;