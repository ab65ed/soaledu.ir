"use strict";
/**
 * Test Exam Controllers Index
 * صادرات تمام کنترلرهای آزمون‌های تستی
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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestExamController = exports.TestExamCrudController = void 0;
// Export types and constants
__exportStar(require("./types"), exports);
// Export controllers
var crud_1 = require("./crud");
Object.defineProperty(exports, "TestExamCrudController", { enumerable: true, get: function () { return crud_1.TestExamCrudController; } });
// Legacy compatibility - export as TestExamController
const crud_2 = require("./crud");
class TestExamController {
    // Note: Session and results methods will be added after creating those modules
    static async generateQuestions(req, res) {
        // TODO: Implement after creating question management module
        res.status(501).json({
            status: 'error',
            statusCode: 501,
            message: 'این قابلیت در حال توسعه است'
        });
    }
    static async startExam(req, res) {
        // TODO: Implement after creating session module
        res.status(501).json({
            status: 'error',
            statusCode: 501,
            message: 'این قابلیت در حال توسعه است'
        });
    }
    static async submitAnswer(req, res) {
        // TODO: Implement after creating session module
        res.status(501).json({
            status: 'error',
            statusCode: 501,
            message: 'این قابلیت در حال توسعه است'
        });
    }
    static async finishExam(req, res) {
        // TODO: Implement after creating session module
        res.status(501).json({
            status: 'error',
            statusCode: 501,
            message: 'این قابلیت در حال توسعه است'
        });
    }
    static async getResults(req, res) {
        // TODO: Implement after creating results module
        res.status(501).json({
            status: 'error',
            statusCode: 501,
            message: 'این قابلیت در حال توسعه است'
        });
    }
}
exports.TestExamController = TestExamController;
// CRUD methods
TestExamController.create = crud_2.TestExamCrudController.create;
TestExamController.list = crud_2.TestExamCrudController.list;
TestExamController.getById = crud_2.TestExamCrudController.getById;
TestExamController.update = crud_2.TestExamCrudController.update;
//# sourceMappingURL=index.js.map