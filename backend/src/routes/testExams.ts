import { Router } from "express";
import { protectRoute } from "../middlewares/auth";
import * as TestExamController from "../controllers/testExamController";

const router = Router();

// Remove global protection for testing - add individual protection as needed
// router.use(protectRoute);

router.get("/", TestExamController.getTestExams);
router.post("/", TestExamController.createTestExam);
router.get("/:id", TestExamController.getTestExamById);
router.post("/:id/start", TestExamController.startTestExam);
router.post("/:id/submit-answer", TestExamController.submitAnswer);
router.post("/:id/finish", TestExamController.finishTestExam);
router.get("/:id/results", TestExamController.getTestExamResults);

export default router;