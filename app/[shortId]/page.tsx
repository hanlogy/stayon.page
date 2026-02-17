import { EditIcon } from 'lucide-react';
import { notFound } from 'next/navigation';
import { LazyLink } from '@/component/LazyLink';
import { DBChecklistHelper } from '@/dynamodb/DBChecklistHelper';
import { normalizeShortId } from '@/helpers/normalizeShortId';

export default async function SharingPage({ params }: PageProps<'/[shortId]'>) {
  const maybeShortId = (await params).shortId;
  const shortId = normalizeShortId(maybeShortId);

  if (!shortId) {
    return notFound();
  }

  const dbHelper = new DBChecklistHelper();
  const item = await dbHelper.getItem({ shortId });

  return (
    <>
      <div className="fixed top-0 right-0 left-0 z-50 flex h-12 items-center px-4">
        <div className="flex-1"></div>
        <LazyLink href={`/editor/${item?.entity}?id=${item?.shortId}`}>
          <EditIcon size={18} />
        </LazyLink>
      </div>
      <div className="h-12"></div>
      <div className="p-8">
        <pre>
          <code>{JSON.stringify(item, null, 2)}</code>
        </pre>
      </div>
    </>
  );
}
