'use client';

import { useMemo, useState } from 'react';
import { useDialog, useForm } from '@hanlogy/react-web-ui';
import { TextField } from '@/component/form/fields';
import { ChecklistItem } from '@/definitions/types';
import { EditorForm } from '../components/EditorForm';
import {
  AddButtonWithIcon,
  DeleteIconButton,
  EditIconButton,
} from '../components/buttons';
import { SettingsFormData } from '../types';
import { ItemEditorDialog } from './ItemEditorDialog';
import { publishChecklist } from './action';

type FormData = SettingsFormData & {
  name: string;
};

export function ChecklistEditor() {
  const formManager = useForm<FormData>();
  const { register } = formManager;
  const { openDialog } = useDialog();
  const [items, setItems] = useState<ChecklistItem[]>([]);

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

  const itemsJson = useMemo(() => {
    return JSON.stringify(items);
  }, [items]);

  return (
    <EditorForm action={publishChecklist} formManager={formManager}>
      {({ setTabName }) => {
        return (
          <>
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
            <input type="hidden" name="items" defaultValue={itemsJson} />

            <div className="py-4">
              {!items.length && (
                <div className="py-4 text-center text-gray-500 italic">
                  No items
                </div>
              )}
              {items.map((item) => {
                const { id, name, remark } = item;
                return (
                  <div
                    key={id}
                    className="flex items-center border-b border-b-gray-200 py-2 pl-1"
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
              <AddButtonWithIcon onClick={() => handleOpenDialog()}>
                Add item
              </AddButtonWithIcon>
            </div>
          </>
        );
      }}
    </EditorForm>
  );
}
