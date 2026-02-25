import { IconButton, useDialog } from '@hanlogy/react-web-ui';
import { Trash2Icon } from 'lucide-react';
import { ConfirmDialog } from './ConfirmDialog';
import { ErrorDialog } from './ErrorDialog';
import { deleteEntity } from './actions';

export function DeleteEntity({ shortId }: { shortId: string }) {
  const { openDialog } = useDialog();

  const showConfirm = async () => {
    const yes = await openDialog<boolean>(({ closeDialog }) => (
      <ConfirmDialog closeDialog={closeDialog} />
    ));

    if (!yes) {
      return;
    }
    const { success, error } = await deleteEntity({ shortId });

    if (!success) {
      await openDialog(({ closeDialog }) => {
        return (
          <ErrorDialog
            closeDialog={closeDialog}
            error={error.message ?? 'Something was wrong'}
          />
        );
      });
    }
  };

  return (
    <IconButton
      size="xsmall"
      onClick={() => showConfirm()}
      className="pointer-events-auto text-gray-600 hover:bg-gray-100 hover:text-red-600"
    >
      <Trash2Icon size={16} />
    </IconButton>
  );
}
