'use server';

import { redirect } from 'next/navigation';
import { ChecklistItem } from '@/definitions/types';
import { DBChecklistHelper } from '@/dynamodb/DBChecklistHelper';
import { parseWithChecklistSchema } from '@/editor/schema/checklist';
import { SettingsFormData } from '../types';

export type ChecklistFormData = SettingsFormData & {
  name: string;
  items: string;
  note?: string;
};

export async function publishChecklist(formData: Partial<ChecklistFormData>) {
  const helper = new DBChecklistHelper();

  const { error, data } = parseWithChecklistSchema({
    name: formData.name,
    expiresAfter: formData.expiresAfter,
    note: formData.note,
    viewPasscode: formData.viewPasscode,
    adminPasscode: formData.adminPasscode,
  });

  let items: ChecklistItem[] = [];

  if (formData.items) {
    try {
      items = JSON.parse(formData.items);
    } catch {}
  }

  if (error) {
    throw new Error('Something is wrong');
  }

  let shortId: string;
  try {
    ({ shortId } = await helper.createItem({ ...data, items }));
  } catch {
    throw new Error('Something is wrong');
  }

  redirect(`/${shortId}`);
}
