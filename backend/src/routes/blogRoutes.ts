import { Router } from 'express';
import {
  getBlogPosts,
  getBlogPost,
  createBlogPost,
  getBlogCategories,
  createBlogCategory
} from '../controllers/blogController';

const router = Router();

// ==================== Public Blog Routes ====================

// Get all published blog posts
router.get('/', getBlogPosts);

// Get blog categories
router.get('/categories', getBlogCategories);

// ==================== Admin Blog Routes ====================

// Create new blog post (simplified for now)
router.post('/admin/posts', createBlogPost);

// Create blog category (simplified for now)
router.post('/admin/categories', createBlogCategory);

// Get single blog post by slug (must be last)
router.get('/:slug', getBlogPost);

export default router; 