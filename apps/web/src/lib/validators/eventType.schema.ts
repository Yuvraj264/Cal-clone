import { z } from 'zod';

export const eventTypeSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title must be under 100 characters'),
  slug: z
    .string()
    .min(1, 'Slug URL path is required')
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  duration: z
    .number()
    .min(1, 'Duration must be at least 1 minute')
    .max(1440, 'Duration cannot exceed 1 day'),
  timezone: z
    .string()
    .min(1, 'Timezone selection is required'),
  description: z
    .string()
    .max(500, 'Description must be under 500 characters')
    .optional(),
  isActive: z
    .boolean()
    .default(true),
});

export type EventTypeFormData = z.infer<typeof eventTypeSchema>;
