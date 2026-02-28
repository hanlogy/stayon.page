import { ComponentType } from 'react';
import { DialogProvider } from '@hanlogy/react-web-ui';
import { FlexCenter } from '@hanlogy/react-web-ui';
import { kebabToCamel } from '@hanlogy/ts-lib';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getShareableItem } from '@/actions/getShareableItem';
import { AccessGuard, AccessGuardAttributes } from '@/component/AccessGuard';
import { shareableEntityNames } from '@/definitions/constants';
import { Checklist, Event, Poll, ShareableCommon } from '@/definitions/types';
import { ShareableEntityStripped } from '@/dynamodb/types';
import { EditorContextProvider } from '../state/provider';
import { ChecklistEditor } from './checklist/ChecklistEditor';
import { EventEditor } from './event/EventEditor';
import { PollEditor } from './poll/PollEditor';

export const metadata: Metadata = {
  title: null,
};

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

  const shortIdLike = (await searchParams).id;

  const createEditor = async <DataT extends ShareableCommon>(
    Editor: ComponentType<{
      initialData: ShareableEntityStripped<DataT> | undefined;
    }>
  ) => {
    let item: ShareableEntityStripped<DataT> | undefined = undefined;
    let accessGuardAttributes: AccessGuardAttributes | undefined;

    if (typeof shortIdLike === 'string') {
      const { data, error } = await getShareableItem<DataT>({
        shortId: shortIdLike,
      });

      if (error) {
        if (error.code === 'notFound') {
          return notFound();
        }

        throw new Error('unknown error');
      }
      item = data;

      accessGuardAttributes = {
        type: 'adminAccess' as const,
        shortId: item.shortId,
        viewPasscodeVersion: item.viewPasscodeVersion,
        adminPasscodeVersion: item.adminPasscodeVersion,
      };
    }

    return (
      <AccessGuard attributes={accessGuardAttributes}>
        <DialogProvider>
          <EditorContextProvider>
            <Editor initialData={item} />
          </EditorContextProvider>
        </DialogProvider>
      </AccessGuard>
    );
  };

  switch (entityName) {
    case 'checklist':
      return await createEditor<Checklist>(ChecklistEditor);

    case 'event':
      return await createEditor<Event>(EventEditor);

    case 'poll':
      return await createEditor<Poll>(PollEditor);

    default:
      return (
        <FlexCenter className="py-10 text-3xl text-gray-400">
          Coming soon...
        </FlexCenter>
      );
  }
}
