'use server';

import { redirect } from 'next/navigation';
import { DBChecklistHelper } from '@/dynamodb/DBChecklistHelper';
import { parseWithChecklistSchema } from '@/lib/schema/checklist';
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
    expiresAt: formData.expiresAfter,
    note: formData.note,
  });

  if (error) {
    throw new Error('Something is wrong');
  }

  let shortId: string;
  try {
    ({ shortId } = await helper.createItem(data));
  } catch {
    throw new Error('Something is wrong');
  }

  redirect(`/${shortId}`);
}
