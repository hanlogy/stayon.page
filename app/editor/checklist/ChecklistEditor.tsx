'use client';

import { useEffect } from 'react';
import { HiddenField, useForm } from '@hanlogy/react-web-ui';
import { TextField } from '@/component/form/fields';
import { nameSchema } from '@/lib/schema/checklist';
import { safeParseField } from '@/lib/schema/helpers';
import { EditorForm } from '../components/EditorForm';
import {
  AddButtonWithIcon,
  DeleteIconButton,
  EditIconButton,
} from '../components/buttons';
import { ChecklistFormData, publishChecklist } from './action';
import { useChecklistItemDialog } from './useChecklistItemDialog';

export function ChecklistEditor() {
  const formManager = useForm<ChecklistFormData>();
  const { items, setItems, openItemDialog } = useChecklistItemDialog();
  const { register, setFieldValue, setValuesChangeListener } = formManager;

  useEffect(() => {
    setFieldValue('items', JSON.stringify(items));
  }, [items, setFieldValue]);

  useEffect(() => {
    setValuesChangeListener(() => {
      // TODO: Save to localStroage
    });
  }, [setValuesChangeListener]);

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
                  const { error } = safeParseField(nameSchema, name);
                  if (error) {
                    setTabName('detail');
                    return error;
                  }
                },
              })}
            />

            <HiddenField controller={register('items')} />

            <div className="py-4">
              {!items.length && (
                <div className="py-4 text-center text-gray-500 italic">
                  No items
                </div>
              )}
              {items.map((item) => {
                const { id, name, note } = item;
                return (
                  <div
                    key={id}
                    className="flex items-center border-b border-b-gray-200 py-2 pl-1"
                  >
                    <div className="flex-1">
                      <div className="font-medium">{name}</div>
                      {note && <div className="text-gray-500">{note}</div>}
                    </div>
                    <div>
                      <EditIconButton onClick={() => openItemDialog(item)} />
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
              <AddButtonWithIcon onClick={() => openItemDialog()}>
                Add item
              </AddButtonWithIcon>
            </div>
          </>
        );
      }}
    </EditorForm>
  );
}
