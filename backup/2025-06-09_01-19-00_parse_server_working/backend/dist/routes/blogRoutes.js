"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const blogController_1 = require("../controllers/blogController");
const router = (0, express_1.Router)();
// ==================== Public Blog Routes ====================
// Get all published blog posts
router.get('/', blogController_1.getBlogPosts);
// Get blog categories
router.get('/categories', blogController_1.getBlogCategories);
// Get single blog post by slug
router.get('/:slug', blogController_1.getBlogPost);
// ==================== Admin Blog Routes ====================
// Create new blog post (simplified for now)
router.post('/admin/posts', blogController_1.createBlogPost);
// Create blog category (simplified for now)
router.post('/admin/categories', blogController_1.createBlogCategory);
exports.default = router;
//# sourceMappingURL=blogRoutes.js.map