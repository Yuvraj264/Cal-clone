import { z } from 'zod';

export const availabilitySchema = z.object({
  timezone: z
    .string()
    .min(1, 'Timezone selection is required'),
  slots: z.array(
    z.object({
      weekday: z.string(),
      startTime: z
        .string()
        .regex(/^\d{2}:\d{2}$/, 'Start time must be in HH:mm format'),
      endTime: z
        .string()
        .regex(/^\d{2}:\d{2}$/, 'End time must be in HH:mm format'),
      isActive: z.boolean(),
    })
  ),
});

export type AvailabilityFormData = z.infer<typeof availabilitySchema>;
