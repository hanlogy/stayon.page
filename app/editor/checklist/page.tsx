import { Metadata } from 'next';
import { ChecklistEditor } from './ChecklistEditor';

export const metadata: Metadata = {
  title: 'Checklist Editor',
};

export default async function ChecklistEditorPage({
  searchParams,
}: PageProps<'/editor/checklist'>) {
  const itemId = (await searchParams).id;

  console.log('TODO:', 'ChecklistEditorPage', itemId);

  return (
    <div className="mx-auto max-w-2xl px-4">
      <ChecklistEditor />
    </div>
  );
}
