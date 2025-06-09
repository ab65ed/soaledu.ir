"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Import new functions
const course_exam_1 = require("../controllers/course-exam");
// ... existing code ...
// Publishing routes
router.post('/:courseExamId/publish', course_exam_1.publishCourseExam);
router.get('/:courseExamId/publishing-validation', course_exam_1.getPublishingValidation);
//# sourceMappingURL=course-exam.js.map