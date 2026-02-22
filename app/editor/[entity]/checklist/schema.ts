import { z } from 'zod';

const noteSchema = z.string().trim().min(1).optional();

export const checklistSchema = z.object({
  note: noteSchema,
});
