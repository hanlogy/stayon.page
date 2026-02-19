import { ReactNode } from 'react';
import { kebabToCamel } from '@hanlogy/ts-lib';
import { HomeIcon } from 'lucide-react';
import { notFound } from 'next/navigation';
import { AccessGuard, AccessGuardAttributes } from '@/component/AccessGuard';
import { Appbar } from '@/component/Appbar';
import { LazyLink } from '@/component/LazyLink';
import { shareableEntityNames } from '@/definitions/constants';
import { Checklist } from '@/definitions/types';
import { DBChecklistHelper } from '@/dynamodb/DBChecklistHelper';
import { ChecklistEditor } from './checklist/ChecklistEditor';

export default async function EditorPage({
  searchParams,
  params,
}: PageProps<'/editor/[entity]'>) {
  const entityNameLike = (await params).entity;
  const entityName = shareableEntityNames.find(
    (e) => e === kebabToCamel(entityNameLike)
  );

  if (!entityName) {
    return notFound();
  }

  const entityTitle = {
    checklist: 'Checklist',
    poll: 'Poll',
    event: 'Event',
    timeSlots: 'Time slots',
  }[entityName];

  const shortIdLike = await (async () => {
    const id = (await searchParams).id;
    if (typeof id === 'string') {
      return id;
    }
    return undefined;
  })();

  return (
    <>
      <Appbar>
        <LazyLink
          href="/"
          replace
          className="fixed ml-2 flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100"
        >
          <HomeIcon className="w-5" />
        </LazyLink>
        <div className="w-full text-center text-xl font-medium text-gray-600">
          {`${shortIdLike ? 'Edit' : 'Create'} ${entityTitle}`}
        </div>
      </Appbar>

      <main className="flex-1">
        {(async () => {
          let accessGuardAttributes: AccessGuardAttributes | undefined;
          let content: ReactNode | undefined;

          switch (entityName) {
            case 'checklist': {
              let item: Checklist | undefined;
              if (shortIdLike) {
                const dbHelper = new DBChecklistHelper();
                item = await dbHelper.getItem({ shortId: shortIdLike });
                if (!item) {
                  return notFound();
                }

                const { viewPasscodeVersion, adminPasscodeVersion, shortId } =
                  item;
                accessGuardAttributes = {
                  type: 'adminAccess',
                  shortId,
                  viewPasscodeVersion,
                  adminPasscodeVersion,
                };
              }

              content = <ChecklistEditor initialData={item} />;
            }
          }

          if (!content) {
            return <div>Not ready</div>;
          }

          return (
            <AccessGuard attributes={accessGuardAttributes}>
              {content}
            </AccessGuard>
          );
        })()}
      </main>
    </>
  );
}
