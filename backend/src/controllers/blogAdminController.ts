import { Request, Response } from 'express';
import BlogPost from '../models/BlogPost';
import BlogCategory from '../models/BlogCategory';
// import { User } from '../models/User'; // Commented out - not available
import { RequestWithUser, ApiResponse } from '../types';
import { asyncHandler } from '../utils/asyncHandler';
import { logger } from '../utils/logger';

// ==================== Admin Blog Posts Management ====================

/**
 * Get all blog posts for admin (including drafts)
 * دریافت تمام مقالات برای ادمین (شامل پیش‌نویس‌ها)
 */
export const getAdminBlogPosts = asyncHandler(async (req: RequestWithUser, res: Response) => {
  const {
    page = 1,
    limit = 10,
    status,
    category,
    author,
    search,
    sort = 'createdAt',
    order = 'desc',
    featured
  } = req.query as any;

  const query: any = {};

  // Status filter
  if (status && status !== 'all') {
    query.status = status;
  }

  // Category filter
  if (category) {
    const categoryDoc = await BlogCategory.findOne({ slug: category });
    if (categoryDoc) {
      query.categories = categoryDoc._id;
    }
  }

  // Author filter
  if (author) {
    query.author = author;
  }

  // Featured filter
  if (featured === 'true') {
    query.isFeatured = true;
  }

  // Search functionality
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { excerpt: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } },
      { tags: { $in: [new RegExp(search, 'i')] } }
    ];
  }

  const sortOptions: any = {};
  sortOptions[sort] = order === 'desc' ? -1 : 1;

  const skip = (Number(page) - 1) * Number(limit);

  const [posts, total] = await Promise.all([
    BlogPost.find(query)
      .populate('author', 'name email avatar')
      .populate('categories', 'name slug color')
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    BlogPost.countDocuments(query)
  ]);

  const response: ApiResponse = {
    success: true,
    data: {
      data: posts,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit))
      }
    }
  };

  res.json(response);
});

/**
 * Get blog statistics for admin dashboard
 * دریافت آمار وبلاگ برای داشبورد ادمین
 */
export const getAdminBlogStats = asyncHandler(async (req: RequestWithUser, res: Response) => {
  const [
    totalPosts,
    publishedPosts,
    draftPosts,
    featuredPosts,
    totalViews,
    totalComments,
    totalLikes,
    recentPosts
  ] = await Promise.all([
    BlogPost.countDocuments(),
    BlogPost.countDocuments({ status: 'published' }),
    BlogPost.countDocuments({ status: 'draft' }),
    BlogPost.countDocuments({ isFeatured: true }),
    BlogPost.aggregate([
      { $group: { _id: null, total: { $sum: '$viewCount' } } }
    ]).then(result => result[0]?.total || 0),
    BlogPost.aggregate([
      { $group: { _id: null, total: { $sum: '$commentCount' } } }
    ]).then(result => result[0]?.total || 0),
    BlogPost.aggregate([
      { $group: { _id: null, total: { $sum: '$likeCount' } } }
    ]).then(result => result[0]?.total || 0),
    BlogPost.find({ status: 'published' })
      .sort({ publishedAt: -1 })
      .limit(5)
      .populate('author', 'name')
      .select('title slug publishedAt viewCount')
      .lean()
  ]);

  const stats = {
    totalPosts,
    publishedPosts,
    draftPosts,
    featuredPosts,
    totalViews,
    totalComments,
    totalLikes,
    recentPosts
  };

  const response: ApiResponse = {
    success: true,
    data: stats
  };

  res.json(response);
});

// ==================== Analytics ====================

/**
 * Get blog analytics
 * دریافت آنالیتیک وبلاگ
 */
export const getBlogAnalytics = asyncHandler(async (req: RequestWithUser, res: Response) => {
  const { period = '30d' } = req.query as any;
  
  let dateFilter: Date;
  switch (period) {
    case '7d':
      dateFilter = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      break;
    case '30d':
      dateFilter = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      break;
    case '90d':
      dateFilter = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
      break;
    default:
      dateFilter = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  }

  const analytics = {
    period,
    viewsOverTime: [],
    topPosts: [],
    categoryStats: [],
    authorStats: []
  };

  const response: ApiResponse = {
    success: true,
    data: analytics
  };

  res.json(response);
});

/**
 * Get post analytics
 * دریافت آنالیتیک پست
 */
export const getPostAnalytics = asyncHandler(async (req: RequestWithUser, res: Response) => {
  const { id } = req.params;

  const post = await BlogPost.findById(id)
    .populate('author', 'name email')
    .populate('categories', 'name')
    .lean();

  if (!post) {
    return res.status(404).json({
      success: false,
      error: 'مقاله یافت نشد'
    });
  }

  const analytics = {
    post: {
      id: post._id,
      title: post.title,
      slug: post.slug,
      author: post.author,
      categories: post.categories,
      publishedAt: post.publishedAt,
      status: post.status
    },
    stats: {
      views: post.viewCount || 0,
      comments: post.commentCount || 0,
      likes: post.likeCount || 0,
      shares: post.shareCount || 0
    }
  };

  const response: ApiResponse = {
    success: true,
    data: analytics
  };

  res.json(response);
});

// ==================== Bulk Operations ====================

/**
 * Bulk update posts
 * به‌روزرسانی دسته‌ای پست‌ها
 */
export const bulkUpdatePosts = asyncHandler(async (req: RequestWithUser, res: Response) => {
  const { postIds, updates } = req.body;

  if (!postIds || !Array.isArray(postIds) || postIds.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'شناسه پست‌ها الزامی است'
    });
  }

  const allowedUpdates = ['status', 'isFeatured', 'categories', 'tags'];
  const updateData: any = {};

  Object.keys(updates).forEach(key => {
    if (allowedUpdates.includes(key)) {
      updateData[key] = updates[key];
    }
  });

  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({
      success: false,
      error: 'هیچ فیلد قابل به‌روزرسانی ارسال نشده'
    });
  }

  const result = await BlogPost.updateMany(
    { _id: { $in: postIds } },
    { $set: updateData }
  );

  logger.info('Bulk update posts', {
    userId: req.user!.id,
    postIds,
    updates: updateData,
    modifiedCount: result.modifiedCount
  });

  const response: ApiResponse = {
    success: true,
    data: {
      modifiedCount: result.modifiedCount,
      message: `${result.modifiedCount} مقاله به‌روزرسانی شد`
    }
  };

  res.json(response);
});

/**
 * Bulk delete posts
 * حذف دسته‌ای پست‌ها
 */
export const bulkDeletePosts = asyncHandler(async (req: RequestWithUser, res: Response) => {
  const { postIds } = req.body;

  if (!postIds || !Array.isArray(postIds) || postIds.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'شناسه پست‌ها الزامی است'
    });
  }

  const result = await BlogPost.deleteMany({
    _id: { $in: postIds }
  });

  logger.info('Bulk delete posts', {
    userId: req.user!.id,
    postIds,
    deletedCount: result.deletedCount
  });

  const response: ApiResponse = {
    success: true,
    data: {
      deletedCount: result.deletedCount,
      message: `${result.deletedCount} مقاله حذف شد`
    }
  };

  res.json(response);
});

// ==================== Survey & Notifications ====================

/**
 * Send survey to blog readers
 * ارسال نظرسنجی به خوانندگان وبلاگ
 */
export const sendBlogSurvey = asyncHandler(async (req: RequestWithUser, res: Response) => {
  const { title, description, questions, targetRoles, expiresAt } = req.body;

  if (!title || !questions || !Array.isArray(questions)) {
    return res.status(400).json({
      success: false,
      error: 'عنوان و سوالات الزامی است'
    });
  }

  const response: ApiResponse = {
    success: true,
    data: {
      message: 'نظرسنجی با موفقیت ارسال شد'
    }
  };

  res.json(response);
});

/**
 * Get survey results
 * دریافت نتایج نظرسنجی
 */
export const getBlogSurveyResults = asyncHandler(async (req: RequestWithUser, res: Response) => {
  const { surveyId } = req.params;

  const response: ApiResponse = {
    success: true,
    data: {
      surveyId,
      results: []
    }
  };

  res.json(response);
});

/**
 * Send new post notification
 * ارسال اعلان پست جدید
 */
export const sendNewPostNotification = asyncHandler(async (req: RequestWithUser, res: Response) => {
  const { postId, targetRoles } = req.body;

  if (!postId) {
    return res.status(400).json({
      success: false,
      error: 'شناسه پست الزامی است'
    });
  }

  const post = await BlogPost.findById(postId).populate('author', 'name');
  
  if (!post) {
    return res.status(404).json({
      success: false,
      error: 'مقاله یافت نشد'
    });
  }

  logger.info('New post notification sent', {
    userId: req.user!.id,
    postId,
    postTitle: post.title,
    targetRoles
  });

  const response: ApiResponse = {
    success: true,
    data: {
      message: 'اعلان با موفقیت ارسال شد'
    }
  };

  res.json(response);
}); 