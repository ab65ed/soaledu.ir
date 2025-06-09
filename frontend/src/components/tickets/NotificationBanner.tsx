'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { 
  Bell, 
  X, 
  Mail, 
  Clock,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';
import { contactService, ContactStats } from '@/services/api';

interface NotificationItem {
  id: string;
  type: 'new_ticket' | 'urgent_ticket' | 'system' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  priority: 'low' | 'medium' | 'high';
  read: boolean;
}

const NotificationBanner: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [dismissedNotifications, setDismissedNotifications] = useState<Set<string>>(new Set());
  const [lastStats, setLastStats] = useState<ContactStats | null>(null);

  // دریافت آمار با polling برای شناسایی تیکت‌های جدید
  const { data: currentStats } = useQuery({
    queryKey: ['support-stats-notifications'],
    queryFn: contactService.getContactStats,
    refetchInterval: 60000, // هر دقیقه
    staleTime: 30000, // 30 ثانیه
  });

  // مدیریت اعلان‌های جدید بر اساس تغییرات آمار
  useEffect(() => {
    if (!currentStats || !lastStats) {
      if (currentStats) setLastStats(currentStats);
      return;
    }

    const newNotifications: NotificationItem[] = [];

    // بررسی تیکت‌های جدید در انتظار پاسخ
    if (currentStats.pending > lastStats.pending) {
      const newPendingCount = currentStats.pending - lastStats.pending;
      newNotifications.push({
        id: `pending-${Date.now()}`,
        type: 'new_ticket',
        title: 'تیکت جدید دریافت شد',
        message: `${newPendingCount} تیکت جدید در انتظار پاسخ شما است`,
        timestamp: new Date(),
        priority: newPendingCount > 5 ? 'high' : 'medium',
        read: false
      });
    }

    // بررسی تیکت‌های فوری (بیش از 10 تیکت در انتظار)
    if (currentStats.pending > 10 && lastStats.pending <= 10) {
      newNotifications.push({
        id: `urgent-${Date.now()}`,
        type: 'urgent_ticket',
        title: 'تعداد تیکت‌های در انتظار بالا است',
        message: `${currentStats.pending} تیکت در انتظار پاسخ دارید. لطفاً در اسرع وقت پاسخ دهید`,
        timestamp: new Date(),
        priority: 'high',
        read: false
      });
    }

    // اضافه کردن اعلان‌های جدید
    if (newNotifications.length > 0) {
      setNotifications(prev => [...newNotifications, ...prev]);
    }

    setLastStats(currentStats);
  }, [currentStats, lastStats]);

  // حذف اعلان
  const dismissNotification = (id: string) => {
    setDismissedNotifications(prev => new Set([...prev, id]));
    // حذف اعلان بعد از انیمیشن
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 300);
  };

  // علامت‌گذاری همه اعلان‌ها به عنوان خوانده شده
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // فیلتر اعلان‌های غیر رد شده
  const visibleNotifications = notifications.filter(n => !dismissedNotifications.has(n.id));

  // گرفتن آیکون مناسب برای هر نوع اعلان
  const getNotificationIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'new_ticket':
        return <Mail className="w-5 h-5" />;
      case 'urgent_ticket':
        return <AlertTriangle className="w-5 h-5" />;
      case 'system':
        return <CheckCircle className="w-5 h-5" />;
      case 'info':
        return <Info className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  // گرفتن رنگ مناسب برای اولویت
  const getPriorityColor = (priority: NotificationItem['priority'], type: NotificationItem['type']) => {
    if (type === 'urgent_ticket') return 'bg-red-50 border-red-200 text-red-800';
    
    switch (priority) {
      case 'high':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'medium':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'low':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  // گرفتن رنگ آیکون
  const getIconColor = (type: NotificationItem['type'], priority: NotificationItem['priority']) => {
    if (type === 'urgent_ticket') return 'text-red-600';
    
    switch (priority) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  // اگر اعلانی وجود ندارد، چیزی نمایش نده
  if (visibleNotifications.length === 0) {
    return null;
  }

  return (
    <div className="bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-4">
          {/* هدر اعلان‌ها */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-gray-900">
                اعلان‌های جدید ({visibleNotifications.length})
              </span>
            </div>
            
            <button
              onClick={markAllAsRead}
              className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              علامت‌گذاری همه به عنوان خوانده شده
            </button>
          </div>

          {/* لیست اعلان‌ها */}
          <div className="space-y-3">
            <AnimatePresence>
              {visibleNotifications.slice(0, 5).map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, height: 0, y: -20 }}
                  animate={{ 
                    opacity: dismissedNotifications.has(notification.id) ? 0 : 1, 
                    height: dismissedNotifications.has(notification.id) ? 0 : 'auto',
                    y: 0 
                  }}
                  exit={{ opacity: 0, height: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className={`rounded-lg border p-4 ${getPriorityColor(notification.priority, notification.type)} ${
                    !notification.read ? 'ring-2 ring-blue-500 ring-opacity-20' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* آیکون */}
                    <div className={`flex-shrink-0 ${getIconColor(notification.type, notification.priority)}`}>
                      {getNotificationIcon(notification.type)}
                    </div>

                    {/* محتوای اعلان */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {notification.title}
                            {!notification.read && (
                              <span className="mr-2 w-2 h-2 bg-blue-500 rounded-full inline-block"></span>
                            )}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            <span>
                              {notification.timestamp.toLocaleTimeString('fa-IR', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        </div>

                        {/* دکمه حذف */}
                        <button
                          onClick={() => dismissNotification(notification.id)}
                          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors p-1"
                          title="حذف اعلان"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* نمایش تعداد اعلان‌های باقی‌مانده */}
          {visibleNotifications.length > 5 && (
            <div className="mt-3 text-center">
              <span className="text-sm text-gray-500">
                و {visibleNotifications.length - 5} اعلان دیگر...
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationBanner; 