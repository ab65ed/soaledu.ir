"use strict";
/**
 * A/B Test Routes
 *
 * API routes for A/B testing functionality
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ab_test_1 = require("../controllers/ab-test");
const router = express_1.default.Router();
// مسیرهای عمومی تست A/B
router.get('/', ab_test_1.getABTests);
router.post('/', ab_test_1.createABTest);
router.get('/:id', ab_test_1.getABTestById);
router.put('/:id', ab_test_1.updateABTest);
router.delete('/:id', ab_test_1.deleteABTest);
// مسیرهای مدیریت تست
router.post('/:id/start', ab_test_1.startABTest);
router.post('/:id/pause', ab_test_1.pauseABTest);
router.post('/:id/stop', ab_test_1.stopABTest);
// مسیرهای نتایج و تحلیل
router.get('/:id/results', ab_test_1.getABTestResults);
router.get('/:id/analytics', ab_test_1.getABTestAnalytics);
// مسیرهای تعامل کاربر
router.post('/:id/assign', ab_test_1.assignUserToVariant);
router.post('/:id/convert', ab_test_1.recordConversion);
exports.default = router;
//# sourceMappingURL=ab-test.js.map