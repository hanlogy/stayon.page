import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Checklist } from '@/definitions/types';
import { DBChecklistHelper } from '@/dynamodb/DBChecklistHelper';
import {
  AccessGuard,
  type AccessGuardAttributes,
} from '../../component/AccessGuard';
import { ChecklistEditor } from './ChecklistEditor';

export const metadata: Metadata = {
  title: 'Checklist Editor',
};

export default async function ChecklistEditorPage({
  searchParams,
}: PageProps<'/editor/checklist'>) {
  const shortIdLike = (await searchParams).id;

  let accessGuardAttributes: AccessGuardAttributes | undefined;

  let item: Checklist | undefined;
  if (typeof shortIdLike === 'string') {
    const dbHelper = new DBChecklistHelper();
    item = await dbHelper.getItem({ shortId: shortIdLike });
    if (!item) {
      return notFound();
    }

    const { viewPasscodeVersion, adminPasscodeVersion, shortId } = item;
    accessGuardAttributes = {
      type: 'adminAccess',
      shortId,
      viewPasscodeVersion,
      adminPasscodeVersion,
    };
  }

  return (
    <AccessGuard attributes={accessGuardAttributes}>
      <div className="mx-auto max-w-2xl px-4">
        <ChecklistEditor initialData={item} />
      </div>
    </AccessGuard>
  );
}
