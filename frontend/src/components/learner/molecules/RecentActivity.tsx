'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { LearnerProgress } from '@/services/api';
import { 
  CheckCircle, 
  Play, 
  ShoppingCart, 
  Clock,
  Calendar
} from 'lucide-react';

interface RecentActivityProps {
  activities: LearnerProgress['recentActivity'];
}

/**
 * کامپوننت فعالیت‌های اخیر فراگیر
 * Learner recent activity component
 */
export default function RecentActivity({ activities }: RecentActivityProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'exam_completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'exam_started':
        return <Play className="w-4 h-4 text-blue-600" />;
      case 'purchase':
        return <ShoppingCart className="w-4 h-4 text-purple-600" />;
      default:
        return <Calendar className="w-4 h-4 text-gray-400" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'exam_completed':
        return 'bg-green-100 border-green-200';
      case 'exam_started':
        return 'bg-blue-100 border-blue-200';
      case 'purchase':
        return 'bg-purple-100 border-purple-200';
      default:
        return 'bg-gray-100 border-gray-200';
    }
  };

  const getActivityText = (type: string) => {
    switch (type) {
      case 'exam_completed':
        return 'آزمون تکمیل شد';
      case 'exam_started':
        return 'آزمون شروع شد';
      case 'purchase':
        return 'خرید انجام شد';
      default:
        return 'فعالیت';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return 'امروز';
    } else if (diffDays === 2) {
      return 'دیروز';
    } else if (diffDays <= 7) {
      return `${diffDays} روز پیش`;
    } else {
      return date.toLocaleDateString('fa-IR');
    }
  };

  return (
    <motion.div
      className="bg-white rounded-xl shadow-sm p-6"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      {/* هدر */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            فعالیت‌های اخیر
          </h3>
          <p className="text-sm text-gray-600">
            آخرین {activities.length} فعالیت شما
          </p>
        </div>
        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
          <Clock className="w-5 h-5 text-gray-600" />
        </div>
      </div>

      {/* لیست فعالیت‌ها */}
      <div className="space-y-4">
        {activities.length > 0 ? (
          activities.map((activity, index) => (
            <motion.div
              key={`${activity.type}-${activity.date}-${index}`}
              className="flex items-start gap-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              {/* آیکون فعالیت */}
              <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${getActivityColor(activity.type)}`}>
                {getActivityIcon(activity.type)}
              </div>

              {/* محتوای فعالیت */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {activity.title}
                  </h4>
                  <span className="text-xs text-gray-500 flex-shrink-0 mr-2">
                    {formatDate(activity.date)}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-1">
                  {getActivityText(activity.type)}
                </p>
                
                {activity.details && (
                  <p className="text-xs text-gray-500 truncate">
                    {activity.details}
                  </p>
                )}
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-sm font-medium text-gray-900 mb-2">
              فعالیتی یافت نشد
            </h3>
            <p className="text-sm text-gray-500">
              فعالیت‌های شما اینجا نمایش داده می‌شود
            </p>
          </div>
        )}
      </div>

      {/* لینک مشاهده همه */}
      {activities.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <button className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium py-2 hover:bg-blue-50 rounded-lg transition-colors">
            مشاهده همه فعالیت‌ها
          </button>
        </div>
      )}

      {/* خلاصه فعالیت‌ها */}
      {activities.length > 0 && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-lg font-bold text-gray-900">
                {activities.filter(a => a.type === 'exam_completed').length}
              </p>
              <p className="text-xs text-gray-600">آزمون تکمیل شده</p>
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">
                {activities.filter(a => a.type === 'exam_started').length}
              </p>
              <p className="text-xs text-gray-600">آزمون شروع شده</p>
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">
                {activities.filter(a => a.type === 'purchase').length}
              </p>
              <p className="text-xs text-gray-600">خرید انجام شده</p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
} 