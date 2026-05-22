"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlotController = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const User_1 = require("../models/User");
const Availability_1 = require("../models/Availability");
const Booking_1 = require("../models/Booking");
const EventType_1 = require("../models/EventType");
const slotGenerator_1 = require("../services/slotGenerator");
const AppError_1 = require("../utils/AppError");
class SlotController {
    /**
     * Retrieves bookable, open slots for a specific host date, timezone, and event duration constraints.
     */
    static async getAvailableSlots(req, res, next) {
        try {
            const { username, eventSlug, date, timezone } = req.query;
            if (!username || !eventSlug || !date) {
                throw new AppError_1.AppError(400, 'BAD_REQUEST', 'Missing slot check parameters: username, eventSlug, and date are required.');
            }
            // 1. Locate Host User Context
            const host = await User_1.User.findOne({ username: username.toLowerCase() });
            if (!host) {
                throw new AppError_1.AppError(404, 'HOST_NOT_FOUND', 'Host schedule profile was not found.');
            }
            // 2. Fetch Event Settings
            const eventType = await EventType_1.EventType.findOne({ userId: host._id, slug: eventSlug.toLowerCase(), isActive: true });
            if (!eventType) {
                throw new AppError_1.AppError(404, 'EVENT_NOT_FOUND', 'The requested booking event template is not available.');
            }
            // 3. Retrieve Availability Configuration rules
            const availability = await Availability_1.Availability.findOne({ userId: host._id });
            if (!availability) {
                throw new AppError_1.AppError(404, 'AVAILABILITY_NOT_FOUND', 'Host availability schedules are not configured.');
            }
            // 4. Fetch confirmed bookings for target day (UTC range check)
            const targetStart = (0, dayjs_1.default)(date).startOf('day').toDate();
            const targetEnd = (0, dayjs_1.default)(date).endOf('day').toDate();
            const existingBookings = await Booking_1.Booking.find({
                hostId: host._id,
                status: 'confirmed',
                startTime: { $gte: targetStart, $lte: targetEnd }
            }).select('startTime endTime');
            // 5. Generate bookable slot options using our scheduling engine
            const openSlots = (0, slotGenerator_1.generateSlots)({
                targetDate: date,
                duration: eventType.duration,
                bufferTime: eventType.bufferTime,
                hostTimezone: availability.timezone || host.timezone || 'UTC',
                weeklySchedule: availability.weeklySlots,
                dateOverrides: availability.dateOverrides,
                existingBookings: existingBookings.map((b) => ({
                    startTime: b.startTime,
                    endTime: b.endTime
                }))
            });
            res.status(200).json({
                success: true,
                data: {
                    date,
                    slots: openSlots
                }
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.SlotController = SlotController;
