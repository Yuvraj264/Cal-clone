"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authGuard = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const AppError_1 = require("../utils/AppError");
const authGuard = (req, res, next) => {
    try {
        // 1. Resolve token from authorization header or secure cookies
        let token = req.headers.authorization?.startsWith('Bearer ')
            ? req.headers.authorization.split(' ')[1]
            : null;
        if (!token && req.headers.cookie) {
            // Manual cookie parsing (or cookie-parser if registered)
            const cookieHeader = req.headers.cookie;
            const parsedCookies = Object.fromEntries(cookieHeader.split(';').map(c => c.trim().split('=')));
            token = parsedCookies['token'];
        }
        if (!token) {
            throw new AppError_1.AppError(401, 'UNAUTHORIZED', 'Authentication token missing. Please sign in.');
        }
        // 2. Verify token signature
        const jwtSecret = process.env.JWT_SECRET || 'fallback_secret_for_development';
        const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
        // 3. Attach session identity to request stream
        req.user = decoded;
        next();
    }
    catch (error) {
        if (error.name === 'JsonWebTokenError') {
            next(new AppError_1.AppError(401, 'INVALID_TOKEN', 'Session token is invalid. Please login again.'));
        }
        else if (error.name === 'TokenExpiredError') {
            next(new AppError_1.AppError(401, 'TOKEN_EXPIRED', 'Session token has expired. Please login again.'));
        }
        else {
            next(error);
        }
    }
};
exports.authGuard = authGuard;
