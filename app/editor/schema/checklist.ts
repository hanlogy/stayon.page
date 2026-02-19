import { z } from 'zod';
import {
  adminPasscodeSchema,
  deleteAdminPasscodeSchema,
  deleteViewPasscodeSchema,
  expiresAfterSchema,
  viewPasscodeSchema,
} from './common';
import { safeParseFields } from './helpers';

export const nameSchema = z.string().trim().min(1, 'Name is required');

const noteSchema = z.string().trim().min(1).optional();

const publishChecklistSchema = z.object({
  name: nameSchema,
  expiresAfter: expiresAfterSchema,
  note: noteSchema,
  viewPasscode: viewPasscodeSchema,
  adminPasscode: adminPasscodeSchema,
  deleteViewPasscode: deleteViewPasscodeSchema,
  deleteAdminPasscode: deleteAdminPasscodeSchema,
});

export function parseWithChecklistSchema(data: Record<string, unknown>) {
  return safeParseFields(publishChecklistSchema, data);
}
