import { Request, Response, NextFunction } from 'express';
import { RequestWithUser } from '../types';

// Validate blog post data
export const validateBlogPostData = (req: Request, res: Response, next: NextFunction) => {
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

// Validate comment data
export const validateCommentData = (req: Request, res: Response, next: NextFunction) => {
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

// Check if user can moderate comments
export const canModerateComments = (req: RequestWithUser, res: Response, next: NextFunction) => {
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

// Cache control for blog posts
export const setBlogCacheHeaders = (req: Request, res: Response, next: NextFunction) => {
  // Cache published posts for 5 minutes
  if (req.method === 'GET') {
    res.set('Cache-Control', 'public, max-age=300');
  }
  next();
};

// Rate limiting for comments
export const commentRateLimit = (req: RequestWithUser, res: Response, next: NextFunction) => {
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