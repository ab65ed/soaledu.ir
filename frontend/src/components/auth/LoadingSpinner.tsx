"use client"

import React from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  text?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * کامپوننت اسپینر بارگذاری
 * برای نمایش وضعیت بارگذاری در فرم‌ها
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  text = "در حال بارگذاری...",
  size = "md",
  className = "",
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`flex items-center justify-center gap-3 ${className}`}
    >
      <Loader2 className={`${sizeClasses[size]} animate-spin text-primary`} />
      <span className={`${textSizeClasses[size]} text-muted-foreground font-medium`}>
        {text}
      </span>
    </motion.div>
  );
}; 