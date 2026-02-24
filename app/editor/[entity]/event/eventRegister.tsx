import { notFound } from 'next/navigation';
import { Event } from '@/definitions/types';
import { DBEventHelper } from '@/dynamodb/DBEventHelper';
import { EventEditor } from './EventEditor';

export async function eventRegister({
  shortId: shortIdLike,
}: {
  shortId?: string | undefined;
}) {
  let item: Event | undefined;

  if (shortIdLike) {
    const dbHelper = new DBEventHelper();
    item = await dbHelper.getItem({ shortId: shortIdLike });
    if (!item) {
      return notFound();
    }
  }

  return {
    item,
    editor: <EventEditor initialData={item} />,
  };
}
