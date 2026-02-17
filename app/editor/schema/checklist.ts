import { z } from 'zod';
import {
  adminPasscodeSchema,
  expiresAtSchema,
  viewPasscodeSchema,
} from './common';
import { safeParseFields } from './helpers';

export const nameSchema = z.string().trim().min(1, 'Name is required');

const noteSchema = z.string().trim().min(1).optional();

const publishChecklistSchema = z.object({
  name: nameSchema,
  expiresAt: expiresAtSchema,
  note: noteSchema,
  viewPasscode: viewPasscodeSchema,
  adminPasscode: adminPasscodeSchema,
});

export function parseWithChecklistSchema(data: Record<string, unknown>) {
  return safeParseFields(publishChecklistSchema, data);
}
