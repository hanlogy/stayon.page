import { useState } from 'react';
import { useDialog } from '@hanlogy/react-web-ui';
import { ItemEditorDialog } from './ItemEditorDialog';
import { ChecklistItem } from './types';

export function useChecklistItemDialog() {
  const { openDialog } = useDialog();
  const [items, setItems] = useState<ChecklistItem[]>([]);

  const openItemDialog = async (item?: ChecklistItem) => {
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

  return {
    items,
    setItems,
    openItemDialog,
  };
}
