"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const questionController_1 = __importDefault(require("../controllers/questionController"));
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
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
router.get('/', auth_1.optionalAuth, questionController_1.default.list);
/**
 * @route   GET /api/questions/search
 * @desc    Search questions by text
 * @access  Public
 */
router.get('/search', questionController_1.default.search);
/**
 * @route   GET /api/questions/tags
 * @desc    Get available tags
 * @access  Public
 */
router.get('/tags', questionController_1.default.getTags);
/**
 * @route   GET /api/questions/categories
 * @desc    Get available categories
 * @access  Public
 */
router.get('/categories', questionController_1.default.getCategories);
/**
 * @route   GET /api/questions/stats
 * @desc    Get question statistics (public stats)
 * @access  Public
 */
router.get('/stats', auth_1.optionalAuth, questionController_1.default.getStats);
/**
 * @route   GET /api/questions/:id
 * @desc    Get a single question by ID
 * @access  Public (for published questions)
 */
router.get('/:id', auth_1.optionalAuth, questionController_1.default.getById);
// Protected routes (authentication required)
/**
 * @route   POST /api/questions
 * @desc    Create a new question
 * @access  Private
 */
router.post('/', auth_1.authenticateUser, questionController_1.default.create);
/**
 * @route   PUT /api/questions/:id
 * @desc    Update a question
 * @access  Private (owner only)
 */
router.put('/:id', auth_1.authenticateUser, questionController_1.default.update);
/**
 * @route   DELETE /api/questions/:id
 * @desc    Delete a question
 * @access  Private (owner only)
 */
router.delete('/:id', auth_1.authenticateUser, questionController_1.default.delete);
/**
 * @route   PATCH /api/questions/:id/auto-save
 * @desc    Auto-save question (real-time save)
 * @access  Private (owner only)
 */
router.patch('/:id/auto-save', auth_1.authenticateUser, questionController_1.default.autoSave);
/**
 * @route   PATCH /api/questions/:id/publish
 * @desc    Publish a question
 * @access  Private (owner only)
 */
router.patch('/:id/publish', auth_1.authenticateUser, questionController_1.default.publish);
/**
 * @route   PATCH /api/questions/:id/unpublish
 * @desc    Unpublish a question
 * @access  Private (owner only)
 */
router.patch('/:id/unpublish', auth_1.authenticateUser, questionController_1.default.unpublish);
/**
 * @route   POST /api/questions/validate
 * @desc    Validate question data without saving
 * @access  Private
 */
router.post('/validate', auth_1.authenticateUser, questionController_1.default.validate);
/**
 * @route   POST /api/questions/:id/duplicate
 * @desc    Duplicate a question
 * @access  Private
 */
router.post('/:id/duplicate', auth_1.authenticateUser, questionController_1.default.duplicate);
exports.default = router;
//# sourceMappingURL=questions.js.map