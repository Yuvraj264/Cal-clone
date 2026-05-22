"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
// Centralized operational and syntax error interceptor
const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const errorCode = err.code || 'INTERNAL_SERVER_ERROR';
    if (statusCode === 500) {
        console.error('[CRITICAL SERVER EXCEPTION]:', err);
    }
    res.status(statusCode).json({
        success: false,
        error: {
            code: errorCode,
            message: err.message || 'Something went wrong on our end.'
        }
    });
};
exports.errorHandler = errorHandler;
