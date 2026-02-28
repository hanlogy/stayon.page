import { ComponentType, ReactNode } from 'react';
import { DialogProvider } from '@hanlogy/react-web-ui';
import { FlexCenter } from '@hanlogy/react-web-ui';
import { kebabToCamel } from '@hanlogy/ts-lib';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getShareableItem } from '@/actions/getShareableItem';
import { AuthForm } from '@/component/AuthForm/AuthForm';
import { Layout } from '@/component/Layout';
import { NoAdminPasscode } from '@/component/NoAdminPasscode';
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

    if (typeof shortIdLike === 'string') {
      const { data, error } = await getShareableItem<DataT>({
        shortId: shortIdLike,
        accessType: 'adminAccess',
      });

      if (error) {
        const { code: errorCode, data: errorData } = error;
        if (errorCode === 'notFound') {
          return notFound();
        }

        if (errorCode === 'unauthorized') {
          let accessDeniedView: ReactNode;
          if (errorData && errorData.hasAdminPassword === false) {
            accessDeniedView = <NoAdminPasscode shortId={errorData.shortId} />;
          } else {
            accessDeniedView = (
              <AuthForm type="adminAccess" shortId={shortIdLike} />
            );
          }

          return <Layout>{accessDeniedView}</Layout>;
        }

        throw new Error('unknown error');
      }
      item = data;
    }

    return (
      <DialogProvider>
        <EditorContextProvider>
          <Editor initialData={item} />
        </EditorContextProvider>
      </DialogProvider>
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
