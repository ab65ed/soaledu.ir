"use strict";
/**
 * Environment configuration
 *
 * This file loads environment variables from .env file
 * and exports them for use throughout the application.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PARSE_SERVER_URL = exports.PARSE_MASTER_KEY = exports.PARSE_JAVASCRIPT_KEY = exports.PARSE_APPLICATION_ID = exports.FRONTEND_URL = exports.RATE_LIMIT_MAX = exports.RATE_LIMIT_WINDOW_MS = exports.LOG_LEVEL = exports.UPLOAD_PATH = exports.JWT_REFRESH_COOKIE_EXPIRE = exports.JWT_COOKIE_EXPIRE = exports.JWT_REFRESH_EXPIRE = exports.JWT_REFRESH_SECRET = exports.JWT_EXPIRE = exports.JWT_SECRET = exports.MONGO_URI = exports.NODE_ENV = exports.PORT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.PORT = process.env.PORT || 5000;
exports.NODE_ENV = process.env.NODE_ENV || 'development';
// MongoDB configuration
exports.MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/exam-edu';
// JWT configuration
exports.JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
exports.JWT_EXPIRE = process.env.JWT_EXPIRE || '1d'; // Default 1 day for access token
exports.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your_jwt_refresh_secret_key';
exports.JWT_REFRESH_EXPIRE = process.env.JWT_REFRESH_EXPIRE || '7d';
// Cookie configuration
exports.JWT_COOKIE_EXPIRE = parseInt(process.env.JWT_COOKIE_EXPIRE || '1'); // 1 day
exports.JWT_REFRESH_COOKIE_EXPIRE = parseInt(process.env.JWT_REFRESH_COOKIE_EXPIRE || '7'); // 7 days
// Upload configuration
exports.UPLOAD_PATH = process.env.UPLOAD_PATH || 'uploads';
// Logging configuration
exports.LOG_LEVEL = process.env.LOG_LEVEL || 'info';
// Rate limiting
exports.RATE_LIMIT_WINDOW_MS = process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000; // 15 minutes
exports.RATE_LIMIT_MAX = process.env.RATE_LIMIT_MAX || 100; // 100 requests per window
// CORS (for HTTP-only cookies)
exports.FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
// Parse Server configuration
exports.PARSE_APPLICATION_ID = process.env.PARSE_APPLICATION_ID || 'soaledu_app_id';
exports.PARSE_JAVASCRIPT_KEY = process.env.PARSE_JAVASCRIPT_KEY || 'soaledu_js_key';
exports.PARSE_MASTER_KEY = process.env.PARSE_MASTER_KEY || 'soaledu_master_key';
exports.PARSE_SERVER_URL = process.env.PARSE_SERVER_URL || 'http://localhost:1337/parse';
//# sourceMappingURL=env.js.map