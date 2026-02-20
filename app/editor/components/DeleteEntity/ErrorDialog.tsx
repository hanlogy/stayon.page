import { CloseDialogFn } from '@hanlogy/react-web-ui';
import { Dialog } from '@/component/Dialog';
import { TextButton } from '@/component/buttons';

export function ErrorDialog({
  error,
  closeDialog,
}: {
  closeDialog: CloseDialogFn;
  error: string;
}) {
  return (
    <Dialog
      title="Error"
      actions={
        <>
          <TextButton onClick={() => closeDialog()} className="text-gray-400">
            Close
          </TextButton>
        </>
      }
    >
      {error}
    </Dialog>
  );
}
