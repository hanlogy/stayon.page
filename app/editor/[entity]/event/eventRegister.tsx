import { EventEditor } from './EventEditor';

export async function eventRegister({
  shortId: shortIdLike,
}: {
  shortId?: string | undefined;
}) {
  const item = undefined;

  return {
    item,
    editor: <EventEditor initialData={item} />,
  };
}
