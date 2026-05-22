import { Schema, Document, model } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  passwordHash: string;
  fullName: string;
  avatarUrl?: string;
  bio?: string;
  timezone: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  username: { 
    type: String, 
    required: [true, 'Username slug is required'], 
    unique: true, 
    lowercase: true, 
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [30, 'Username cannot exceed 30 characters'],
    match: [/^[a-zA-Z0-9_-]+$/, 'Username can only contain alphanumeric characters, underscores, and hyphens']
  },
  email: { 
    type: String, 
    required: [true, 'Email address is required'], 
    unique: true, 
    lowercase: true, 
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
  },
  passwordHash: { 
    type: String, 
    required: [true, 'Password hash is required'] 
  },
  fullName: { 
    type: String, 
    required: [true, 'Full name is required'],
    trim: true 
  },
  avatarUrl: { type: String, default: '' },
  bio: { type: String, default: '', maxlength: [250, 'Bio cannot exceed 250 characters'] },
  timezone: { type: String, required: true, default: 'UTC' }
}, { timestamps: true });

// Explicit index definitions
UserSchema.index({ username: 1 }, { unique: true });
UserSchema.index({ email: 1 }, { unique: true });

export const User = model<IUser>('User', UserSchema);
