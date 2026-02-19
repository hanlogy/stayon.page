import { z } from 'zod';
import { expiresAfterOptions } from '@/definitions/constants';

export const expiresAfterSchema = z
  .enum(expiresAfterOptions)
  .transform((v) => Number(v));

export const viewPasscodeSchema = z.string().optional();

export const adminPasscodeSchema = z.string().optional();

export const deleteViewPasscodeSchema = z
  .string()
  .transform((v) => v === 'yes');

export const deleteAdminPasscodeSchema = z
  .string()
  .transform((v) => v === 'yes');
