import { CloseDialogFn, useForm } from '@hanlogy/react-web-ui';
import { Dialog } from '@/component/Dialog';
import { FilledButton, TextButton } from '@/component/buttons';
import { TextareaField, TextField } from '@/component/form/fields';
import { ChecklistItem } from '@/definitions/types';

interface FormData {
  name: string;
  note?: string;
}

export function ItemEditorDialog({
  closeDialog,
  initialData,
}: {
  closeDialog: CloseDialogFn<ChecklistItem>;
  initialData?: Partial<ChecklistItem>;
}) {
  const { register, validate, getValues, setInitialValues } =
    useForm<FormData>();

  if (initialData) {
    setInitialValues({
      name: initialData.name,
      note: initialData.note,
    });
  }

  const onSubmit = () => {
    if (!validate()) {
      return;
    }
    const { name, note } = getValues();
    if (!name) {
      return;
    }

    closeDialog({
      checklistItemId: initialData?.checklistItemId ?? crypto.randomUUID(),
      name,
      note,
    });
  };

  return (
    <Dialog
      title={initialData ? 'Edit Item' : 'Add Item'}
      actions={
        <>
          <FilledButton className="min-w-26" onClick={() => onSubmit()}>
            Submit
          </FilledButton>
          <TextButton onClick={() => closeDialog()}>Close</TextButton>
        </>
      }
    >
      <div className="space-y-4">
        <TextField
          autoComplete="off"
          label="Item name"
          controller={register('name', {
            validator: ({ name }) => {
              if (!name?.trim()) {
                return 'Item name is required';
              }
            },
          })}
        />

        <TextareaField rows={2} label="Note" controller={register('note')} />
      </div>
    </Dialog>
  );
}
