import { DialogProvider } from '@hanlogy/react-web-ui';
import { ChecklistEditor } from './ChecklistEditor';

export default function ChecklistEditorPage() {
  return (
    <DialogProvider>
      <div className="mx-auto max-w-2xl px-4">
        <ChecklistEditor />
      </div>
    </DialogProvider>
  );
}
