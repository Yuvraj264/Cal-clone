import { Schema, Document, model, Types } from 'mongoose';

export interface IBooking extends Document {
  eventTypeId: Types.ObjectId;
  hostId: Types.ObjectId;
  guestName: string;
  guestEmail: string;
  guestTimezone: string;
  guestNotes?: string;
  startTime: Date;
  endTime: Date;
  status: 'confirmed' | 'cancelled';
  cancellationReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>({
  eventTypeId: { type: Schema.Types.ObjectId, ref: 'EventType', required: true },
  hostId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
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
BookingSchema.index(
  { hostId: 1, startTime: 1, status: 1 },
  { 
    unique: true, 
    partialFilterExpression: { status: 'confirmed' } 
  }
);

export const Booking = model<IBooking>('Booking', BookingSchema);
