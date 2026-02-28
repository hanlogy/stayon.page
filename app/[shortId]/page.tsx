import { EditIcon } from 'lucide-react';
import { notFound } from 'next/navigation';
import { getShareableItem } from '@/actions/getShareableItem';
import { AccessGuard } from '@/component/AccessGuard';
import { Layout } from '@/component/Layout';
import { LazyLink } from '@/component/LazyLink';
import type { Checklist, Event, Poll } from '@/definitions';
import { normalizeShortId } from '@/helpers/shortId';
import { ChecklistView } from './checklist/ChecklistView';
import { ShareButton } from './components/ShareButton';
import { EventView } from './event/EventView';
import { PollView } from './poll/PollView';

export default async function SharingPage({
  params,
  searchParams,
}: PageProps<'/[shortId]'>) {
  const maybeShortId = (await params).shortId;
  const shortId = normalizeShortId(maybeShortId);
  const searchRecord = await searchParams;

  if (!shortId) {
    return notFound();
  }

  const { data: item, error } = await getShareableItem({ shortId });
  if (error) {
    if (error.code == 'notFound') {
      return notFound();
    }

    // TODO: More error handlers
    throw new Error('Unhandled error');
  }

  const { viewPasscodeVersion, adminPasscodeVersion, entity } = item;

  return (
    <AccessGuard
      attributes={{
        type: 'viewAccess',
        shortId,
        viewPasscodeVersion,
        adminPasscodeVersion,
      }}
    >
      <Layout
        leading="home"
        trailing={
          <div className="flex items-center space-x-4">
            <ShareButton shortId={shortId} />
            <LazyLink href={`/editor/${entity}?id=${shortId}`}>
              <EditIcon size={18} />
            </LazyLink>
          </div>
        }
      >
        <title>{item.name}</title>
        {(async () => {
          switch (item.entity) {
            case 'checklist':
              // Checlist item is safe to cast.
              return <ChecklistView item={item as Checklist} />;
            case 'event':
              // Event item is safe to cast.
              return <EventView item={item as Event} />;
            case 'poll':
              const view = searchRecord.view;
              return (
                <PollView
                  currentView={typeof view === 'string' ? view : 'questions'}
                  item={item as Poll}
                />
              );
          }

          return <div className="text-center">Ready soon</div>;
        })()}
      </Layout>
    </AccessGuard>
  );
}
