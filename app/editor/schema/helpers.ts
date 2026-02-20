import { FormFieldValue } from '@hanlogy/react-web-ui';
import { z } from 'zod';

export function safeParseFields<S extends z.ZodTypeAny>(
  schema: S,
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

export function safeParseField<S extends z.ZodTypeAny>(
  schema: S,
  data: FormFieldValue | undefined
) {
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
