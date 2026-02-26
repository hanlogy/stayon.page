import { z } from 'zod';
import { pollResultsVisibilities } from '@/definitions/constants';

export const resultsVisibilitySchema = z.enum(pollResultsVisibilities);

export const pollSchema = z.object({
  note: z.string().trim().optional(),
  resultsVisibility: resultsVisibilitySchema,
  closesAt: z.string().trim().optional(),
});
