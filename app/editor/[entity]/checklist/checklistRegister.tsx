import { notFound } from 'next/navigation';
import { Checklist } from '@/definitions/types';
import { DBChecklistHelper } from '@/dynamodb/DBChecklistHelper';
import { ChecklistEditor } from './ChecklistEditor';

export async function checklistRegister({
  shortId: shortIdLike,
}: {
  shortId?: string | undefined;
}) {
  let item: Checklist | undefined;

  if (shortIdLike) {
    const dbHelper = new DBChecklistHelper();
    item = await dbHelper.getItem({ shortId: shortIdLike });
    if (!item) {
      return notFound();
    }
  }

  return {
    item,
    editor: <ChecklistEditor initialData={item} />,
  };
}
