/**
 * Environment configuration
 *
 * This file loads environment variables from .env file
 * and exports them for use throughout the application.
 */

import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT || 5000;
export const NODE_ENV = process.env.NODE_ENV || 'development';

// MongoDB configuration
export const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/exam-edu';

// JWT configuration
export const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
export const JWT_EXPIRE = process.env.JWT_EXPIRE || '1d'; // Default 1 day for access token
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your_jwt_refresh_secret_key';
export const JWT_REFRESH_EXPIRE = process.env.JWT_REFRESH_EXPIRE || '7d';

// Cookie configuration
export const JWT_COOKIE_EXPIRE = parseInt(process.env.JWT_COOKIE_EXPIRE || '1'); // 1 day
export const JWT_REFRESH_COOKIE_EXPIRE = parseInt(process.env.JWT_REFRESH_COOKIE_EXPIRE || '7'); // 7 days

// Upload configuration
export const UPLOAD_PATH = process.env.UPLOAD_PATH || 'uploads';

// Logging configuration
export const LOG_LEVEL = process.env.LOG_LEVEL || 'info';

// Rate limiting
export const RATE_LIMIT_WINDOW_MS = process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000; // 15 minutes
export const RATE_LIMIT_MAX = process.env.RATE_LIMIT_MAX || 100; // 100 requests per window

// CORS (for HTTP-only cookies)
export const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000'; 