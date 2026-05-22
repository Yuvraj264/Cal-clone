"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const health_routes_1 = __importDefault(require("./routes/health.routes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const bookingRoutes_1 = __importDefault(require("./routes/bookingRoutes"));
const slotRoutes_1 = __importDefault(require("./routes/slotRoutes"));
const error_middleware_1 = require("./middleware/error.middleware");
const app = (0, express_1.default)();
// Standard Request Stream Logging Middleware
app.use((0, morgan_1.default)('dev'));
// Security & Header Headers Protection
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
}));
// Payload Body parsers
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Central REST API endpoint router mounts
app.use('/api/health', health_routes_1.default);
// Retain and mount our phase-wise features
app.use('/api/v1/auth', authRoutes_1.default);
app.use('/api/v1/bookings', bookingRoutes_1.default);
app.use('/api/v1/slots', slotRoutes_1.default);
// Health Endpoint mapping for base fallback
app.get('/health', (req, res) => {
    res.status(200).json({ success: true, status: 'healthy', timestamp: new Date() });
});
// Centralized express error handler middleware
app.use(error_middleware_1.errorMiddleware);
exports.default = app;
