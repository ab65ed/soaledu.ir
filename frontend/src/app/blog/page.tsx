/**
 * Blog Main Page - صفحه اصلی بلاگ
 * 
 * گرید مقالات، فیلتر دسته‌بندی، جستجو، و مقالات پربازدید
 */

'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import BlogHeader from '@/components/molecules/BlogHeader';
import BlogGrid from '@/components/molecules/BlogGrid';
import CategoryFilter from '@/components/molecules/CategoryFilter';
import BlogSearch from '@/components/molecules/BlogSearch';
import { useBlogPosts, useBlogCategories, usePopularBlogPosts, useBlogStats } from '@/hooks/useBlog';

function BlogPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'));
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'popular' | 'trending'>(
    (searchParams.get('sort') as 'newest' | 'oldest' | 'popular' | 'trending') || 'newest'
  );

  // Data fetching
  const { 
    data: postsData, 
    isLoading: postsLoading 
  } = useBlogPosts({
    search: searchQuery,
    categoryId: selectedCategory || undefined,
    sortBy,
    limit: 12,
    skip: (currentPage - 1) * 12,
    isPublished: true,
  });

  const { 
    data: categories = [], 
    isLoading: categoriesLoading 
  } = useBlogCategories();

  const { 
    data: popularPosts = [], 
    isLoading: popularLoading 
  } = usePopularBlogPosts(5);

  const { 
    data: blogStats 
  } = useBlogStats();

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (searchQuery) params.set('search', searchQuery);
    if (selectedCategory) params.set('category', selectedCategory);
    if (currentPage > 1) params.set('page', currentPage.toString());
    if (sortBy !== 'newest') params.set('sort', sortBy);

    const newUrl = `/blog${params.toString() ? `?${params.toString()}` : ''}`;
    router.replace(newUrl, { scroll: false });
  }, [searchQuery, selectedCategory, currentPage, sortBy, router]);

  // Handlers
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleCategoryChange = (categoryId?: string) => {
    setSelectedCategory(categoryId || '');
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900" dir="rtl">
      {/* Header Section */}
      <BlogHeader />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search */}
            <BlogSearch 
              onSearch={handleSearch}
              initialValue={searchQuery}
              isLoading={postsLoading}
            />
            
            {/* Category Filter */}
            <CategoryFilter 
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
              isLoading={categoriesLoading}
            />
            
            {/* Sort Options */}
            <div className="flex items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                مرتب‌سازی:
              </span>
              <div className="flex gap-2">
                {[
                  { value: 'newest', label: 'جدیدترین' },
                  { value: 'popular', label: 'محبوب‌ترین' },
                  { value: 'trending', label: 'پرطرفدار' },
                  { value: 'oldest', label: 'قدیمی‌ترین' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSortBy(option.value as 'newest' | 'oldest' | 'popular' | 'trending')}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      sortBy === option.value
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Blog Grid */}
            <BlogGrid 
              posts={postsData?.posts || []}
              isLoading={postsLoading}
            />

            {/* Pagination */}
            {postsData && postsData.pagination.total > 12 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  قبلی
                </button>
                
                <span className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                  صفحه {currentPage} از {Math.ceil(postsData.pagination.total / 12)}
                </span>
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= Math.ceil(postsData.pagination.total / 12)}
                  className="px-4 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  بعدی
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Popular Posts */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                محبوب‌ترین مقالات
              </h3>
              <div className="space-y-4">
                {popularLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex gap-3 animate-pulse">
                      <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    {popularPosts.length} مقاله محبوب
                  </p>
                )}
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                عضویت در خبرنامه
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                آخرین مقالات و اخبار آموزشی را دریافت کنید
              </p>
              <form className="space-y-3">
                <input
                  type="email"
                  placeholder="ایمیل شما"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  dir="ltr"
                />
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                >
                  عضویت
                </button>
              </form>
            </div>

            {/* Blog Stats */}
            {blogStats && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  آمار بلاگ
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">مقالات:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {blogStats.totalPosts?.toLocaleString('fa-IR') || '0'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">بازدید کل:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {blogStats.totalViews?.toLocaleString('fa-IR') || '0'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BlogPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">در حال بارگذاری...</p>
        </div>
      </div>
    }>
      <BlogPageContent />
    </Suspense>
  );
} 