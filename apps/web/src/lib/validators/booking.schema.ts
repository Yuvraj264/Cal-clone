import { z } from 'zod';

export const bookingSchema = z.object({
  bookerName: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be under 100 characters'),
  bookerEmail: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  startTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/, 'Time must be in HH:mm format'),
  eventTypeSlug: z
    .string()
    .min(1, 'Event slug is required'),
});

export type BookingFormData = z.infer<typeof bookingSchema>;
