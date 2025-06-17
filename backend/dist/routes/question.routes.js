"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bulk_import_1 = require("../controllers/question/bulk-import");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
// Mock authentication middleware برای تست (موقت)
const mockAuth = (req, res, next) => {
    req.user = { id: 'test-user-id', role: 'designer' };
    next();
};
// Bulk Upload Routes - بارگزاری انبوه سوالات
router.post('/bulk-upload', auth_1.authenticateToken, bulk_import_1.uploadMiddleware.single('file'), bulk_import_1.bulkUploadQuestions);
router.get('/bulk-upload/status', auth_1.authenticateToken, bulk_import_1.getBulkUploadStatus);
router.get('/bulk-upload/template', auth_1.authenticateToken, bulk_import_1.downloadTemplate);
// Route موقت برای تست بدون auth
router.get('/bulk-upload/template-test', mockAuth, bulk_import_1.downloadTemplate);
exports.default = router;
//# sourceMappingURL=question.routes.js.map