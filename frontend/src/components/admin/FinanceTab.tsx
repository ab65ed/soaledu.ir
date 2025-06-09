'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { LoadingSpinner } from '@/components/atoms/LoadingSpinner';

/**
 * کامپوننت تب مدیریت مالی
 * Finance Management Tab Component
 */
export const FinanceTab: React.FC = () => {
  const [isLoading] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-center space-x-2">
        <CurrencyDollarIcon className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">مدیریت مالی</h2>
      </div>
      <p className="text-gray-600">
        این بخش در حال توسعه است...
      </p>
    </motion.div>
  );
}; 