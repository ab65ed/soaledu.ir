// Import new functions
import { publishCourseExam, getPublishingValidation } from '../controllers/course-exam';

// ... existing code ...

// Publishing routes
router.post('/:courseExamId/publish', publishCourseExam);
router.get('/:courseExamId/publishing-validation', getPublishingValidation); 