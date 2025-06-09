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

// Get single blog post by slug
router.get('/:slug', getBlogPost);

// ==================== Admin Blog Routes ====================

// Create new blog post (simplified for now)
router.post('/admin/posts', createBlogPost);

// Create blog category (simplified for now)
router.post('/admin/categories', createBlogCategory);

export default router; 