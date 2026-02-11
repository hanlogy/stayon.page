import { SubmitEventHandler, useMemo, useState } from 'react';
import { FormFieldRegister, useDialog } from '@hanlogy/react-web-ui';
import { TextField } from '@/component/form/fields';
import { ChecklistItem } from '@/definitions/types';
import {
  AddItemButton,
  DeleteIconButton,
  EditIconButton,
} from '../components/buttons';
import { formId } from '../constants';
import { EditorTabName } from '../types';
import { ItemEditorDialog } from './ItemEditorDialog';
import { publishChecklist } from './action';

export default function ChecklistEditor({
  register,
  onValidate,
  setTabName,
}: {
  register: FormFieldRegister<{ name: string }>;
  onValidate: SubmitEventHandler;
  setTabName: (tabName: EditorTabName) => void;
}) {
  const { openDialog } = useDialog();
  const [items, setItems] = useState<ChecklistItem[]>([]);

  const itemsJson = useMemo(() => {
    return JSON.stringify(items);
  }, [items]);

  const handleOpenDialog = async (item?: ChecklistItem) => {
    const result = await openDialog<ChecklistItem>(({ closeDialog }) => (
      <ItemEditorDialog initialData={item} closeDialog={closeDialog} />
    ));

    if (!result) {
      return;
    }

    if (item) {
      setItems((prev) => prev.map((e) => (e.id === item.id ? result : e)));
    } else {
      setItems((prev) => [...prev, result]);
    }
  };

  return (
    <>
      <form
        autoComplete="off"
        id={formId}
        action={publishChecklist}
        onSubmit={onValidate}
      >
        <TextField
          label="Checklist name"
          maxLength={200}
          controller={register('name', {
            validator: ({ name }) => {
              if (!name) {
                setTabName('detail');
                return 'Checklist name is required';
              }
            },
          })}
        />
        <input type="hidden" name="items" value={itemsJson} />
      </form>
      <div className="py-4">
        {!items.length && (
          <div className="py-4 text-center text-gray-500 italic">
            No items yet
          </div>
        )}
        {items.map((item) => {
          const { id, name, remark } = item;
          return (
            <div
              key={id}
              className="flex items-center border-b border-b-gray-200 py-1 pl-1"
            >
              <div className="flex-1">
                <div className="font-medium">{name}</div>
                {remark && <div className="text-gray-500">{remark}</div>}
              </div>
              <div>
                <EditIconButton onClick={() => handleOpenDialog(item)} />
                <DeleteIconButton
                  onClick={() =>
                    setItems((prev) => {
                      return prev.filter((e) => e.id !== id);
                    })
                  }
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className="py-4 text-center">
        <AddItemButton onClick={() => handleOpenDialog()} />
      </div>
    </>
  );
}
