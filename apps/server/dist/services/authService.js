"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const Availability_1 = require("../models/Availability");
const AppError_1 = require("../utils/AppError");
class AuthService {
    /**
     * Registers a new host profile and sets up default availability.
     */
    static async registerUser(payload) {
        const { email, password, username, fullName } = payload;
        // 1. Verify uniqueness of email and username
        const existingEmail = await User_1.User.findOne({ email });
        if (existingEmail) {
            throw new AppError_1.AppError(400, 'EMAIL_EXISTS', 'Email address is already registered.');
        }
        const existingUser = await User_1.User.findOne({ username });
        if (existingUser) {
            throw new AppError_1.AppError(400, 'USERNAME_TAKEN', 'Username workspace slug is already claimed.');
        }
        // 2. Hash raw password
        const salt = await bcryptjs_1.default.genSalt(10);
        const passwordHash = await bcryptjs_1.default.hash(password, salt);
        // 3. Create User record
        const user = new User_1.User({
            email,
            username,
            fullName,
            passwordHash,
            timezone: 'UTC'
        });
        await user.save();
        // 4. Initialize Default Availability rules (Monday to Friday, 9:00 to 17:00 UTC)
        const defaultWeeklySlots = Array.from({ length: 5 }, (_, i) => ({
            dayOfWeek: i + 1, // Mon (1) - Fri (5)
            startTime: '09:00',
            endTime: '17:00',
            active: true
        }));
        const availability = new Availability_1.Availability({
            userId: user._id,
            timezone: 'UTC',
            weeklySlots: defaultWeeklySlots,
            dateOverrides: []
        });
        await availability.save();
        // 5. Generate secure JWT token payload
        const token = this.generateToken(user);
        return { user, token };
    }
    /**
     * Authenticates user email/password.
     */
    static async loginUser(payload) {
        const { email, password } = payload;
        // 1. Retrieve user credentials
        const user = await User_1.User.findOne({ email });
        if (!user) {
            throw new AppError_1.AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password credentials.');
        }
        // 2. Compare passwords
        const isMatch = await bcryptjs_1.default.compare(password, user.passwordHash);
        if (!isMatch) {
            throw new AppError_1.AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password credentials.');
        }
        // 3. Generate token
        const token = this.generateToken(user);
        return { user, token };
    }
    static generateToken(user) {
        const secret = process.env.JWT_SECRET || 'fallback_secret_for_development';
        return jsonwebtoken_1.default.sign({ id: user._id, email: user.email, username: user.username }, secret, { expiresIn: '7d' });
    }
}
exports.AuthService = AuthService;
