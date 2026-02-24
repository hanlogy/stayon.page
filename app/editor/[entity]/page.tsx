import { ComponentType } from 'react';
import { DialogProvider } from '@hanlogy/react-web-ui';
import { FlexCenter } from '@hanlogy/react-web-ui';
import { kebabToCamel } from '@hanlogy/ts-lib';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AccessGuard, AccessGuardAttributes } from '@/component/AccessGuard';
import { shareableEntityNames } from '@/definitions/constants';
import { ShareableCommon } from '@/definitions/types';
import { DBChecklistHelper } from '@/dynamodb/DBChecklistHelper';
import { DBEventHelper } from '@/dynamodb/DBEventHelper';
import { DBShareableRepository } from '@/dynamodb/types';
import { EditorContextProvider } from '../state/provider';
import { ChecklistEditor } from './checklist/ChecklistEditor';
import { EventEditor } from './event/EventEditor';

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

  switch (entityName) {
    case 'checklist':
      return await createEditor(
        shortIdLike,
        DBChecklistHelper,
        ChecklistEditor
      );

    case 'event':
      return await createEditor(shortIdLike, DBEventHelper, EventEditor);

    default:
      return (
        <FlexCenter className="py-10 text-3xl text-gray-400">
          Coming soon...
        </FlexCenter>
      );
  }
}

async function createEditor<DataT extends ShareableCommon>(
  shortId: unknown,
  Helper: new () => DBShareableRepository<DataT>,
  Editor: ComponentType<{ initialData: DataT | undefined }>
) {
  let item: DataT | undefined = undefined;
  let accessGuardAttributes: AccessGuardAttributes | undefined;

  if (typeof shortId === 'string') {
    item = await new Helper().getItem({ shortId });
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
}
