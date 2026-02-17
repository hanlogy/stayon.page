import { shiftDate } from '@hanlogy/ts-lib';
import { z } from 'zod';
import { expiresAfterOptions } from '@/definitions/constants';

export const expiresAtSchema = z
  .enum(expiresAfterOptions)
  .transform((v) => shiftDate({ days: Number(v) }).toISOString());

export const viewPasscodeSchema = z.string().optional();

export const adminPasscodeSchema = z.string().optional();
