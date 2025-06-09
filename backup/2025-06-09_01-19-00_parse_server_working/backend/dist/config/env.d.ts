/**
 * Environment configuration
 *
 * This file loads environment variables from .env file
 * and exports them for use throughout the application.
 */
export declare const PORT: string | number;
export declare const NODE_ENV: string;
export declare const MONGO_URI: string;
export declare const JWT_SECRET: string;
export declare const JWT_EXPIRE: string;
export declare const JWT_REFRESH_SECRET: string;
export declare const JWT_REFRESH_EXPIRE: string;
export declare const JWT_COOKIE_EXPIRE: number;
export declare const JWT_REFRESH_COOKIE_EXPIRE: number;
export declare const UPLOAD_PATH: string;
export declare const LOG_LEVEL: string;
export declare const RATE_LIMIT_WINDOW_MS: string | number;
export declare const RATE_LIMIT_MAX: string | number;
export declare const FRONTEND_URL: string;
