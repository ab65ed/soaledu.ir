/**
 * React Query hooks for Blog functionality
 * هوک‌های React Query برای عملکرد بلاگ
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { blogService, type BlogPost, type BlogCategory, type BlogFilters } from '@/services/api';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

// Query Keys
export const blogQueryKeys = {
  all: ['blog'] as const,
  posts: () => [...blogQueryKeys.all, 'posts'] as const,
  post: (slug: string) => [...blogQueryKeys.posts(), slug] as const,
  postsByFilter: (filters: BlogFilters) => [...blogQueryKeys.posts(), 'filter', filters] as const,
  popularPosts: (limit: number) => [...blogQueryKeys.posts(), 'popular', limit] as const,
  relatedPosts: (postId: string, limit: number) => [...blogQueryKeys.posts(), 'related', postId, limit] as const,
  
  categories: () => [...blogQueryKeys.all, 'categories'] as const,
  
  comments: () => [...blogQueryKeys.all, 'comments'] as const,
  postComments: (postId: string) => [...blogQueryKeys.comments(), postId] as const,
  
  stats: () => [...blogQueryKeys.all, 'stats'] as const,
  search: (query: string) => [...blogQueryKeys.all, 'search', query] as const,
};

// =====================
// Blog Posts Hooks
// =====================

/**
 * دریافت لیست مقالات بلاگ با فیلتر
 */
export function useBlogPosts(filters: BlogFilters = {}) {
  return useQuery({
    queryKey: blogQueryKeys.postsByFilter(filters),
    queryFn: () => blogService.getBlogPosts(filters),
    staleTime: 1000 * 60 * 2, // 2 دقیقه برای content fresh
    gcTime: 1000 * 60 * 5, // 5 دقیقه
    refetchOnWindowFocus: false,
  });
}

/**
 * دریافت مقاله بلاگ با slug
 */
export function useBlogPost(slug: string, enabled = true) {
  return useQuery({
    queryKey: blogQueryKeys.post(slug),
    queryFn: () => blogService.getBlogPostBySlug(slug),
    enabled: enabled && !!slug,
    staleTime: 1000 * 60 * 5, // 5 دقیقه
    gcTime: 1000 * 60 * 10, // 10 دقیقه
    refetchOnWindowFocus: false,
  });
}

/**
 * دریافت مقالات پربازدید
 */
export function usePopularBlogPosts(limit = 5) {
  return useQuery({
    queryKey: blogQueryKeys.popularPosts(limit),
    queryFn: () => blogService.getPopularBlogPosts(limit),
    staleTime: 1000 * 60 * 10, // 10 دقیقه - نسبتاً ثابت
    gcTime: 1000 * 60 * 20, // 20 دقیقه
    refetchOnWindowFocus: false,
  });
}

/**
 * دریافت مقالات مرتبط
 */
export function useRelatedBlogPosts(postId: string, limit = 3, enabled = true) {
  return useQuery({
    queryKey: blogQueryKeys.relatedPosts(postId, limit),
    queryFn: () => blogService.getRelatedBlogPosts(postId, limit),
    enabled: enabled && !!postId,
    staleTime: 1000 * 60 * 15, // 15 دقیقه
    gcTime: 1000 * 60 * 30, // 30 دقیقه
    refetchOnWindowFocus: false,
  });
}

/**
 * جستجوی مقالات
 */
export function useSearchBlogPosts(query: string, enabled = true) {
  return useQuery({
    queryKey: blogQueryKeys.search(query),
    queryFn: () => blogService.searchBlogPosts(query),
    enabled: enabled && query.length >= 2, // حداقل 2 کاراکتر
    staleTime: 1000 * 30, // 30 ثانیه - جستجو نسبتاً dynamic
    gcTime: 1000 * 60 * 2, // 2 دقیقه
    refetchOnWindowFocus: false,
  });
}

// =====================
// Blog Categories Hooks
// =====================

/**
 * دریافت دسته‌بندی‌های بلاگ
 */
export function useBlogCategories() {
  return useQuery({
    queryKey: blogQueryKeys.categories(),
    queryFn: () => blogService.getBlogCategories(),
    staleTime: 1000 * 60 * 30, // 30 دقیقه - نسبتاً ثابت
    gcTime: 1000 * 60 * 60, // 1 ساعت
    refetchOnWindowFocus: false,
  });
}

// =====================
// Blog Comments Hooks
// =====================

/**
 * دریافت نظرات مقاله
 */
export function useBlogComments(postId: string, approved = true, enabled = true) {
  return useQuery({
    queryKey: blogQueryKeys.postComments(postId),
    queryFn: () => blogService.getBlogComments(postId, approved),
    enabled: enabled && !!postId,
    staleTime: 1000 * 60, // 1 دقیقه - کامنت‌ها نسبتاً dynamic
    gcTime: 1000 * 60 * 5, // 5 دقیقه
    refetchOnWindowFocus: false,
  });
}

// =====================
// Blog Stats Hooks
// =====================

/**
 * دریافت آمار بلاگ (برای Admin Dashboard)
 */
export function useBlogStats() {
  return useQuery({
    queryKey: blogQueryKeys.stats(),
    queryFn: () => blogService.getBlogStats(),
    staleTime: 1000 * 60 * 5, // 5 دقیقه
    gcTime: 1000 * 60 * 10, // 10 دقیقه
    refetchOnWindowFocus: false,
  });
}

// =====================
// Blog Mutation Hooks
// =====================

/**
 * ایجاد مقاله جدید
 */
export function useCreateBlogPost() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: Partial<BlogPost>) => blogService.createBlogPost(data),
    onSuccess: (newPost) => {
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.posts() });
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.categories() });
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.stats() });
      
      toast.success('مقاله با موفقیت ایجاد شد');
      
      // هدایت به صفحه مقاله جدید
      router.push(`/blog/${newPost.slug}`);
    },
    onError: (error: Error) => {
      toast.error(`خطا در ایجاد مقاله: ${error.message}`);
    },
  });
}

/**
 * ویرایش مقاله
 */
export function useUpdateBlogPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<BlogPost> }) => 
      blogService.updateBlogPost(id, data),
    onSuccess: (updatedPost) => {
      // Update specific post
      queryClient.setQueryData(
        blogQueryKeys.post(updatedPost.slug),
        updatedPost
      );
      
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.posts() });
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.stats() });
      
      toast.success('مقاله با موفقیت به‌روزرسانی شد');
    },
    onError: (error: Error) => {
      toast.error(`خطا در به‌روزرسانی مقاله: ${error.message}`);
    },
  });
}

/**
 * حذف مقاله
 */
export function useDeleteBlogPost() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (id: string) => blogService.deleteBlogPost(id),
    onSuccess: () => {
      // Invalidate all lists
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.posts() });
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.stats() });
      
      toast.success('مقاله با موفقیت حذف شد');
      router.push('/blog');
    },
    onError: (error: Error) => {
      toast.error(`خطا در حذف مقاله: ${error.message}`);
    },
  });
}

/**
 * انتشار/عدم انتشار مقاله
 */
export function usePublishBlogPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, publish }: { id: string; publish: boolean }) => 
      blogService.publishBlogPost(id, publish),
    onSuccess: (updatedPost) => {
      // Update specific post
      queryClient.setQueryData(
        blogQueryKeys.post(updatedPost.slug),
        updatedPost
      );
      
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.posts() });
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.stats() });
      
      const message = updatedPost.isPublished ? 'مقاله منتشر شد' : 'انتشار مقاله لغو شد';
      toast.success(message);
    },
    onError: (error: Error) => {
      toast.error(`خطا در تغییر وضعیت انتشار: ${error.message}`);
    },
  });
}

/**
 * افزایش تعداد بازدید
 */
export function useIncrementViewCount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slug: string) => blogService.incrementViewCount(slug),
    onSuccess: (_, slug) => {
      // Update post view count locally
      queryClient.setQueryData(
        blogQueryKeys.post(slug),
        (oldData: BlogPost | undefined) => {
          if (oldData) {
            return { ...oldData, viewCount: oldData.viewCount + 1 };
          }
          return oldData;
        }
      );
      
      // Invalidate popular posts
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.popularPosts(5) });
    },
    onError: () => {
      // Silent fail برای view count
      console.warn('Failed to increment view count');
    },
  });
}

/**
 * ایجاد نظر جدید
 */
export function useCreateBlogComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      postId: string;
      authorName: string;
      authorEmail: string;
      content: string;
      parentId?: string;
    }) => blogService.createBlogComment(data),
    onSuccess: (_, variables) => {
      // Invalidate comments for this post
      queryClient.invalidateQueries({ 
        queryKey: blogQueryKeys.postComments(variables.postId) 
      });
      
      toast.success('نظر شما ارسال شد و پس از تأیید نمایش داده می‌شود');
    },
    onError: (error: Error) => {
      toast.error(`خطا در ارسال نظر: ${error.message}`);
    },
  });
}

/**
 * تأیید/رد نظر (برای Admin)
 */
export function useApproveBlogComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, approved }: { id: string; approved: boolean }) => 
      blogService.approveBlogComment(id, approved),
    onSuccess: () => {
      // Invalidate all comments
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.comments() });
      
      toast.success('وضعیت نظر تغییر یافت');
    },
    onError: (error: Error) => {
      toast.error(`خطا در تغییر وضعیت نظر: ${error.message}`);
    },
  });
}

/**
 * حذف نظر
 */
export function useDeleteBlogComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => blogService.deleteBlogComment(id),
    onSuccess: () => {
      // Invalidate all comments
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.comments() });
      
      toast.success('نظر حذف شد');
    },
    onError: (error: Error) => {
      toast.error(`خطا در حذف نظر: ${error.message}`);
    },
  });
}

/**
 * ایجاد دسته‌بندی جدید
 */
export function useCreateBlogCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<BlogCategory>) => blogService.createBlogCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.categories() });
      toast.success('دسته‌بندی ایجاد شد');
    },
    onError: (error: Error) => {
      toast.error(`خطا در ایجاد دسته‌بندی: ${error.message}`);
    },
  });
} 