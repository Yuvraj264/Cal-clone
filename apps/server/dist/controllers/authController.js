"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const authService_1 = require("../services/authService");
const User_1 = require("../models/User");
const AppError_1 = require("../utils/AppError");
class AuthController {
    static async register(req, res, next) {
        try {
            const { email, password, username, fullName } = req.body;
            if (!email || !password || !username || !fullName) {
                throw new AppError_1.AppError(400, 'BAD_REQUEST', 'Missing registration attributes: email, password, username, fullName are required.');
            }
            const { user, token } = await authService_1.AuthService.registerUser({ email, password, username, fullName });
            // Set HttpOnly secure token cookie
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });
            res.status(201).json({
                success: true,
                data: {
                    user: {
                        id: user._id,
                        email: user.email,
                        username: user.username,
                        fullName: user.fullName,
                        timezone: user.timezone
                    }
                }
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async login(req, res, next) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                throw new AppError_1.AppError(400, 'BAD_REQUEST', 'Missing login attributes: email and password are required.');
            }
            const { user, token } = await authService_1.AuthService.loginUser({ email, password });
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });
            res.status(200).json({
                success: true,
                data: {
                    user: {
                        id: user._id,
                        email: user.email,
                        username: user.username,
                        fullName: user.fullName,
                        timezone: user.timezone
                    }
                }
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async logout(req, res, next) {
        try {
            res.clearCookie('token');
            res.status(200).json({
                success: true,
                message: 'Successfully logged out and session cleared.'
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getMe(req, res, next) {
        try {
            if (!req.user) {
                throw new AppError_1.AppError(401, 'UNAUTHORIZED', 'Session context missing.');
            }
            const user = await User_1.User.findById(req.user.id).select('-passwordHash');
            if (!user) {
                throw new AppError_1.AppError(404, 'USER_NOT_FOUND', 'User profile was not found.');
            }
            res.status(200).json({
                success: true,
                data: { user }
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AuthController = AuthController;
