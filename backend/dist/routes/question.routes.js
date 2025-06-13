"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bulk_import_1 = require("../controllers/question/bulk-import");
const router = (0, express_1.Router)();
// Mock authentication middleware (موقت)
const mockAuth = (req, res, next) => {
    // TODO: پیاده‌سازی middleware احراز هویت واقعی
    req.user = { id: 'mock-user-id', role: 'designer' };
    next();
};
// Bulk Upload Routes - بارگزاری انبوه سوالات
router.post('/bulk-upload', mockAuth, bulk_import_1.uploadMiddleware.single('file'), bulk_import_1.bulkUploadQuestions);
router.get('/bulk-upload/status', mockAuth, bulk_import_1.getBulkUploadStatus);
router.get('/bulk-upload/template', mockAuth, bulk_import_1.downloadTemplate);
exports.default = router;
//# sourceMappingURL=question.routes.js.map