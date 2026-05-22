"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Booking = void 0;
const mongoose_1 = require("mongoose");
const BookingSchema = new mongoose_1.Schema({
    eventTypeId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'EventType', required: true },
    hostId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    guestName: { type: String, required: true, trim: true },
    guestEmail: { type: String, required: true, lowercase: true, trim: true },
    guestTimezone: { type: String, required: true, default: 'UTC' },
    guestNotes: { type: String, default: '' },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    status: { type: String, enum: ['confirmed', 'cancelled'], default: 'confirmed' },
    cancellationReason: { type: String, default: '' }
}, { timestamps: true });
// Highly performant indexing for calendar scans
BookingSchema.index({ hostId: 1, startTime: 1, status: 1 });
BookingSchema.index({ guestEmail: 1 });
// PARTIAL COMPOUND UNIQUE INDEX: Hard barrier against duplicate slot assignments
BookingSchema.index({ hostId: 1, startTime: 1, status: 1 }, {
    unique: true,
    partialFilterExpression: { status: 'confirmed' }
});
exports.Booking = (0, mongoose_1.model)('Booking', BookingSchema);
