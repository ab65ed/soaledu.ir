"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentRateLimit = exports.setBlogCacheHeaders = exports.canModerateComments = exports.validateCommentData = exports.validateBlogPostData = void 0;
// Validate blog post data
const validateBlogPostData = (req, res, next) => {
    const { title, content } = req.body;
    if (!title || title.trim().length === 0) {
        return res.status(400).json({
            success: false,
            error: 'عنوان مقاله الزامی است'
        });
    }
    if (!content || content.trim().length === 0) {
        return res.status(400).json({
            success: false,
            error: 'محتوای مقاله الزامی است'
        });
    }
    if (title.length > 200) {
        return res.status(400).json({
            success: false,
            error: 'عنوان مقاله نمی‌تواند بیش از ۲۰۰ کاراکتر باشد'
        });
    }
    next();
};
exports.validateBlogPostData = validateBlogPostData;
// Validate comment data
const validateCommentData = (req, res, next) => {
    const { content } = req.body;
    if (!content || content.trim().length === 0) {
        return res.status(400).json({
            success: false,
            error: 'محتوای نظر الزامی است'
        });
    }
    if (content.length > 1000) {
        return res.status(400).json({
            success: false,
            error: 'نظر نمی‌تواند بیش از ۱۰۰۰ کاراکتر باشد'
        });
    }
    next();
};
exports.validateCommentData = validateCommentData;
// Check if user can moderate comments
const canModerateComments = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            error: 'احراز هویت مورد نیاز است'
        });
    }
    if (req.user.role !== 'admin' && req.user.role !== 'support') {
        return res.status(403).json({
            success: false,
            error: 'شما مجوز مدیریت نظرات را ندارید'
        });
    }
    next();
};
exports.canModerateComments = canModerateComments;
// Cache control for blog posts
const setBlogCacheHeaders = (req, res, next) => {
    // Cache published posts for 5 minutes
    if (req.method === 'GET') {
        res.set('Cache-Control', 'public, max-age=300');
    }
    next();
};
exports.setBlogCacheHeaders = setBlogCacheHeaders;
// Rate limiting for comments
const commentRateLimit = (req, res, next) => {
    // This is a simple implementation - in production, use redis or similar
    const userId = req.user?.id;
    if (!userId) {
        return next();
    }
    // Allow 5 comments per minute per user
    const key = `comment_rate_${userId}`;
    // Implementation would depend on your caching solution
    next();
};
exports.commentRateLimit = commentRateLimit;
//# sourceMappingURL=blogMiddleware.js.map