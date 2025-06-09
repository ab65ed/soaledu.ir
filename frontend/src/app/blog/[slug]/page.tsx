/**
 * Single Blog Post Page - صفحه تک مقاله بلاگ
 * 
 * نمایش کامل مقاله، کامنت‌ها، مقالات مرتبط، و SEO
 */

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CommentSection } from '@/components/molecules/CommentSection';
import { blogService } from '@/services/api';
import Image from 'next/image';
import Link from 'next/link';
import { CalendarIcon, ClockIcon, EyeIcon, UserIcon } from '@heroicons/react/24/outline';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate Metadata
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const post = await blogService.getBlogPostBySlug(slug);
    
    if (!post || !post.isPublished) {
      return {
        title: 'مقاله یافت نشد - آزمون‌آمو',
        description: 'مقاله مورد نظر یافت نشد یا منتشر نشده است.',
      };
    }

    return {
      title: post.seoTitle || `${post.title} - بلاگ آزمون‌آمو`,
      description: post.seoDescription || post.excerpt,
      keywords: post.seoKeywords || post.tags,
      authors: [{ name: post.authorName }],
      openGraph: {
        title: post.title,
        description: post.excerpt,
        type: 'article',
        locale: 'fa_IR',
        publishedTime: post.publishedAt || post.createdAt,
        modifiedTime: post.updatedAt,
        authors: [post.authorName],
        tags: post.tags,
        images: post.featuredImage ? [
          {
            url: post.featuredImage,
            width: 1200,
            height: 630,
            alt: post.title,
          }
        ] : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.excerpt,
        images: post.featuredImage ? [post.featuredImage] : undefined,
      },
      alternates: {
        canonical: `/blog/${post.slug}`,
      },
    };
  } catch {
    return {
      title: 'خطا در بارگذاری مقاله - آزمون‌آمو',
      description: 'خطایی در بارگذاری مقاله رخ داده است.',
    };
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  let post;
  
  try {
    post = await blogService.getBlogPostBySlug(slug);
  } catch {
    notFound();
  }

  if (!post || !post.isPublished) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 space-x-reverse text-sm text-gray-600 dark:text-gray-400 mb-6">
          <Link href="/" className="hover:text-blue-600">خانه</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-blue-600">بلاگ</Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-white">{post.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Blog Post Header */}
            <article className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* Featured Image */}
              {post.featuredImage && (
                <div className="relative h-64 md:h-96">
                  <Image
                    src={post.featuredImage}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <div className="p-6 md:p-8">
                {/* Category */}
                <div className="mb-4">
                  <Link
                    href={`/blog?category=${post.categoryId}`}
                    className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                  >
                    {post.categoryName}
                  </Link>
                </div>

                {/* Title */}
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                  {post.title}
                </h1>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
                  <div className="flex items-center gap-1">
                    <UserIcon className="w-4 h-4" />
                    <span>{post.authorName}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <CalendarIcon className="w-4 h-4" />
                    <span>
                      {post.publishedAt 
                        ? new Date(post.publishedAt).toLocaleDateString('fa-IR')
                        : new Date(post.createdAt).toLocaleDateString('fa-IR')
                      }
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <ClockIcon className="w-4 h-4" />
                    <span>{post.readTime} دقیقه مطالعه</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <EyeIcon className="w-4 h-4" />
                    <span>{post.viewCount.toLocaleString('fa-IR')} بازدید</span>
                  </div>
                </div>

                {/* Excerpt */}
                <div className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                  {post.excerpt}
                </div>

                {/* Content */}
                <div 
                  className="prose prose-lg max-w-none text-gray-900 dark:text-white prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-right prose-headings:text-right"
                  dir="rtl"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">برچسب‌ها:</h3>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </article>

            {/* Comment Section */}
            <div className="mt-12">
              <CommentSection 
                postId={post.id}
                comments={[]}
                isLoading={false}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Author Info */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">نویسنده</h3>
              <div className="flex items-center space-x-3 space-x-reverse">
                {post.authorAvatar ? (
                  <Image
                    src={post.authorAvatar}
                    alt={post.authorName}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 dark:text-blue-400 font-bold text-lg">
                      {post.authorName.charAt(0)}
                    </span>
                  </div>
                )}
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">{post.authorName}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">نویسنده</p>
                </div>
              </div>
            </div>

            {/* Post Meta */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">اطلاعات مقاله</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">دسته‌بندی:</span>
                  <span className="font-medium text-blue-600 dark:text-blue-400">{post.categoryName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">زمان مطالعه:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{post.readTime} دقیقه</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">بازدید:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{post.viewCount.toLocaleString('fa-IR')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">تاریخ انتشار:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {new Date(post.publishedAt || post.createdAt).toLocaleDateString('fa-IR')}
                  </span>
                </div>
              </div>
            </div>

            {/* Share */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">اشتراک‌گذاری</h3>
              <div className="space-y-2">
                <button className="w-full text-left px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                  کپی لینک
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors">
                  واتساپ
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-blue-500 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                  تلگرام
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": post.title,
            "description": post.excerpt,
            "image": post.featuredImage,
            "author": {
              "@type": "Person",
              "name": post.authorName
            },
            "publisher": {
              "@type": "Organization",
              "name": "آزمون‌آمو",
              "url": "https://soaledu.ir"
            },
            "datePublished": post.publishedAt || post.createdAt,
            "dateModified": post.updatedAt,
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `https://soaledu.ir/blog/${post.slug}`
            },
            "keywords": post.tags,
            "inLanguage": "fa",
            "url": `https://soaledu.ir/blog/${post.slug}`
          }),
        }}
      />
    </div>
  );
} 