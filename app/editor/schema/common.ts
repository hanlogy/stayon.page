import { z } from 'zod';
import { expiresAfterOptions } from '@/definitions/constants';

export const expiresAfterSchema = z
  .enum(expiresAfterOptions)
  .transform((v) => Number(v));

export const entityNameSchema = z.string().trim().min(1, 'Name is required');

const passcodeSchema = z.string().optional();

const deletePasscodeSchema = z
  .string()
  .transform((v) => (!v ? undefined : v === 'yes'))
  .optional();

export const settingsSchemaFields = {
  viewPasscode: passcodeSchema,
  adminPasscode: passcodeSchema,
  deleteViewPasscode: deletePasscodeSchema,
  deleteAdminPasscode: deletePasscodeSchema,
  expiresAfter: expiresAfterSchema,
};
