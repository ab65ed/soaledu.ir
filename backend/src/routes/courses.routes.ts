/**
 * Courses Routes
 * مسیرهای مدیریت دروس
 */

import { Router } from 'express';
import {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getCategories,
  bulkCreateCourses
} from '../controllers/course.controller';

const router = Router();

/**
 * GET /api/v1/courses
 * دریافت لیست دروس با امکان جستجو و فیلتر
 */
router.get('/', getCourses);

/**
 * GET /api/v1/courses/categories
 * دریافت لیست دسته‌بندی‌ها
 */
router.get('/categories', getCategories);

/**
 * GET /api/v1/courses/:id
 * دریافت درس با شناسه
 */
router.get('/:id', getCourseById);

/**
 * POST /api/v1/courses
 * ایجاد درس جدید
 */
router.post('/', createCourse);

/**
 * POST /api/v1/courses/bulk-create
 * ایجاد چندین درس به صورت یکجا
 */
router.post('/bulk-create', bulkCreateCourses);

/**
 * PUT /api/v1/courses/:id
 * ویرایش درس
 */
router.put('/:id', updateCourse);

/**
 * DELETE /api/v1/courses/:id
 * حذف درس
 */
router.delete('/:id', deleteCourse);

export default router; 