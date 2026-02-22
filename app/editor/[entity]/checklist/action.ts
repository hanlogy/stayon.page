'use server';

import { redirect } from 'next/navigation';
import { ActionResponse, ChecklistItem } from '@/definitions/types';
import { DBChecklistHelper } from '@/dynamodb/DBChecklistHelper';
import { SettingsFormData } from '@/editor/types';
import { toActionError } from '@/helpers/action';
import { parseWithChecklistSchema } from './schema';

export type ChecklistFormData = SettingsFormData & {
  name: string;
  items: string;
  note?: string;
};

export async function publishChecklist(
  shortId: string | undefined,
  formData: Partial<ChecklistFormData>
): Promise<ActionResponse> {
  const helper = new DBChecklistHelper();

  const { error, data } = parseWithChecklistSchema({
    name: formData.name,
    expiresAfter: formData.expiresAfter,
    note: formData.note,
    viewPasscode: formData.viewPasscode,
    adminPasscode: formData.adminPasscode,
    ...(shortId
      ? {
          deleteViewPasscode: formData.deleteViewPasscode,
          deleteAdminPasscode: formData.deleteAdminPasscode,
        }
      : {}),
  });

  let items: ChecklistItem[] = [];

  if (formData.items) {
    try {
      items = JSON.parse(formData.items);
    } catch {}
  }

  if (error) {
    console.log(error);
    return toActionError({
      message: 'Invalid data',
    });
  }

  try {
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
