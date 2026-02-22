import { DialogProvider } from '@hanlogy/react-web-ui';
import { EditIcon } from 'lucide-react';
import { notFound } from 'next/navigation';
import { AccessGuard } from '@/component/AccessGuard';
import { Layout } from '@/component/Layout';
import { LazyLink } from '@/component/LazyLink';
import type { Checklist, Event } from '@/definitions/types';
import { DBShareableHelper } from '@/dynamodb/DBShareableHelper';
import { normalizeShortId } from '@/helpers/shortId';
import { ChecklistView } from './checklist/ChecklistView';
import { ShareButton } from './components/ShareButton';
import { EventView } from './event/EventView';

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
    <Layout
      leading="home"
      trailing={
        <div className="flex items-center space-x-4">
          <DialogProvider>
            <ShareButton shortId={shortId} />
          </DialogProvider>
          <LazyLink href={`/editor/${entity}?id=${shortId}`}>
            <EditIcon size={18} />
          </LazyLink>
        </div>
      }
    >
      <title>{item.name}</title>
      <AccessGuard
        attributes={{
          type: 'viewAccess',
          shortId,
          viewPasscodeVersion,
          adminPasscodeVersion,
        }}
      >
        <main className="flex-1">
          {(() => {
            switch (item.entity) {
              case 'checklist':
                // Checlist item is safe to cast.
                return <ChecklistView item={item as Checklist} />;
              case 'event':
                // Event item is safe to cast.
                return <EventView item={item as Event} />;
            }

            return <div className="text-center">Ready soon</div>;
          })()}
        </main>
      </AccessGuard>
    </Layout>
  );
}
