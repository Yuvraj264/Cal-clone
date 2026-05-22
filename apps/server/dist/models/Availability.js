"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Availability = void 0;
const mongoose_1 = require("mongoose");
const WeeklySlotSchema = new mongoose_1.Schema({
    dayOfWeek: { type: Number, required: true, min: 0, max: 6 },
    startTime: { type: String, required: true, match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/ },
    endTime: { type: String, required: true, match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/ },
    active: { type: Boolean, default: true }
}, { _id: false });
const DateOverrideSchema = new mongoose_1.Schema({
    date: { type: String, required: true, match: /^\d{4}-\d{2}-\d{2}$/ },
    startTime: { type: String, required: true, match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/ },
    endTime: { type: String, required: true, match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/ },
    blocked: { type: Boolean, default: false }
}, { _id: false });
const AvailabilitySchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    timezone: { type: String, required: true, default: 'UTC' },
    weeklySlots: [WeeklySlotSchema],
    dateOverrides: [DateOverrideSchema]
}, { timestamps: true });
// Explicit indexing rules
AvailabilitySchema.index({ userId: 1 }, { unique: true });
exports.Availability = (0, mongoose_1.model)('Availability', AvailabilitySchema);
