/**
 * Authentication controller
 *
 * This file contains controller functions for authentication routes.
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from "../models/user.model";
import { ApiError } from "../middlewares/errorHandler";
import { generateAuthTokens, getCookieOptions } from "../utils/jwt";
import logger from "../config/logger";
import { JWT_REFRESH_SECRET } from "../config/env";
import { RequestWithUser } from "../types";

/**
 * @desc    Register a new user
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return next(new ApiError("User already exists with that email", 400));
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
    });

    // Generate tokens
    const tokens = generateAuthTokens({
      _id: user._id.toString(),
      role: user.role,
    });

    // Set cookies
    res.cookie("accessToken", tokens.accessToken, getCookieOptions("access"));
    res.cookie(
      "refreshToken",
      tokens.refreshToken,
      getCookieOptions("refresh")
    );

    // Log registration
    logger.info(`New user registered: ${user._id}`);

    res.status(201).json({
      status: "success",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Login user
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new ApiError("Invalid credentials", 401));
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return next(new ApiError("Invalid credentials", 401));
    }

    // Generate tokens
    const tokens = generateAuthTokens({
      _id: user._id.toString(),
      role: user.role,
    });

    // Set cookies
    res.cookie("accessToken", tokens.accessToken, getCookieOptions("access"));
    res.cookie(
      "refreshToken",
      tokens.refreshToken,
      getCookieOptions("refresh")
    );

    // Log login
    logger.info(`User logged in: ${user._id}`);

    res.status(200).json({
      status: "success",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          educationalGroup: user.educationalGroup,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Refresh access token
 * @route   POST /api/v1/auth/refresh-token
 * @access  Public
 */
const refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return next(new ApiError("Refresh token is required", 400));
    }

    // Verify refresh token
    try {
      const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as any;

      // Get user
      const user = await User.findById(decoded.id);

      if (!user) {
        return next(new ApiError("User not found", 404));
      }

      // Generate new tokens
      const tokens = generateAuthTokens({
        _id: user._id.toString(),
        role: user.role,
      });

      // Set cookies
      res.cookie("accessToken", tokens.accessToken, getCookieOptions("access"));
      res.cookie(
        "refreshToken",
        tokens.refreshToken,
        getCookieOptions("refresh")
      );

      res.status(200).json({
        status: "success",
        message: "Token refreshed successfully",
      });
    } catch (error) {
      return next(new ApiError("Invalid refresh token", 401));
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current user profile
 * @route   GET /api/v1/auth/me
 * @access  Private
 */
const getMe = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.user?.id).populate("educationalGroup");

    if (!user) {
      return next(new ApiError("User not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          educationalGroup: user.educationalGroup,
          wallet: {
            balance: user.wallet.balance,
          },
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Complete user profile (select educational group)
 * @route   PUT /api/v1/auth/complete-profile
 * @access  Private
 */
const completeProfile = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { educationalGroup } = req.body;

    if (!educationalGroup) {
      return next(new ApiError("Educational group is required", 400));
    }

    // Update user
    const user = await User.findByIdAndUpdate(
      req.user?.id,
      { educationalGroup },
      { new: true, runValidators: true }
    ).populate("educationalGroup");

    if (!user) {
      return next(new ApiError("User not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          educationalGroup: user.educationalGroup,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Logout user
 * @route   POST /api/v1/auth/logout
 * @access  Private
 */
const logout = (req: Request, res: Response): void => {
  // Clear cookies
  res.cookie("accessToken", "", {
    expires: new Date(0),
    httpOnly: true,
  });

  res.cookie("refreshToken", "", {
    expires: new Date(0),
    httpOnly: true,
  });

  res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
};

export {
  register,
  login,
  refreshToken,
  getMe,
  completeProfile,
  logout,
}; 