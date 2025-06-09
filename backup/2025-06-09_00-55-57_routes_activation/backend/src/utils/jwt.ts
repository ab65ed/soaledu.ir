/**
 * JWT utilities
 *
 * This file contains functions for generating and verifying JWT tokens.
 */

import jwt, { SignOptions } from "jsonwebtoken";
import {
  JWT_SECRET,
  JWT_EXPIRE,
  JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRE,
  JWT_COOKIE_EXPIRE,
  JWT_REFRESH_COOKIE_EXPIRE,
  NODE_ENV,
} from "../config/env";

// Define types
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
const generateToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRE as any,
  });
};

/**
 * Generate refresh token
 * @param {Object} payload - Token payload
 * @returns {String} Refresh token
 */
const generateRefreshToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRE as any,
  });
};

/**
 * Verify JWT token
 * @param {String} token - JWT token
 * @returns {Object} Decoded token payload
 */
const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
};

/**
 * Verify refresh token
 * @param {String} token - Refresh token
 * @returns {Object} Decoded token payload
 */
const verifyRefreshToken = (token: string): TokenPayload => {
  return jwt.verify(token, JWT_REFRESH_SECRET) as TokenPayload;
};

/**
 * Generate auth tokens (access and refresh)
 * @param {Object} user - User object
 * @returns {Object} Object containing tokens
 */
const generateAuthTokens = (user: User): AuthTokens => {
  const payload: TokenPayload = {
    id: user._id,
    role: user.role,
  };

  return {
    accessToken: generateToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
};

/**
 * Set cookie options for JWT tokens
 * @param {String} type - Type of token: 'access' or 'refresh'
 * @returns {Object} Cookie options
 */
const getCookieOptions = (type: 'access' | 'refresh'): CookieOptions => {
  const expires = new Date(
    Date.now() +
      (type === "refresh" ? JWT_REFRESH_COOKIE_EXPIRE : JWT_COOKIE_EXPIRE) *
        24 *
        60 *
        60 *
        1000
  );

  return {
    expires,
    httpOnly: true,
    secure: NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  };
};

export {
  generateToken,
  generateRefreshToken,
  verifyToken,
  verifyRefreshToken,
  generateAuthTokens,
  getCookieOptions,
}; 