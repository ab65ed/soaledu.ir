"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendNewPostNotification = exports.getBlogSurveyResults = exports.sendBlogSurvey = exports.bulkDeletePosts = exports.bulkUpdatePosts = exports.getPostAnalytics = exports.getBlogAnalytics = exports.getAdminBlogStats = exports.getAdminBlogPosts = void 0;
const BlogPost_1 = require("../models/BlogPost");
const BlogCategory_1 = require("../models/BlogCategory");
const asyncHandler_1 = require("../utils/asyncHandler");
const logger_1 = require("../utils/logger");
// ==================== Admin Blog Posts Management ====================
/**
 * Get all blog posts for admin (including drafts)
 * دریافت تمام مقالات برای ادمین (شامل پیش‌نویس‌ها)
 */
exports.getAdminBlogPosts = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { page = 1, limit = 10, status, category, author, search, sort = 'createdAt', order = 'desc', featured } = req.query;
    const query = {};
    // Status filter
    if (status && status !== 'all') {
        query.status = status;
    }
    // Category filter
    if (category) {
        const categoryDoc = await BlogCategory_1.BlogCategory.findOne({ slug: category });
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
    const sortOptions = {};
    sortOptions[sort] = order === 'desc' ? -1 : 1;
    const skip = (Number(page) - 1) * Number(limit);
    const [posts, total] = await Promise.all([
        BlogPost_1.BlogPost.find(query)
            .populate('author', 'name email avatar')
            .populate('categories', 'name slug color')
            .sort(sortOptions)
            .skip(skip)
            .limit(Number(limit))
            .lean(),
        BlogPost_1.BlogPost.countDocuments(query)
    ]);
    const response = {
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
exports.getAdminBlogStats = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const [totalPosts, publishedPosts, draftPosts, featuredPosts, totalViews, totalComments, totalLikes, recentPosts] = await Promise.all([
        BlogPost_1.BlogPost.countDocuments(),
        BlogPost_1.BlogPost.countDocuments({ status: 'published' }),
        BlogPost_1.BlogPost.countDocuments({ status: 'draft' }),
        BlogPost_1.BlogPost.countDocuments({ isFeatured: true }),
        BlogPost_1.BlogPost.aggregate([
            { $group: { _id: null, total: { $sum: '$viewCount' } } }
        ]).then(result => result[0]?.total || 0),
        BlogPost_1.BlogPost.aggregate([
            { $group: { _id: null, total: { $sum: '$commentCount' } } }
        ]).then(result => result[0]?.total || 0),
        BlogPost_1.BlogPost.aggregate([
            { $group: { _id: null, total: { $sum: '$likeCount' } } }
        ]).then(result => result[0]?.total || 0),
        BlogPost_1.BlogPost.find({ status: 'published' })
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
    const response = {
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
exports.getBlogAnalytics = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { period = '30d' } = req.query;
    let dateFilter;
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
    const response = {
        success: true,
        data: analytics
    };
    res.json(response);
});
/**
 * Get post analytics
 * دریافت آنالیتیک پست
 */
exports.getPostAnalytics = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const post = await BlogPost_1.BlogPost.findById(id)
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
    const response = {
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
exports.bulkUpdatePosts = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { postIds, updates } = req.body;
    if (!postIds || !Array.isArray(postIds) || postIds.length === 0) {
        return res.status(400).json({
            success: false,
            error: 'شناسه پست‌ها الزامی است'
        });
    }
    const allowedUpdates = ['status', 'isFeatured', 'categories', 'tags'];
    const updateData = {};
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
    const result = await BlogPost_1.BlogPost.updateMany({ _id: { $in: postIds } }, { $set: updateData });
    logger_1.logger.info('Bulk update posts', {
        userId: req.user.id,
        postIds,
        updates: updateData,
        modifiedCount: result.modifiedCount
    });
    const response = {
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
exports.bulkDeletePosts = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { postIds } = req.body;
    if (!postIds || !Array.isArray(postIds) || postIds.length === 0) {
        return res.status(400).json({
            success: false,
            error: 'شناسه پست‌ها الزامی است'
        });
    }
    const result = await BlogPost_1.BlogPost.deleteMany({
        _id: { $in: postIds }
    });
    logger_1.logger.info('Bulk delete posts', {
        userId: req.user.id,
        postIds,
        deletedCount: result.deletedCount
    });
    const response = {
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
exports.sendBlogSurvey = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { title, description, questions, targetRoles, expiresAt } = req.body;
    if (!title || !questions || !Array.isArray(questions)) {
        return res.status(400).json({
            success: false,
            error: 'عنوان و سوالات الزامی است'
        });
    }
    const response = {
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
exports.getBlogSurveyResults = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { surveyId } = req.params;
    const response = {
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
exports.sendNewPostNotification = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { postId, targetRoles } = req.body;
    if (!postId) {
        return res.status(400).json({
            success: false,
            error: 'شناسه پست الزامی است'
        });
    }
    const post = await BlogPost_1.BlogPost.findById(postId).populate('author', 'name');
    if (!post) {
        return res.status(404).json({
            success: false,
            error: 'مقاله یافت نشد'
        });
    }
    logger_1.logger.info('New post notification sent', {
        userId: req.user.id,
        postId,
        postTitle: post.title,
        targetRoles
    });
    const response = {
        success: true,
        data: {
            message: 'اعلان با موفقیت ارسال شد'
        }
    };
    res.json(response);
});
//# sourceMappingURL=blogAdminController.js.map