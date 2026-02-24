'use client';

import { useEffect } from 'react';
import { HiddenField, useForm } from '@hanlogy/react-web-ui';
import { Checklist } from '@/definitions/types';
import { EntityNameField } from '@/editor/components/EntityNameField';
import { EditorLayout } from '../../components/EditorLayout';
import {
  AddButtonWithIcon,
  DeleteIconButton,
  EditIconButton,
} from '../../components/buttons';
import { ChecklistFormData, publishChecklist } from './action';
import { useChecklistItemDialog } from './useChecklistItemDialog';

export function ChecklistEditor({ initialData }: { initialData?: Checklist }) {
  const formManager = useForm<ChecklistFormData>();
  const { items, setItems, openItemDialog } = useChecklistItemDialog(
    initialData?.items
  );
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
    <EditorLayout
      nameForTitle="checklist"
      className="max-w-2xl"
      initialData={initialData}
      action={publishChecklist}
      formManager={formManager}
    >
      <EntityNameField
        label="Checklist name"
        register={register}
        defaultValue={initialData?.name}
      />

      <HiddenField controller={register('items')} />

      <div className="py-4">
        {!items.length && (
          <div className="py-4 text-center text-gray-500 italic">No items</div>
        )}
        {items.map((item) => {
          const { checklistItemId, name, note } = item;
          return (
            <div
              key={checklistItemId}
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
                      return prev.filter(
                        (e) => e.checklistItemId !== checklistItemId
                      );
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
    </EditorLayout>
  );
}
