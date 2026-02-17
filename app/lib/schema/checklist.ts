import { shiftDate } from '@hanlogy/ts-lib';
import { z } from 'zod';
import { expiresAfterOptions } from '@/definitions/constants';
import { safeParseFields } from './helpers';

export const nameSchema = z.string().trim().min(1, 'Name is required');

const expiresAtSchema = z
  .enum(expiresAfterOptions)
  .transform((v) => shiftDate({ days: Number(v) }).toISOString());

const noteSchema = z
  .string()
  .trim()
  .min(1)
  .optional()
  .nullable()
  .transform((v) => (v == null || v === '' ? undefined : v));

const publishChecklistSchema = z.object({
  name: nameSchema,
  expiresAt: expiresAtSchema,
  note: noteSchema,
});

export function parseWithChecklistSchema(data: Record<string, unknown>) {
  return safeParseFields(publishChecklistSchema, data);
}
