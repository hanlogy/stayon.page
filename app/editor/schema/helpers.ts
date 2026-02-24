import { z } from 'zod';
import { YesOrNo } from '@/definitions/types';
import { safeParseFields } from '@/helpers/schemaHelpers';
import { commonFieldsSchemas } from './common';

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
