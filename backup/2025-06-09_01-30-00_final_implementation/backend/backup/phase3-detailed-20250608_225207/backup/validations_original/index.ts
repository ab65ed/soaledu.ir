/**
 * Validation utilities
 * 
 * This file exports a validation middleware factory and common validation schemas.
 */

import Validator from 'fastest-validator';
import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../middlewares/errorHandler';

// Create validator instance
const v = new Validator();

// Type for validation schema
type ValidationSchema = Record<string, any>;

/**
 * Create validation middleware
 * @param schema - Validation schema
 * @param source - Source of data to validate ('body', 'query', 'params')
 * @returns Express middleware function
 */
const validate = (schema: ValidationSchema, source: 'body' | 'query' | 'params' = 'body') => {
  const check = v.compile(schema);
  
  return (req: Request, res: Response, next: NextFunction) => {
    const dataToValidate = source === 'body' ? req.body : 
                          source === 'query' ? req.query : 
                          req.params;
    
    const validationResult = check(dataToValidate);
    
    if (validationResult === true) {
      return next();
    }
    
    const errors = (validationResult as any[]).map(err => `${err.field}: ${err.message}`).join(', ');
    return next(new ApiError(`Validation error: ${errors}`, 400));
  };
};

// Common validation schemas
const schemas = {
  // Auth schemas
  register: {
    name: { type: 'string', min: 2, max: 50 },
    email: { type: 'email' },
    password: { type: 'string', min: 6 },
  },
  
  login: {
    email: { type: 'email' },
    password: { type: 'string', min: 6 },
  },
  
  // User schemas
  updateProfile: {
    name: { type: 'string', min: 2, max: 50, optional: true },
    educationalGroup: { type: 'string', optional: true },
  },
  
  // ExamConfig schemas
  createExamConfig: {
    category: { type: 'string' },
    lesson: { type: 'string', optional: true },
    hasNegativeMarking: { type: 'boolean', optional: true },
    timerOption: { type: 'enum', values: ['50s', '70s', 'none'], optional: true },
  },
  
  // Answer schemas
  submitAnswer: {
    questionId: { type: 'string' },
    selectedOption: { type: 'number', integer: true, min: 0 },
  },
  
  // Ticket schemas
  createTicket: {
    subject: { type: 'string', min: 3, max: 100 },
    message: { type: 'string', min: 10 },
    priority: { type: 'enum', values: ['low', 'medium', 'high'], optional: true },
  },
  
  addTicketResponse: {
    message: { type: 'string', min: 1 },
  },
  
  // Payment schemas
  createPayment: {
    amount: { type: 'number', positive: true },
    paymentMethod: { type: 'enum', values: ['credit-card', 'paypal', 'bank-transfer', 'other'] },
    packageName: { type: 'string', optional: true },
  },
  
  // BlogPost schemas
  createBlogPost: {
    title: { type: 'string', min: 3, max: 200 },
    content: { type: 'string', min: 10 },
    category: { type: 'string', optional: true },
    coverImage: { type: 'string', optional: true },
    tags: { type: 'array', items: 'string', optional: true },
    metaTitle: { type: 'string', max: 100, optional: true },
    metaDescription: { type: 'string', max: 200, optional: true },
    status: { type: 'enum', values: ['draft', 'published', 'archived'], optional: true },
  },
} as const;

/**
 * Alternative name for validate function for backward compatibility
 */
export const validateRequest = validate;

export {
  validate,
  schemas,
}; 