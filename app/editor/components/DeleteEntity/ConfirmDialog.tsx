import { CloseDialogFn } from '@hanlogy/react-web-ui';
import { Dialog } from '@/component/Dialog';
import { TextButton } from '@/component/buttons';

export function ConfirmDialog({
  closeDialog,
}: {
  closeDialog: CloseDialogFn<boolean>;
}) {
  return (
    <Dialog
      title="Delete"
      actions={
        <>
          <TextButton
            className="text-red-600"
            onClick={() => closeDialog(true)}
          >
            Continue
          </TextButton>
          <TextButton onClick={() => closeDialog()} className="text-gray-400">
            Close
          </TextButton>
        </>
      }
    >
      You are going to delete it permanently.
    </Dialog>
  );
}
