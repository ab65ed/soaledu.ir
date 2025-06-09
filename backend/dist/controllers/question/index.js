"use strict";
/**
 * Question Controllers Index
 * صادرات تمام کنترلرهای سوالات
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionController = exports.getPublishedQuestions = exports.linkQuestionToCourseExam = exports.getCourseExamQuestionStats = exports.publishQuestionsToTestExam = exports.autoSaveQuestion = exports.duplicateQuestion = exports.deleteQuestion = exports.updateQuestion = exports.createQuestion = exports.getQuestionById = exports.getAllQuestions = void 0;
// Export types and schemas
__exportStar(require("./types"), exports);
// Import CRUD operations
const crud = __importStar(require("./crud"));
// Export individual functions for backward compatibility
exports.getAllQuestions = crud.getAllQuestions, exports.getQuestionById = crud.getQuestionById, exports.createQuestion = crud.createQuestion, exports.updateQuestion = crud.updateQuestion, exports.deleteQuestion = crud.deleteQuestion, exports.duplicateQuestion = crud.duplicateQuestion, exports.autoSaveQuestion = crud.autoSaveQuestion, exports.publishQuestionsToTestExam = crud.publishQuestionsToTestExam, exports.getCourseExamQuestionStats = crud.getCourseExamQuestionStats, exports.linkQuestionToCourseExam = crud.linkQuestionToCourseExam, exports.getPublishedQuestions = crud.getPublishedQuestions;
// Legacy compatibility - export as QuestionController
class QuestionController {
}
exports.QuestionController = QuestionController;
QuestionController.getAllQuestions = crud.getAllQuestions;
QuestionController.getQuestionById = crud.getQuestionById;
QuestionController.createQuestion = crud.createQuestion;
QuestionController.updateQuestion = crud.updateQuestion;
QuestionController.deleteQuestion = crud.deleteQuestion;
QuestionController.duplicateQuestion = crud.duplicateQuestion;
QuestionController.autoSaveQuestion = crud.autoSaveQuestion;
QuestionController.publishQuestionsToTestExam = crud.publishQuestionsToTestExam;
QuestionController.getCourseExamQuestionStats = crud.getCourseExamQuestionStats;
QuestionController.linkQuestionToCourseExam = crud.linkQuestionToCourseExam;
QuestionController.getPublishedQuestions = crud.getPublishedQuestions;
//# sourceMappingURL=index.js.map