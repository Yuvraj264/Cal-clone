import { Schema, Document, model, Types } from 'mongoose';

export interface IEventType extends Document {
  userId: Types.ObjectId;
  title: string;
  slug: string;
  description?: string;
  duration: number; // in minutes
  locationType: 'google-meet' | 'zoom' | 'in-person' | 'phone';
  locationDetails?: string;
  bufferTime: number; // buffer after in minutes
  isPrivate: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const EventTypeSchema = new Schema<IEventType>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
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

export const EventType = model<IEventType>('EventType', EventTypeSchema);
