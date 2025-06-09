const express = require('express');
const router = express.Router();
const CourseExamController = require('../controllers/courseExamController');
const auth = require('../middlewares/auth');
const validation = require('../middlewares/validation');

/**
 * Course Exam Routes
 */

// Public routes (no authentication required)
router.get('/published', CourseExamController.listCourseExams);
router.get('/search', CourseExamController.searchCourseExams);
router.get('/tags', CourseExamController.getAvailableTags);
router.get('/stats', CourseExamController.getCourseExamStats);
router.get('/:id', CourseExamController.getCourseExam);

// Protected routes (authentication required)
router.use(auth.requireAuth);

// Create course exam
router.post('/', 
  validation.validateCourseExam,
  CourseExamController.createCourseExam
);

// Update course exam
router.put('/:id', 
  validation.validateCourseExamUpdate,
  CourseExamController.updateCourseExam
);

// Delete course exam
router.delete('/:id', CourseExamController.deleteCourseExam);

// Auto-save course exam (for draft functionality)
router.patch('/:id/auto-save', CourseExamController.autoSaveCourseExam);

// Publish/Unpublish course exam
router.patch('/:id/publish', CourseExamController.publishCourseExam);
router.patch('/:id/unpublish', CourseExamController.unpublishCourseExam);

// Record sale
router.post('/:id/sale', CourseExamController.recordSale);

// Add rating
router.post('/:id/rating', 
  validation.validateRating,
  CourseExamController.addRating
);

// Get user's course exams
router.get('/author/:authorId', CourseExamController.listCourseExams);

module.exports = router; 