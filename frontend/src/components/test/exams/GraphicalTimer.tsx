'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Clock } from 'lucide-react';

interface GraphicalTimerProps {
  /** زمان کل به ثانیه */
  totalTime: number;
  /** زمان باقی‌مانده به ثانیه */
  timeRemaining: number;
  /** اگر true باشد، تایمر در حالت هشدار قرار می‌گیرد */
  isWarning?: boolean;
  /** اگر true باشد، تایمر در حالت خطرناک قرار می‌گیرد */
  isCritical?: boolean;
  /** کالبک هنگام اتمام زمان */
  onTimeUp?: () => void;
  /** کلاس‌های اضافی */
  className?: string;
}

/**
 * کامپوننت تایمر گرافیکی دایره‌ای
 * GraphicalTimer - نمایش زمان باقی‌مانده با انیمیشن SVG و هشدارها
 */
export function GraphicalTimer({
  totalTime,
  timeRemaining,
  isWarning = false,
  isCritical = false,
  onTimeUp,
  className = ''
}: GraphicalTimerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (timeRemaining <= 0 && onTimeUp) {
      onTimeUp();
    }
  }, [timeRemaining, onTimeUp]);

  // محاسبه درصد پیشرفت
  const progress = Math.max(0, Math.min(100, (timeRemaining / totalTime) * 100));
  
  // محاسبه circumference برای circle
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  // تبدیل ثانیه به فرمت قابل نمایش
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // تعیین رنگ بر اساس وضعیت
  const getTimerColor = () => {
    if (isCritical) return '#ef4444'; // red-500
    if (isWarning) return '#f59e0b'; // amber-500
    return '#3b82f6'; // blue-500
  };

  // تعیین رنگ پس‌زمینه
  const getBackgroundColor = () => {
    if (isCritical) return '#fee2e2'; // red-100
    if (isWarning) return '#fef3c7'; // amber-100
    return '#dbeafe'; // blue-100
  };

  if (!mounted) return null;

  return (
    <div className={`relative ${className}`}>
      {/* Container اصلی */}
      <div
        className={`relative w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 ${
          isCritical ? 'bg-red-50 shadow-red-200' : 
          isWarning ? 'bg-amber-50 shadow-amber-200' : 
          'bg-blue-50 shadow-blue-200'
        } shadow-lg`}
      >
        {/* SVG Timer Ring */}
        <svg 
          className="absolute inset-0 w-full h-full transform -rotate-90" 
          viewBox="0 0 100 100"
        >
          {/* Background Circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={getBackgroundColor()}
            strokeWidth="6"
          />
          
          {/* Progress Circle */}
          <motion.circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={getTimerColor()}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            animate={{
              strokeDashoffset: strokeDashoffset,
            }}
            transition={{
              duration: 0.5,
              ease: "easeInOut"
            }}
            style={{
              filter: isCritical ? 'drop-shadow(0 0 8px rgba(239, 68, 68, 0.5))' : 
                     isWarning ? 'drop-shadow(0 0 8px rgba(245, 158, 11, 0.5))' : 
                     'drop-shadow(0 0 8px rgba(59, 130, 246, 0.3))'
            }}
          />
        </svg>

        {/* محتوای وسط */}
        <div className="text-center z-10">
          {/* آیکون زمان */}
          <motion.div
            animate={isCritical ? { 
              scale: [1, 1.1, 1],
              rotate: [0, -5, 5, 0]
            } : {}}
            transition={{
              duration: 1,
              repeat: isCritical ? Infinity : 0,
              repeatType: "loop"
            }}
            className="flex justify-center mb-1"
          >
            {isCritical ? (
              <AlertTriangle className="w-5 h-5 text-red-500" />
            ) : (
              <Clock className="w-5 h-5 text-gray-600" />
            )}
          </motion.div>

          {/* زمان باقی‌مانده */}
          <motion.div
            key={timeRemaining}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
            className={`text-lg font-bold font-mono ${
              isCritical ? 'text-red-600' : 
              isWarning ? 'text-amber-600' : 
              'text-gray-800'
            }`}
            dir="ltr"
          >
            {formatTime(timeRemaining)}
          </motion.div>

          {/* درصد باقی‌مانده */}
          <div className={`text-xs ${
            isCritical ? 'text-red-500' : 
            isWarning ? 'text-amber-500' : 
            'text-gray-500'
          }`}>
            %{Math.round(progress).toLocaleString('fa-IR')}
          </div>
        </div>

        {/* انیمیشن پالس برای حالت بحرانی */}
        {isCritical && (
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-red-500"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.7, 0, 0.7],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "loop"
            }}
          />
        )}
      </div>

      {/* پیام هشدار */}
      {isWarning && !isCritical && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-center"
        >
          <div className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-medium">
            زمان کم است!
          </div>
        </motion.div>
      )}

      {/* پیام بحرانی */}
      {isCritical && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-center"
        >
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              repeatType: "loop"
            }}
            className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-medium border-2 border-red-200"
          >
            زمان رو به اتمام!
          </motion.div>
        </motion.div>
      )}
    </div>
  );
} 