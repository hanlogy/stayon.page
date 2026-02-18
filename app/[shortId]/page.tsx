import { EditIcon } from 'lucide-react';
import { notFound } from 'next/navigation';
import { AuthForm } from '@/component/AuthForm';
import { LazyLink } from '@/component/LazyLink';
import { DBChecklistHelper } from '@/dynamodb/DBChecklistHelper';
import { normalizeShortId } from '@/helpers/normalizeShortId';
import { checkAccess } from '@/lib/auth/checkAccess';

export default async function SharingPage({ params }: PageProps<'/[shortId]'>) {
  const maybeShortId = (await params).shortId;
  const shortId = normalizeShortId(maybeShortId);

  if (!shortId) {
    return notFound();
  }

  const dbHelper = new DBChecklistHelper();
  const item = await dbHelper.getItem({ shortId });
  if (!item) {
    return notFound();
  }
  const { hasAdminPasscode, hasViewPasscode, entity } = item;

  if (
    !(await checkAccess('viewAccess', {
      hasAdminPasscode,
      hasViewPasscode,
      shortId,
    }))
  ) {
    return (
      <div className="mx-auto mt-10">
        <div className="mb-2 text-center text-gray-600">
          Enter passcode to view
        </div>
        <AuthForm shortId={shortId} type="viewAccess" />
      </div>
    );
  }

  return (
    <>
      <div className="fixed top-0 right-0 left-0 z-50 flex h-12 items-center px-4">
        <div className="flex-1"></div>
        <LazyLink href={`/editor/${entity}?id=${shortId}`}>
          <EditIcon size={18} />
        </LazyLink>
      </div>
      <div className="h-12"></div>
      <div className="p-8">
        <pre>
          <code>{JSON.stringify(item, null, 2)}</code>
        </pre>
      </div>
    </>
  );
}
