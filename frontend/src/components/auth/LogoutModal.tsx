"use client"

import React from "react";
import { motion } from "framer-motion";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

/**
 * کامپوننت مودال تأیید خروج
 * شامل اطلاعات جلسه کاربر و تأیید نهایی خروج
 */
export const LogoutModal: React.FC<LogoutModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}) => {
  const { user } = useAuthStore();

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader className="text-center space-y-4">
          {/* آیکون */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center"
          >
            <LogOut className="w-8 h-8 text-orange-600" />
          </motion.div>

          <AlertDialogTitle className="text-xl font-bold text-foreground">
            تأیید خروج از حساب کاربری
          </AlertDialogTitle>
          
          <AlertDialogDescription className="text-sm text-muted-foreground leading-relaxed">
            آیا مطمئن هستید که می‌خواهید از حساب کاربری خود خارج شوید؟
            <br />
            برای ورود مجدد نیاز به وارد کردن ایمیل و رمز عبور خواهید داشت.
          </AlertDialogDescription>

          {/* اطلاعات کاربر */}
          {user && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="bg-muted/50 rounded-lg p-4 border border-border/50"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div className="text-right">
                  <p className="font-medium text-foreground text-sm">
                    {user.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {user.email}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary">
                      {user.role === 'admin' && 'مدیر سیستم'}
                      {user.role === 'designer' && 'طراح سوال'}
                      {user.role === 'learner' && 'فراگیر'}
                      {user.role === 'expert' && 'کارشناس'}
                      {user.role === 'support' && 'پشتیبان'}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AlertDialogHeader>

        <AlertDialogFooter className="flex gap-3 pt-6">
          <AlertDialogCancel asChild>
            <Button
              variant="outline"
              className="flex-1"
              disabled={isLoading}
            >
              لغو
            </Button>
          </AlertDialogCancel>
          
          <AlertDialogAction asChild>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={onConfirm}
              disabled={isLoading}
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                />
              ) : (
                <>
                  <LogOut className="w-4 h-4 ml-2" />
                  خروج
                </>
              )}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}; 