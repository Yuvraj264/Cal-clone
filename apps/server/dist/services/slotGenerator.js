"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSlots = generateSlots;
const dayjs_1 = __importDefault(require("dayjs"));
const utc_1 = __importDefault(require("dayjs/plugin/utc"));
const timezone_1 = __importDefault(require("dayjs/plugin/timezone"));
const isSameOrBefore_1 = __importDefault(require("dayjs/plugin/isSameOrBefore"));
const isSameOrAfter_1 = __importDefault(require("dayjs/plugin/isSameOrAfter"));
dayjs_1.default.extend(utc_1.default);
dayjs_1.default.extend(timezone_1.default);
dayjs_1.default.extend(isSameOrBefore_1.default);
dayjs_1.default.extend(isSameOrAfter_1.default);
/**
 * Dynamically computes open, bookable time periods on a host's calendar for a visitor.
 */
function generateSlots({ targetDate, duration, bufferTime, hostTimezone, weeklySchedule, dateOverrides, existingBookings }) {
    // 1. Resolve host active working range for target date (applying overrides first)
    const override = dateOverrides.find(o => o.date === targetDate);
    let periods = [];
    if (override) {
        if (override.blocked)
            return []; // Fully blocked today
        periods.push({ start: override.startTime, end: override.endTime });
    }
    else {
        const dayOfWeek = (0, dayjs_1.default)(targetDate).day();
        const daySchedule = weeklySchedule.find(s => s.dayOfWeek === dayOfWeek && s.active);
        if (!daySchedule)
            return []; // Not working this day
        periods.push({ start: daySchedule.startTime, end: daySchedule.endTime });
    }
    const bookableSlots = [];
    // 2. Process bookable blocks
    for (const period of periods) {
        // Generate dayjs objects for host times relative to targetDate in Host's timezone
        const hostStart = dayjs_1.default.tz(`${targetDate}T${period.start}:00`, hostTimezone);
        const hostEnd = dayjs_1.default.tz(`${targetDate}T${period.end}:00`, hostTimezone);
        let currentSlotStart = hostStart;
        const intervalDelta = duration + bufferTime;
        while (currentSlotStart.add(duration, 'minute').isSameOrBefore(hostEnd)) {
            const currentSlotEnd = currentSlotStart.add(duration, 'minute');
            // Determine slot overlap with existing bookings (fully converted to UTC comparisons)
            const slotStartUTC = currentSlotStart.utc();
            const slotEndUTC = currentSlotEnd.utc();
            let hasOverlap = false;
            for (const booking of existingBookings) {
                const bookStartUTC = (0, dayjs_1.default)(booking.startTime).utc();
                const bookEndUTC = (0, dayjs_1.default)(booking.endTime).utc();
                // Calculate overlap applying event buffers
                const paddedBookingStart = bookStartUTC.subtract(bufferTime, 'minute');
                const paddedBookingEnd = bookEndUTC.add(bufferTime, 'minute');
                // Check if slot overlaps with padded booking window
                if ((slotStartUTC.isBefore(paddedBookingEnd) && slotEndUTC.isAfter(paddedBookingStart))) {
                    hasOverlap = true;
                    break;
                }
            }
            // Ensure booking target slot is in the future
            if (!hasOverlap && slotStartUTC.isAfter((0, dayjs_1.default)().utc())) {
                // Output formatted in standard UTC string to prevent client parsing discrepancies
                bookableSlots.push(slotStartUTC.toISOString());
            }
            currentSlotStart = currentSlotStart.add(intervalDelta, 'minute');
        }
    }
    return bookableSlots;
}
