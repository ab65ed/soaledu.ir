/**
 * کامپوننت دکمه خروج - Logout Button Component
 * شامل مودال تأیید خروج و انیمیشن‌های Framer Motion
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, X, Loader2 } from 'lucide-react';
import { useAuth } from '@/stores/authStore';
import { authService } from '@/services/api';

export default function LogoutButton() {
  const router = useRouter();
  const { logout, user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      
      // فراخوانی API خروج
      await authService.logout();
      
      // پاک کردن اطلاعات محلی
      logout();
      
      // هدایت به صفحه ورود
      router.push('/auth/login');
      
    } catch (error) {
      console.error('خطا در خروج:', error);
      // حتی در صورت خطا، کاربر را خارج کن
      logout();
      router.push('/auth/login');
    } finally {
      setIsLoggingOut(false);
      setShowModal(false);
    }
  };

  return (
    <>
      {/* دکمه اصلی خروج */}
      <div className="flex space-x-3 space-x-reverse">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowModal(true)}
          className="flex-1 flex items-center justify-center px-4 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
        >
          <LogOut className="h-4 w-4 ml-2" />
          خروج از حساب
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => router.back()}
          className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          انصراف
        </motion.button>
      </div>

      {/* مودال تأیید خروج */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
            onClick={() => !isLoggingOut && setShowModal(false)}
          >
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <motion.div
                initial={{ scale: 0.8, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="mt-3 text-center"
              >
                {/* آیکون هشدار */}
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <LogOut className="h-6 w-6 text-red-600" />
                </div>

                {/* عنوان */}
                <h3 className="text-lg leading-6 font-medium text-gray-900 mt-4">
                  تأیید خروج
                </h3>

                {/* متن */}
                <div className="mt-2 px-7 py-3">
                  <p className="text-sm text-gray-500">
                    آیا مطمئن هستید که می‌خواهید از حساب کاربری{' '}
                    <span className="font-medium text-gray-900">{user?.name}</span>{' '}
                    خارج شوید؟
                  </p>
                </div>

                {/* دکمه‌ها */}
                <div className="flex items-center px-4 py-3 space-x-2 space-x-reverse">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isLoggingOut ? (
                      <>
                        <Loader2 className="animate-spin h-4 w-4 inline ml-2" />
                        در حال خروج...
                      </>
                    ) : (
                      'بله، خارج شو'
                    )}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowModal(false)}
                    disabled={isLoggingOut}
                    className="px-4 py-2 bg-white text-gray-500 text-base font-medium rounded-md w-full shadow-sm border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:opacity-50 transition-colors"
                  >
                    انصراف
                  </motion.button>
                </div>

                {/* دکمه بستن */}
                <button
                  onClick={() => !isLoggingOut && setShowModal(false)}
                  disabled={isLoggingOut}
                  className="absolute top-3 left-3 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                >
                  <X className="h-5 w-5" />
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 