import { DialogProvider } from '@hanlogy/react-web-ui';
import { Metadata } from 'next';
import { ChecklistEditor } from './ChecklistEditor';

export const metadata: Metadata = {
  title: 'Checklist Editor',
};

export default function ChecklistEditorPage() {
  return (
    <DialogProvider>
      <div className="mx-auto max-w-2xl px-4">
        <ChecklistEditor />
      </div>
    </DialogProvider>
  );
}
