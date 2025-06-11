'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  AcademicCapIcon,
  SparklesIcon 
} from '@heroicons/react/24/outline';

interface MinimalHeaderProps {
  showLogo?: boolean;
  logoText?: string;
  className?: string;
  variant?: 'default' | 'transparent' | 'bordered';
}

const MinimalHeader: React.FC<MinimalHeaderProps> = ({
  showLogo = true,
  logoText = 'سوال‌ادو',
  className = '',
  variant = 'default'
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'transparent':
        return 'bg-transparent border-none shadow-none';
      case 'bordered':
        return 'bg-white border-b border-gray-200 shadow-none';
      default:
        return 'bg-white border-b border-gray-100 shadow-sm';
    }
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`sticky top-0 z-50 ${getVariantClasses()} ${className}`}
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* لوگو */}
          {showLogo && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Link 
                href="/" 
                className="flex items-center space-x-3 space-x-reverse group"
              >
                {/* آیکون لوگو */}
                <div className="relative">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow">
                    <AcademicCapIcon className="w-6 h-6 text-white" />
                  </div>
                  {/* افکت درخشش */}
                  <div className="absolute inset-0 p-2 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity">
                    <SparklesIcon className="w-6 h-6 text-white" />
                  </div>
                </div>
                
                {/* متن لوگو */}
                <div className="flex flex-col">
                  <span 
                    className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors"
                    style={{ fontFamily: 'IRANSans, Tahoma, Arial, sans-serif' }}
                  >
                    {logoText}
                  </span>
                  <span 
                    className="text-xs text-gray-500 group-hover:text-blue-500 transition-colors"
                    style={{ fontFamily: 'IRANSans, Tahoma, Arial, sans-serif' }}
                  >
                    پلتفرم آموزشی
                  </span>
                </div>
              </Link>
            </motion.div>
          )}

          {/* فضای خالی برای تعادل */}
          <div className="flex-1"></div>

          {/* دکمه‌های ساده */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center space-x-4 space-x-reverse"
          >
            <Link
              href="/courses"
              className="text-gray-600 hover:text-blue-600 transition-colors text-sm font-medium"
              style={{ fontFamily: 'IRANSans, Tahoma, Arial, sans-serif' }}
            >
              دوره‌ها
            </Link>
            <Link
              href="/about"
              className="text-gray-600 hover:text-blue-600 transition-colors text-sm font-medium"
              style={{ fontFamily: 'IRANSans, Tahoma, Arial, sans-serif' }}
            >
              درباره ما
            </Link>
            <Link
              href="/contact"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm"
              style={{ fontFamily: 'IRANSans, Tahoma, Arial, sans-serif' }}
            >
              تماس با ما
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
};

export default MinimalHeader; 