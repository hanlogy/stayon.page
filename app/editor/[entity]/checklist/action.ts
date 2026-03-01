'use server';

import { redirect } from 'next/navigation';
import type { ActionResponse, ChecklistItem } from '@/definitions';
import { DBChecklistHelper } from '@/dynamodb/DBChecklistHelper';
import { parseWithSchema } from '@/editor/schema/helpers';
import { SettingsFormData } from '@/editor/types';
import { toActionFailure } from '@/helpers/action';
import { checklistSchema } from './schema';

export type ChecklistFormData = SettingsFormData & {
  name: string;
  note?: string;
};

export type ChecklistActionData = Partial<ChecklistFormData> & {
  items: readonly ChecklistItem[];
};

export async function publishChecklist(
  shortId: string | undefined,
  { items, ...formData }: ChecklistActionData
): Promise<ActionResponse> {
  const { error, data } = parseWithSchema(checklistSchema, formData);

  if (error || !data) {
    return toActionFailure({
      message: 'Invalid data',
    });
  }

  try {
    const helper = new DBChecklistHelper();

    if (!shortId) {
      ({ shortId } = await helper.createItem({ ...data, items }));
    } else {
      await helper.updateItem(shortId, { ...data, items });
    }
  } catch {
    return toActionFailure({
      message: 'Something is wrong when saving data',
    });
  }

  redirect(`/${shortId}`);
}
