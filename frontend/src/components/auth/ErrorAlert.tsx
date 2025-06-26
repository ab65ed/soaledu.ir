"use client"

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, X } from "lucide-react";

interface ErrorAlertProps {
  message: string | null;
  onClose?: () => void;
  className?: string;
}

/**
 * کامپوننت نمایش خطا
 * برای نمایش پیام‌های خطا در فرم‌های احراز هویت
 */
export const ErrorAlert: React.FC<ErrorAlertProps> = ({
  message,
  onClose,
  className = "",
}) => {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, height: 0, y: -10 }}
          animate={{ opacity: 1, height: "auto", y: 0 }}
          exit={{ opacity: 0, height: 0, y: -10 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={className}
        >
          <Alert variant="destructive" className="relative">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-sm pr-6">
              {message}
            </AlertDescription>
            {onClose && (
              <button
                onClick={onClose}
                className="absolute left-2 top-2 text-destructive-foreground/50 hover:text-destructive-foreground transition-colors"
                aria-label="بستن پیام خطا"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </Alert>
        </motion.div>
      )}
    </AnimatePresence>
  );
}; 