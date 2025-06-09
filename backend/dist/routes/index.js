"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import authRoutes from './auth.routes'; // موقتاً غیرفعال
// import rolesRoutes from './roles'; // موقتاً غیرفعال - فایل rename شده
// import walletRoutes from './wallet'; // موقتاً غیرفعال - فایل rename شده
const router = express_1.default.Router();
// Mount routes - موقتاً غیرفعال
// router.use('/auth', authRoutes);
// router.use('/roles', rolesRoutes);
// router.use('/wallet', walletRoutes);
// Health check endpoint
router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'API is running',
        timestamp: new Date().toISOString()
    });
});
exports.default = router;
//# sourceMappingURL=index.js.map