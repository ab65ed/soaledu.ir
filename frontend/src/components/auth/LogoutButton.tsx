"use client"

import React, { useState } from "react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LogoutModal } from "./LogoutModal";
import { useLogout } from "@/hooks/useAuth";
import { motion } from "framer-motion";

interface LogoutButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  showText?: boolean;
}

/**
 * کامپوننت دکمه خروج
 * شامل مودال تأیید و مدیریت فرآیند خروج
 */
export const LogoutButton: React.FC<LogoutButtonProps> = ({
  variant = "ghost",
  size = "default",
  className = "",
  showText = true,
}) => {
  const [showModal, setShowModal] = useState(false);
  const logoutMutation = useLogout();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      setShowModal(false);
    } catch (error) {
      console.error('خطا در خروج:', error);
    }
  };

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button
          variant={variant}
          size={size}
          className={`${className}`}
          onClick={() => setShowModal(true)}
          aria-label="خروج از حساب کاربری"
        >
          <LogOut className="w-4 h-4" />
          {showText && <span className="mr-2">خروج</span>}
        </Button>
      </motion.div>

      <LogoutModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleLogout}
        isLoading={logoutMutation.isPending}
      />
    </>
  );
}; 