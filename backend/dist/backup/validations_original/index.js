"use strict";
/**
 * Validation utilities
 *
 * This file exports a validation middleware factory and common validation schemas.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.schemas = exports.validate = exports.validateRequest = void 0;
const fastest_validator_1 = __importDefault(require("fastest-validator"));
const errorHandler_1 = require("../middlewares/errorHandler");
// Create validator instance
const v = new fastest_validator_1.default();
/**
 * Create validation middleware
 * @param schema - Validation schema
 * @param source - Source of data to validate ('body', 'query', 'params')
 * @returns Express middleware function
 */
const validate = (schema, source = 'body') => {
    const check = v.compile(schema);
    return (req, res, next) => {
        const dataToValidate = source === 'body' ? req.body :
            source === 'query' ? req.query :
                req.params;
        const validationResult = check(dataToValidate);
        if (validationResult === true) {
            return next();
        }
        const errors = validationResult.map(err => `${err.field}: ${err.message}`).join(', ');
        return next(new errorHandler_1.ApiError(`Validation error: ${errors}`, 400));
    };
};
exports.validate = validate;
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
};
exports.schemas = schemas;
/**
 * Alternative name for validate function for backward compatibility
 */
exports.validateRequest = validate;
//# sourceMappingURL=index.js.map