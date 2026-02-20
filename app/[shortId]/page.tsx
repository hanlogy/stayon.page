import { EditIcon } from 'lucide-react';
import { notFound } from 'next/navigation';
import { AccessGuard } from '@/component/AccessGuard';
import { LazyLink } from '@/component/LazyLink';
import { Checklist } from '@/definitions/types';
import { DBShareableHelper } from '@/dynamodb/DBShareableHelper';
import { normalizeShortId } from '@/helpers/shortId';
import { ChecklistView } from './checklist/ChecklistView';

export default async function SharingPage({ params }: PageProps<'/[shortId]'>) {
  const maybeShortId = (await params).shortId;
  const shortId = normalizeShortId(maybeShortId);

  if (!shortId) {
    return notFound();
  }

  const dbHelper = new DBShareableHelper();
  const item = await dbHelper.getItem({ shortId });
  if (!item) {
    return notFound();
  }
  const { viewPasscodeVersion, adminPasscodeVersion, entity } = item;

  return (
    <>
      <div className="fixed top-0 right-0 left-0 z-50 flex h-12 items-center px-4">
        <div className="flex-1"></div>
        <LazyLink href={`/editor/${entity}?id=${shortId}`}>
          <EditIcon size={18} />
        </LazyLink>
      </div>
      <div className="h-12"></div>
      <AccessGuard
        attributes={{
          type: 'viewAccess',
          shortId,
          viewPasscodeVersion,
          adminPasscodeVersion,
        }}
      >
        {(() => {
          switch (item.entity) {
            case 'checklist':
              // Checlist item is safe to cast.
              return <ChecklistView item={item as Checklist} />;
          }

          return <div className="text-center">Ready soon</div>;
        })()}
      </AccessGuard>
    </>
  );
}
