import { ReactNode } from 'react';
import { EditIcon } from 'lucide-react';
import { notFound } from 'next/navigation';
import { PollAnswersResponse } from '@/actions/getPollAnswers';
import { getShareableItem } from '@/actions/getShareableItem';
import { AuthForm } from '@/component/AuthForm/AuthForm';
import { Layout } from '@/component/Layout';
import { LazyLink } from '@/component/LazyLink';
import type {
  Checklist,
  Event,
  Poll,
  ShareableEntityName,
} from '@/definitions';
import { searchParamsToStringRecord } from '@/helpers/searchParamsToStringRecord';
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
  const searchRecord = searchParamsToStringRecord(await searchParams);

  if (!shortId) {
    return notFound();
  }

  const { data: item, error } = await getShareableItem({
    shortId,
    accessType: 'viewAccess',
    search: searchRecord,
  });

  let content: ReactNode;
  let entity: ShareableEntityName | undefined;

  if (error) {
    entity = error.data?.entity;

    switch (error.code) {
      case 'notFound':
        return notFound();

      case 'unauthorized':
        content = (
          <>
            <title>Access Denied</title>
            <AuthForm type="viewAccess" shortId={shortId} />
          </>
        );
        break;

      default:
        throw new Error('Unhandled error');
    }
  } else {
    entity = item.entity;
    content = (
      <>
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
              return (
                <PollView
                  item={item as Poll & { pollAnswers?: PollAnswersResponse }}
                />
              );
          }

          return <div className="text-center">Ready soon</div>;
        })()}
      </>
    );
  }

  return (
    <Layout
      leading="home"
      trailing={
        <div className="flex items-center space-x-4">
          <ShareButton shortId={shortId} />
          {entity && (
            <LazyLink href={`/editor/${entity}?id=${shortId}`}>
              <EditIcon size={18} />
            </LazyLink>
          )}
        </div>
      }
    >
      {content}
    </Layout>
  );
}
