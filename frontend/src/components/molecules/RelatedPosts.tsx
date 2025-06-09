'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BlogPost } from '@/services/api';
import { cn } from '@/utils/cn';
import Link from 'next/link';
import Image from 'next/image';
import { 
  LinkIcon, 
  EyeIcon, 
  CalendarIcon,
  ClockIcon,
  TagIcon
} from '@heroicons/react/24/outline';

interface RelatedPostsProps {
  posts: BlogPost[];
  isLoading?: boolean;
  title?: string;
  currentPostId?: string;
}

const RelatedPostSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden animate-pulse">
    <div className="h-48 bg-gray-200 dark:bg-gray-700" />
    <div className="p-4 space-y-3">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
      <div className="flex justify-between">
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16" />
      </div>
    </div>
  </div>
);

const RelatedPostCard: React.FC<{
  post: BlogPost;
  index: number;
}> = ({ post, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Link href={`/blog/${post.slug}`}>
        <div className={cn(
          "group bg-white dark:bg-gray-800 rounded-lg shadow-sm",
          "border border-gray-200 dark:border-gray-700",
          "overflow-hidden transition-all duration-200",
          "hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600",
          "hover:-translate-y-1"
        )}>
          {/* Post Image */}
          <div className="relative h-48 overflow-hidden">
            {post.featuredImage ? (
              <Image
                src={post.featuredImage}
                alt={post.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white text-3xl font-bold">
                  {post.title.charAt(0)}
                </span>
              </div>
            )}
            
            {/* Category Badge */}
            <div className="absolute top-3 right-3">
              <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                {post.categoryName}
              </span>
            </div>

            {/* Read Time Badge */}
            <div className="absolute bottom-3 left-3">
              <div className="bg-black/70 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                <ClockIcon className="w-3 h-3" />
                <span>{post.readTime} دقیقه</span>
              </div>
            </div>
          </div>

          {/* Post Content */}
          <div className="p-4">
            {/* Title */}
            <h3 className={cn(
              "font-semibold text-lg leading-tight mb-2",
              "text-gray-900 dark:text-white",
              "group-hover:text-blue-600 dark:group-hover:text-blue-400",
              "line-clamp-2 text-right transition-colors"
            )}>
              {post.title}
            </h3>

            {/* Excerpt */}
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-3 line-clamp-2 text-right">
              {post.excerpt}
            </p>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {post.tags.slice(0, 2).map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className="inline-flex items-center gap-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs"
                  >
                    <TagIcon className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
                {post.tags.length > 2 && (
                  <span className="text-gray-500 text-xs">
                    +{post.tags.length - 2}
                  </span>
                )}
              </div>
            )}

            {/* Meta Info */}
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <CalendarIcon className="w-3 h-3" />
                  <span>
                    {post.publishedAt 
                      ? new Date(post.publishedAt).toLocaleDateString('fa-IR', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })
                      : 'تاریخ نامشخص'
                    }
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                <EyeIcon className="w-3 h-3" />
                <span>{post.viewCount.toLocaleString('fa-IR')}</span>
              </div>
            </div>

            {/* Author */}
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    {post.authorName.charAt(0)}
                  </span>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {post.authorName}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export const RelatedPosts: React.FC<RelatedPostsProps> = ({
  posts,
  isLoading,
  title = "مقالات مرتبط",
  currentPostId
}) => {
  // Filter out current post if provided
  const filteredPosts = currentPostId 
    ? posts.filter(post => post.id !== currentPostId)
    : posts;

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-2">
        <LinkIcon className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          {title}
        </h2>
      </div>

      {/* Posts Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <RelatedPostSkeleton key={index} />
          ))}
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <LinkIcon className="w-12 h-12 mx-auto mb-3 text-gray-400 opacity-50" />
          <p className="text-gray-500 dark:text-gray-400">
            هیچ مقاله مرتبطی یافت نشد
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            لطفاً بعداً دوباره بررسی کنید
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.slice(0, 3).map((post, index) => (
            <RelatedPostCard
              key={post.id}
              post={post}
              index={index}
            />
          ))}
        </div>
      )}

      {/* View More Link */}
      {!isLoading && filteredPosts.length > 3 && (
        <div className="text-center">
          <Link
            href="/blog"
            className={cn(
              "inline-flex items-center gap-2 px-6 py-3",
              "bg-blue-600 text-white rounded-lg",
              "hover:bg-blue-700 transition-colors",
              "font-medium"
            )}
          >
            <span>مشاهده مقالات بیشتر</span>
            <LinkIcon className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
};

export default RelatedPosts; 