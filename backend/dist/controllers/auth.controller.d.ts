/**
 * Authentication controller
 *
 * This file contains controller functions for authentication routes.
 */
import { Request, Response, NextFunction } from 'express';
import { RequestWithUser } from "../types";
/**
 * @desc    Register a new user
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
declare const register: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * @desc    Login user
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
declare const login: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * @desc    Refresh access token
 * @route   POST /api/v1/auth/refresh-token
 * @access  Public
 */
declare const refreshToken: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * @desc    Get current user profile
 * @route   GET /api/v1/auth/me
 * @access  Private
 */
declare const getMe: (req: RequestWithUser, res: Response, next: NextFunction) => Promise<void>;
/**
 * @desc    Logout user
 * @route   POST /api/v1/auth/logout
 * @access  Private
 */
declare const logout: (req: Request, res: Response) => void;
export { register, login, refreshToken, getMe, logout, };
