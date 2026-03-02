import { z } from 'zod';
import { eventTypes } from '@/definitions';

export const startTimeSchema = z
  .string()
  .trim()
  .min(1, 'Start date and time is required');

export const timeSchema = z.string().trim();

export const timeFieldsSchema = z
  .object({
    startTime: timeSchema,
    endTime: timeSchema.optional(),
  })
  .superRefine(({ startTime, endTime }, ctx) => {
    if (endTime && endTime < startTime) {
      ctx.issues.push({
        code: 'custom',
        input: endTime,
        path: ['endTime'],
        message: 'End time must be after start time',
      });
    }
  });

export const eventSchema = timeFieldsSchema.extend({
  type: z.preprocess(
    (v) => (v && eventTypes.some((e) => e === v) ? v : undefined),
    z.enum(eventTypes).optional()
  ),
  location: z.string().optional(),
  description: z.string().optional(),
  rsvpDeadline: timeSchema.optional(),
  isRsvpRequired: z.preprocess((v) => !!v, z.boolean()),
});
