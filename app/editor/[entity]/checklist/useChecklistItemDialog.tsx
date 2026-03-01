import { useState } from 'react';
import { useDialog } from '@hanlogy/react-web-ui';
import type { ChecklistItem } from '@/definitions';
import { ItemEditorDialog } from './ItemEditorDialog';

export function useChecklistItemDialog({
  initialItems,
  onChange,
}: {
  initialItems?: readonly ChecklistItem[];
  onChange: () => void;
}) {
  const { openDialog } = useDialog();
  const [items, setItems] = useState<readonly ChecklistItem[]>(
    initialItems ?? []
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
    onChange();
  };

  return {
    items,
    setItems,
    openItemDialog,
  };
}
