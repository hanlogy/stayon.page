import { z } from 'zod';
import { entityNameSchema } from '../../schema/common';

const noteSchema = z.string().trim().min(1).optional();

export const checklistSchemaFields = {
  name: entityNameSchema,
  note: noteSchema,
};
