'use server';

import { redirect } from 'next/navigation';
import { ActionResponse, ChecklistItem } from '@/definitions/types';
import { DBChecklistHelper } from '@/dynamodb/DBChecklistHelper';
import { parseWithSchema } from '@/editor/schema/helpers';
import { SettingsFormData } from '@/editor/types';
import { toActionError } from '@/helpers/action';
import { checklistSchema } from './schema';

export type ChecklistFormData = SettingsFormData & {
  name: string;
  items: string;
  note?: string;
};

export async function publishChecklist(
  shortId: string | undefined,
  formData: Partial<ChecklistFormData>
): Promise<ActionResponse> {
  const { error, data } = parseWithSchema(checklistSchema, formData);

  let items: ChecklistItem[] = [];

  if (formData.items) {
    try {
      items = JSON.parse(formData.items);
    } catch {}
  }

  if (error || !data) {
    return toActionError({
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
    return toActionError({
      message: 'Something is wrong when saving data',
    });
  }

  redirect(`/${shortId}`);
}
