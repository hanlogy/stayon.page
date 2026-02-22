import { z } from 'zod';
import { YesOrNo } from '@/definitions/types';
import { commonFieldsSchemas } from './common';

export function safeParseFields<TShape extends z.ZodRawShape>(
  schema: z.ZodObject<TShape>,
  data: Record<string, unknown>
) {
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    return {
      error: z.flattenError(parsed.error).fieldErrors,
    };
  }
  return {
    data: parsed.data,
  };
}

export function safeParseField<S extends z.ZodType>(schema: S, data: unknown) {
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message,
    };
  }
  return {
    data: parsed.data,
  };
}

export function parseWithSchema<
  TShape extends z.ZodRawShape,
  T extends {
    name?: string;
    viewPasscode?: string;
    adminPasscode?: string;
    deleteViewPasscode?: YesOrNo;
    deleteAdminPasscode?: YesOrNo;
  },
>(schema: z.ZodObject<TShape>, data: T) {
  return safeParseFields(schema.extend(commonFieldsSchemas), data);
}
