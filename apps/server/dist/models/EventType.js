"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventType = void 0;
const mongoose_1 = require("mongoose");
const EventTypeSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    duration: { type: Number, required: true, min: [5, 'Duration must be at least 5 minutes'] },
    locationType: { type: String, enum: ['google-meet', 'zoom', 'in-person', 'phone'], default: 'google-meet' },
    locationDetails: { type: String, default: '' },
    bufferTime: { type: Number, default: 0, min: 0 },
    isPrivate: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });
// Ensure slugs are unique per host user
EventTypeSchema.index({ userId: 1, slug: 1 }, { unique: true });
EventTypeSchema.index({ userId: 1, isActive: 1 });
exports.EventType = (0, mongoose_1.model)('EventType', EventTypeSchema);
