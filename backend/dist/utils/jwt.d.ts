/**
 * JWT utilities
 *
 * This file contains functions for generating and verifying JWT tokens.
 */
interface TokenPayload {
    id: string;
    role: string;
    [key: string]: any;
}
interface User {
    _id: string;
    role: string;
    [key: string]: any;
}
interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}
interface CookieOptions {
    expires: Date;
    httpOnly: boolean;
    secure: boolean;
    sameSite: 'strict' | 'lax' | 'none';
    path: string;
}
/**
 * Generate JWT token
 * @param {Object} payload - Token payload
 * @returns {String} JWT token
 */
declare const generateToken: (payload: TokenPayload) => string;
/**
 * Generate refresh token
 * @param {Object} payload - Token payload
 * @returns {String} Refresh token
 */
declare const generateRefreshToken: (payload: TokenPayload) => string;
/**
 * Verify JWT token
 * @param {String} token - JWT token
 * @returns {Object} Decoded token payload
 */
declare const verifyToken: (token: string) => TokenPayload;
/**
 * Verify refresh token
 * @param {String} token - Refresh token
 * @returns {Object} Decoded token payload
 */
declare const verifyRefreshToken: (token: string) => TokenPayload;
/**
 * Generate auth tokens (access and refresh)
 * @param {Object} user - User object
 * @returns {Object} Object containing tokens
 */
declare const generateAuthTokens: (user: User) => AuthTokens;
/**
 * Set cookie options for JWT tokens
 * @param {String} type - Type of token: 'access' or 'refresh'
 * @returns {Object} Cookie options
 */
declare const getCookieOptions: (type: "access" | "refresh") => CookieOptions;
export { generateToken, generateRefreshToken, verifyToken, verifyRefreshToken, generateAuthTokens, getCookieOptions, };
