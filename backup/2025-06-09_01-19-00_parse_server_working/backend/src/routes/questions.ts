import express from 'express';
import QuestionController from '../controllers/questionController';
import { authenticateUser, optionalAuth } from '../middlewares/auth';
// import {
//   validateQuestionCreate,
//   validateQuestionUpdate,
//   validateQuestionAutoSave,
//   validateQuestionSearch
// } from '../validations/questionValidation';

const router = express.Router();

/**
 * Question Routes
 * مسیرهای API برای مدیریت سوالات
 * 
 * ویژگی‌های اصلی:
 * - CRUD کامل سوالات
 * - ذخیره لحظه‌ای
 * - جستجوی پیشرفته
 * - اعتبارسنجی کامل
 */

// Public routes (no authentication required)

/**
 * @route   GET /api/questions
 * @desc    Get published questions with filtering and pagination
 * @access  Public
 */
router.get('/', optionalAuth, QuestionController.list);

/**
 * @route   GET /api/questions/search
 * @desc    Search questions by text
 * @access  Public
 */
router.get('/search', QuestionController.search);

/**
 * @route   GET /api/questions/tags
 * @desc    Get available tags
 * @access  Public
 */
router.get('/tags', QuestionController.getTags);

/**
 * @route   GET /api/questions/categories
 * @desc    Get available categories
 * @access  Public
 */
router.get('/categories', QuestionController.getCategories);

/**
 * @route   GET /api/questions/stats
 * @desc    Get question statistics (public stats)
 * @access  Public
 */
router.get('/stats', optionalAuth, QuestionController.getStats);

/**
 * @route   GET /api/questions/:id
 * @desc    Get a single question by ID
 * @access  Public (for published questions)
 */
router.get('/:id', optionalAuth, QuestionController.getById);

// Protected routes (authentication required)

/**
 * @route   POST /api/questions
 * @desc    Create a new question
 * @access  Private
 */
router.post('/', authenticateUser, QuestionController.create);

/**
 * @route   PUT /api/questions/:id
 * @desc    Update a question
 * @access  Private (owner only)
 */
router.put('/:id', authenticateUser, QuestionController.update);

/**
 * @route   DELETE /api/questions/:id
 * @desc    Delete a question
 * @access  Private (owner only)
 */
router.delete('/:id', authenticateUser, QuestionController.delete);

/**
 * @route   PATCH /api/questions/:id/auto-save
 * @desc    Auto-save question (real-time save)
 * @access  Private (owner only)
 */
router.patch('/:id/auto-save', authenticateUser, QuestionController.autoSave);

/**
 * @route   PATCH /api/questions/:id/publish
 * @desc    Publish a question
 * @access  Private (owner only)
 */
router.patch('/:id/publish', authenticateUser, QuestionController.publish);

/**
 * @route   PATCH /api/questions/:id/unpublish
 * @desc    Unpublish a question
 * @access  Private (owner only)
 */
router.patch('/:id/unpublish', authenticateUser, QuestionController.unpublish);

/**
 * @route   POST /api/questions/validate
 * @desc    Validate question data without saving
 * @access  Private
 */
router.post('/validate', authenticateUser, QuestionController.validate);

/**
 * @route   POST /api/questions/:id/duplicate
 * @desc    Duplicate a question
 * @access  Private
 */
router.post('/:id/duplicate', authenticateUser, QuestionController.duplicate);

export default router; 