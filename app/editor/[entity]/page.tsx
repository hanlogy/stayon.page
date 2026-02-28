import { ComponentType } from 'react';
import { DialogProvider } from '@hanlogy/react-web-ui';
import { FlexCenter } from '@hanlogy/react-web-ui';
import { kebabToCamel } from '@hanlogy/ts-lib';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AccessGuard, AccessGuardAttributes } from '@/component/AccessGuard';
import { type ShareableCommon, shareableEntityNames } from '@/definitions';
import { DBChecklistHelper } from '@/dynamodb/DBChecklistHelper';
import { DBEventHelper } from '@/dynamodb/DBEventHelper';
import { DBPollHelper } from '@/dynamodb/DBPollHelper';
import { DBShareableRepository } from '@/dynamodb/types';
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
    Helper: new () => DBShareableRepository<DataT>,
    Editor: ComponentType<{ initialData: DataT | undefined }>
  ) => {
    let item: DataT | undefined = undefined;
    let accessGuardAttributes: AccessGuardAttributes | undefined;

    if (typeof shortIdLike === 'string') {
      item = await new Helper().getItem({ shortId: shortIdLike });
      if (!item) {
        return notFound();
      }

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
      return await createEditor(DBChecklistHelper, ChecklistEditor);

    case 'event':
      return await createEditor(DBEventHelper, EventEditor);

    case 'poll':
      return await createEditor(DBPollHelper, PollEditor);

    default:
      return (
        <FlexCenter className="py-10 text-3xl text-gray-400">
          Coming soon...
        </FlexCenter>
      );
  }
}
