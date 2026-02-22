import { DialogProvider } from '@hanlogy/react-web-ui';
import { FlexCenter } from '@hanlogy/react-web-ui';
import { kebabToCamel } from '@hanlogy/ts-lib';
import { notFound } from 'next/navigation';
import { AccessGuard } from '@/component/AccessGuard';
import { Layout } from '@/component/Layout';
import { shareableEntityNames } from '@/definitions/constants';
import { EditorContextProvider } from '../state/provider';
import { checklistRegister } from './checklist/checklistRegister';
import { eventRegister } from './event/eventRegister';

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

  const title = `${shortIdLike ? 'Edit' : 'Create'} ${entityTitle}`;

  return (
    <Layout
      leading="home"
      title={
        <div className="w-full text-center text-xl font-medium text-gray-600">
          {title}
        </div>
      }
      withFooter={false}
    >
      <title>{title}</title>
      {(async () => {
        const defaultRegister = () => ({
          item: undefined,
          editor: (
            <FlexCenter className="py-10 text-3xl text-gray-400">
              Coming soon...
            </FlexCenter>
          ),
        });

        const register = {
          checklist: checklistRegister,
          event: eventRegister,
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
            <DialogProvider>
              <EditorContextProvider>{editor}</EditorContextProvider>
            </DialogProvider>
          </AccessGuard>
        );
      })()}
    </Layout>
  );
}
