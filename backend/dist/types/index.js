"use strict";
// Shared types for Exam-Edu backend
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = void 0;
// Express handler wrapper that handles return types properly
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.asyncHandler = asyncHandler;
//# sourceMappingURL=index.js.map