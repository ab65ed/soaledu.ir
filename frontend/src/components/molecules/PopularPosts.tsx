'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BlogPost } from '@/services/api';
import { cn } from '@/utils/cn';
import Link from 'next/link';
import Image from 'next/image';
import { 
  FireIcon, 
  EyeIcon, 
  CalendarIcon,
  ClockIcon 
} from '@heroicons/react/24/outline';

interface PopularPostsProps {
  posts: BlogPost[];
  isLoading?: boolean;
  title?: string;
  showCount?: number;
}

const PopularPostSkeleton = () => (
  <div className="flex gap-3 p-3 animate-pulse">
    <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex-shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
    </div>
  </div>
);

const PopularPostItem: React.FC<{
  post: BlogPost;
  index: number;
}> = ({ post, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Link href={`/blog/${post.slug}`}>
        <div className={cn(
          "group flex gap-3 p-3 rounded-lg transition-all duration-200",
          "hover:bg-gray-50 dark:hover:bg-gray-800",
          "border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
        )}>
          {/* Rank Number */}
          <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
            <span className={cn(
              "text-sm font-bold",
              index < 3 ? "text-orange-500" : "text-gray-400"
            )}>
              {index + 1}
            </span>
          </div>

          {/* Post Image */}
          <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden">
            {post.featuredImage ? (
              <Image
                src={post.featuredImage}
                alt={post.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-200"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white text-lg font-bold">
                  {post.title.charAt(0)}
                </span>
              </div>
            )}
            
            {/* Hot Badge for Top 3 */}
            {index < 3 && (
              <div className="absolute -top-1 -right-1">
                <FireIcon className="w-4 h-4 text-orange-500" />
              </div>
            )}
          </div>

          {/* Post Info */}
          <div className="flex-1 min-w-0">
            {/* Title */}
            <h4 className={cn(
              "font-medium text-sm leading-tight mb-1",
              "text-gray-900 dark:text-white",
              "group-hover:text-blue-600 dark:group-hover:text-blue-400",
              "line-clamp-2 text-right"
            )}>
              {post.title}
            </h4>

            {/* Meta Info */}
            <div className="space-y-1">
              {/* Date and Read Time */}
              <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <CalendarIcon className="w-3 h-3" />
                  <span>
                    {post.publishedAt 
                      ? new Date(post.publishedAt).toLocaleDateString('fa-IR', {
                          month: 'short',
                          day: 'numeric'
                        })
                      : 'تاریخ نامشخص'
                    }
                  </span>
                </div>
                
                <div className="flex items-center gap-1">
                  <ClockIcon className="w-3 h-3" />
                  <span>{post.readTime} دقیقه</span>
                </div>
              </div>

              {/* Views and Category */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                  <EyeIcon className="w-3 h-3" />
                  <span>{post.viewCount.toLocaleString('fa-IR')}</span>
                </div>
                
                <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                  {post.categoryName}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export const PopularPosts: React.FC<PopularPostsProps> = ({
  posts,
  isLoading,
  title = "محبوب‌ترین مقالات",
  showCount = 5
}) => {
  const displayPosts = posts.slice(0, showCount);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20">
        <div className="flex items-center gap-2">
          <FireIcon className="w-5 h-5 text-orange-500" />
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-2">
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: showCount }).map((_, index) => (
              <PopularPostSkeleton key={index} />
            ))}
          </div>
        ) : displayPosts.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <FireIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">هیچ مقاله محبوبی یافت نشد</p>
          </div>
        ) : (
          <div className="space-y-1">
            {displayPosts.map((post, index) => (
              <PopularPostItem
                key={post.id}
                post={post}
                index={index}
              />
            ))}
          </div>
        )}
      </div>

      {/* View All Link */}
      {!isLoading && posts.length > showCount && (
        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <Link
            href="/blog?sort=popular"
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
          >
            مشاهده همه مقالات محبوب ←
          </Link>
        </div>
      )}
    </div>
  );
};

export default PopularPosts; 