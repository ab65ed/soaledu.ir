"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_routes_1 = __importDefault(require("./auth.routes"));
const roles_1 = __importDefault(require("./roles"));
const wallet_1 = __importDefault(require("./wallet"));
const router = express_1.default.Router();
// Mount routes
router.use('/auth', auth_routes_1.default);
router.use('/roles', roles_1.default);
router.use('/wallet', wallet_1.default);
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