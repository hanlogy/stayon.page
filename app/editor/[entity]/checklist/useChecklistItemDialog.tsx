import { useState } from 'react';
import { useDialog } from '@hanlogy/react-web-ui';
import { ChecklistItem } from '@/definitions/types';
import { ItemEditorDialog } from './ItemEditorDialog';

export function useChecklistItemDialog(initialItem?: readonly ChecklistItem[]) {
  const { openDialog } = useDialog();
  const [items, setItems] = useState<readonly ChecklistItem[]>(
    initialItem ?? []
  );

  const openItemDialog = async (item?: ChecklistItem) => {
    const result = await openDialog<ChecklistItem>(({ closeDialog }) => (
      <ItemEditorDialog initialData={item} closeDialog={closeDialog} />
    ));

    if (!result) {
      return;
    }

    if (item) {
      setItems((prev) =>
        prev.map((e) =>
          e.checklistItemId === item.checklistItemId ? result : e
        )
      );
    } else {
      setItems((prev) => [...prev, result]);
    }
  };

  return {
    items,
    setItems,
    openItemDialog,
  };
}
