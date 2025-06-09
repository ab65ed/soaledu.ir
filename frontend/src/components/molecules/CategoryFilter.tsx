'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BlogCategory } from '@/services/api';
import { cn } from '@/utils/cn';
import { FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface CategoryFilterProps {
  categories: BlogCategory[];
  selectedCategory?: string;
  onCategoryChange: (categoryId?: string) => void;
  isLoading?: boolean;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  isLoading
}) => {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 }
  };

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="flex items-center gap-2 mb-4">
          <FunnelIcon className="w-5 h-5 text-gray-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            دسته‌بندی‌ها
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"
              style={{ width: `${Math.random() * 60 + 60}px` }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FunnelIcon className="w-5 h-5 text-blue-600" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            فیلتر بر اساس دسته‌بندی
          </span>
        </div>
        
        {selectedCategory && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onCategoryChange(undefined)}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-500 transition-colors"
          >
            <XMarkIcon className="w-4 h-4" />
            پاک کردن فیلتر
          </motion.button>
        )}
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        {/* All Categories Button */}
        <motion.button
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onCategoryChange(undefined)}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
            "border border-gray-200 dark:border-gray-700",
            !selectedCategory
              ? "bg-blue-600 text-white border-blue-600 shadow-lg"
              : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          )}
        >
          همه دسته‌ها
        </motion.button>

        {/* Category Buttons */}
        {categories.map((category) => (
          <motion.button
            key={category.id}
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onCategoryChange(category.id)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
              "border border-gray-200 dark:border-gray-700",
              "flex items-center gap-2",
              selectedCategory === category.id
                ? "bg-blue-600 text-white border-blue-600 shadow-lg"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            )}
          >
            {/* Category Color Indicator */}
            {category.color && (
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: category.color }}
              />
            )}
            
            <span>{category.name}</span>
            
            {/* Post Count */}
            <span
              className={cn(
                "px-2 py-0.5 rounded-full text-xs",
                selectedCategory === category.id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
              )}
            >
              {category.postCount}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Selected Category Info */}
      {selectedCategory && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
        >
          {(() => {
            const category = categories.find(c => c.id === selectedCategory);
            return category ? (
              <div className="flex items-start gap-3">
                {category.color && (
                  <div
                    className="w-4 h-4 rounded-full mt-0.5 flex-shrink-0"
                    style={{ backgroundColor: category.color }}
                  />
                )}
                <div className="flex-1">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                    {category.name}
                  </h4>
                  {category.description && (
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      {category.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 mt-2 text-xs text-blue-600 dark:text-blue-400">
                    <span>{category.postCount} مقاله</span>
                    <span>
                      آخرین بروزرسانی: {new Date(category.updatedAt).toLocaleDateString('fa-IR')}
                    </span>
                  </div>
                </div>
              </div>
            ) : null;
          })()}
        </motion.div>
      )}

      {/* No Categories Message */}
      {categories.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <FunnelIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">هیچ دسته‌بندی‌ای یافت نشد</p>
        </div>
      )}
    </motion.div>
  );
};

export default CategoryFilter; 