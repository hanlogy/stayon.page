'use client';

import { useEffect, useState } from 'react';
import { useForm } from '@hanlogy/react-web-ui';
import type { Checklist } from '@/definitions';
import { EntityNameField } from '@/editor/components/EntityNameField';
import { useEditorContext } from '@/editor/state/hooks';
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
  const { items, setItems, openItemDialog } = useChecklistItemDialog({
    initialItems: initialData?.items,
    onChange: () => {
      setError('');
    },
  });
  const [error, setError] = useState<string | undefined>();
  const { register, setValuesChangeListener } = formManager;
  const { setTabName } = useEditorContext();

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
      getValues={() => {
        setError(undefined);

        if (!items.length) {
          setError('Checklist items cannot be empty');
          setTabName('detail');
          return undefined;
        }

        return { ...formManager.getValues(), items };
      }}
      formManager={formManager}
    >
      <EntityNameField
        label="Checklist name"
        register={register}
        defaultValue={initialData?.name}
      />

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
      {error && <div className="my-6 text-center text-red-600">{error}</div>}
    </EditorLayout>
  );
}
