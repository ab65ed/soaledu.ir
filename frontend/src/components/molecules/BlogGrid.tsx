'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BlogPost } from '@/services/api';
import { cn } from '@/utils/cn';
import Image from 'next/image';
import Link from 'next/link';
import { CalendarIcon, ClockIcon, EyeIcon, UserIcon } from '@heroicons/react/24/outline';

interface BlogGridProps {
  posts: BlogPost[];
  isLoading?: boolean;
}

// BentoGrid component
const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto",
        className,
      )}
    >
      {children}
    </div>
  );
};

// BentoGridItem component
const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
  children,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "row-span-1 rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-4 dark:bg-black dark:border-white/[0.2] bg-white border border-transparent justify-between flex flex-col space-y-4",
        className,
      )}
    >
      {header}
      <div className="group-hover/bento:translate-x-2 transition duration-200">
        {icon}
        <div className="font-sans font-bold text-neutral-600 dark:text-neutral-200 mb-2 mt-2">
          {title}
        </div>
        <div className="font-sans font-normal text-neutral-600 text-xs dark:text-neutral-300">
          {description}
        </div>
        {children}
      </div>
    </div>
  );
};

// BlogCard component for individual blog posts
const BlogCard = ({ post, index }: { post: BlogPost; index: number }) => {
  const isLarge = index === 0 || index === 4; // First and fifth items are larger
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/blog/${post.slug}`}>
        <BentoGridItem
          className={cn(
            "cursor-pointer hover:scale-[1.02] transition-all duration-300",
            isLarge ? "md:col-span-2" : "md:col-span-1"
          )}
          title={
            <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2">
              {post.title}
            </h3>
          }
          description={
            <p className="text-gray-600 dark:text-gray-300 line-clamp-3">
              {post.excerpt}
            </p>
          }
          header={
            <div className="relative w-full h-32 mb-4 rounded-lg overflow-hidden">
              {post.featuredImage ? (
                <Image
                  src={post.featuredImage}
                  alt={post.title}
                  fill
                  className="object-cover group-hover/bento:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">
                    {post.title.charAt(0)}
                  </span>
                </div>
              )}
              
                             {/* Category Badge */}
               <div className="absolute top-2 right-2">
                 <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                   {post.categoryName}
                 </span>
               </div>
            </div>
          }
        >
          {/* Post Meta Information */}
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-4">
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
                             <div className="flex items-center space-x-1 rtl:space-x-reverse">
                 <UserIcon className="w-4 h-4" />
                 <span>{post.authorName}</span>
               </div>
               
               <div className="flex items-center space-x-1 rtl:space-x-reverse">
                 <CalendarIcon className="w-4 h-4" />
                 <span>
                   {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('fa-IR') : 'تاریخ نامشخص'}
                 </span>
               </div>
            </div>
            
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="flex items-center space-x-1 rtl:space-x-reverse">
                <ClockIcon className="w-4 h-4" />
                <span>{post.readTime} دقیقه</span>
              </div>
              
              <div className="flex items-center space-x-1 rtl:space-x-reverse">
                <EyeIcon className="w-4 h-4" />
                <span>{post.viewCount}</span>
              </div>
            </div>
          </div>
          
                     {/* Tags */}
           {post.tags && post.tags.length > 0 && (
             <div className="flex flex-wrap gap-1 mt-2">
               {post.tags.slice(0, 3).map((tag, tagIndex) => (
                 <span
                   key={tagIndex}
                   className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs"
                 >
                   #{tag}
                 </span>
               ))}
               {post.tags.length > 3 && (
                 <span className="text-gray-500 text-xs">
                   +{post.tags.length - 3} بیشتر
                 </span>
               )}
             </div>
           )}
        </BentoGridItem>
      </Link>
    </motion.div>
  );
};

// Loading skeleton component
const BlogGridSkeleton = () => {
  return (
    <BentoGrid>
      {Array.from({ length: 6 }).map((_, index) => (
        <BentoGridItem
          key={index}
          className={cn(
            "animate-pulse",
            index === 0 || index === 4 ? "md:col-span-2" : "md:col-span-1"
          )}
          header={
            <div className="w-full h-32 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4" />
          }
          title={
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
          }
          description={
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
            </div>
          }
        />
      ))}
    </BentoGrid>
  );
};

// Main BlogGrid component
export const BlogGrid: React.FC<BlogGridProps> = ({ posts, isLoading }) => {
  if (isLoading) {
    return <BlogGridSkeleton />;
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 dark:text-gray-400 text-lg">
          هیچ مقاله‌ای یافت نشد
        </div>
        <p className="text-gray-400 dark:text-gray-500 mt-2">
          لطفاً بعداً دوباره تلاش کنید یا فیلترهای جستجو را تغییر دهید
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="w-full"
    >
      <BentoGrid>
        {posts.map((post, index) => (
          <BlogCard key={post.id} post={post} index={index} />
        ))}
      </BentoGrid>
    </motion.div>
  );
};

export default BlogGrid; 