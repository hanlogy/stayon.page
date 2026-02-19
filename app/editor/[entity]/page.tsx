import { FlexCenter } from '@hanlogy/react-web-ui';
import { kebabToCamel } from '@hanlogy/ts-lib';
import { HomeIcon } from 'lucide-react';
import { notFound } from 'next/navigation';
import { AccessGuard } from '@/component/AccessGuard';
import { Appbar } from '@/component/Appbar';
import { LazyLink } from '@/component/LazyLink';
import { shareableEntityNames } from '@/definitions/constants';
import { checklistRegister } from './checklist/checklistRegister';

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
          const defaultRegister = () => ({
            item: undefined,
            editor: <FlexCenter className="py-10">Not Ready</FlexCenter>,
          });

          const register = {
            checklist: checklistRegister,
            event: defaultRegister,
            poll: defaultRegister,
            timeSlots: defaultRegister,
          }[entityName];

          const { item, editor } = await register({
            shortId: shortIdLike,
          });

          const accessGuardAttributes = item
            ? {
                type: 'adminAccess' as const,
                shortId: item.shortId,
                viewPasscodeVersion: item.viewPasscodeVersion,
                adminPasscodeVersion: item.adminPasscodeVersion,
              }
            : undefined;

          return (
            <AccessGuard attributes={accessGuardAttributes}>
              {editor}
            </AccessGuard>
          );
        })()}
      </main>
    </>
  );
}
