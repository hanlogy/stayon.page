import { z } from 'zod';
import { rsvpResponses } from '@/definitions/constants';

export const rsvpNameSchema = z.string().trim().min(1, 'Name is required');

export const rsvpGuestSchema = z
  .string()
  .transform((e) => (e ? Number(e) : undefined))
  .optional();

export const rsvpSchema = z.object({
  name: rsvpNameSchema,
  response: z.enum(rsvpResponses),
  guestCount: z
    .string()
    .transform((e) => (e ? Number(e) : undefined))
    .optional(),
});
