import { Schema, Document, model, Types } from 'mongoose';

export interface IWeeklySlot {
  dayOfWeek: number; // 0 (Sun) - 6 (Sat)
  startTime: string; // "HH:MM" in 24hr format
  endTime: string;   // "HH:MM" in 24hr format
  active: boolean;
}

export interface IDateOverride {
  date: string; // "YYYY-MM-DD"
  startTime: string;
  endTime: string;
  blocked: boolean;
}

export interface IAvailability extends Document {
  userId: Types.ObjectId;
  timezone: string;
  weeklySlots: IWeeklySlot[];
  dateOverrides: IDateOverride[];
  createdAt: Date;
  updatedAt: Date;
}

const WeeklySlotSchema = new Schema<IWeeklySlot>({
  dayOfWeek: { type: Number, required: true, min: 0, max: 6 },
  startTime: { type: String, required: true, match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/ },
  endTime: { type: String, required: true, match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/ },
  active: { type: Boolean, default: true }
}, { _id: false });

const DateOverrideSchema = new Schema<IDateOverride>({
  date: { type: String, required: true, match: /^\d{4}-\d{2}-\d{2}$/ },
  startTime: { type: String, required: true, match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/ },
  endTime: { type: String, required: true, match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/ },
  blocked: { type: Boolean, default: false }
}, { _id: false });

const AvailabilitySchema = new Schema<IAvailability>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  timezone: { type: String, required: true, default: 'UTC' },
  weeklySlots: [WeeklySlotSchema],
  dateOverrides: [DateOverrideSchema]
}, { timestamps: true });

// Explicit indexing rules
AvailabilitySchema.index({ userId: 1 }, { unique: true });

export const Availability = model<IAvailability>('Availability', AvailabilitySchema);
