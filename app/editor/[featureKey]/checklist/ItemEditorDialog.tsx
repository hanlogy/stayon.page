import { CloseDialogFn, useForm } from '@hanlogy/react-web-ui';
import { Dialog } from '@/component/Dialog';
import { FilledButton, TextButton } from '@/component/buttons';
import { TextareaField, TextField } from '@/component/form/fields';
import { ChecklistItem } from '@/definitions/types';

interface FormData {
  name: string;
  remark?: string;
}

export function ItemEditorDialog({
  closeDialog,
  initialData,
}: {
  closeDialog: CloseDialogFn<ChecklistItem>;
  initialData?: Partial<ChecklistItem>;
}) {
  const { register, handleSubmit, setInitialValues } = useForm<FormData>();

  if (initialData) {
    setInitialValues({
      name: initialData.name,
      remark: initialData.remark,
    });
  }

  const onSubmit = ({ name, remark }: FormData) => {
    closeDialog({
      id: initialData?.id ?? crypto.randomUUID(),
      name,
      remark,
      isChecked: false,
    });
  };

  return (
    <Dialog
      title={initialData ? 'Edit Item' : 'Add Item'}
      actions={
        <>
          <FilledButton className="min-w-26" onClick={handleSubmit(onSubmit)}>
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

        <TextareaField
          rows={2}
          label="Remark"
          controller={register('remark')}
        />
      </div>
    </Dialog>
  );
}
