import { useCallback, useEffect, useRef, useState } from 'react';
import { IDBHandle, openDB } from '@/lib/indexedDB';

export function useStateStore({ shortId }: { shortId: string }) {
  const dbRef = useRef<IDBHandle | null>(null);
  const [checkedItems, setCheckedItems] = useState<string[]>([]);

  const getItems = useCallback(async () => {
    const db = dbRef.current;
    if (!db) {
      return [];
    }
    return (await db.get('checklistState', shortId))?.checkedItems ?? [];
  }, [shortId]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const db = await openDB();
      if (cancelled) {
        return;
      }
      dbRef.current = db;

      setCheckedItems(await getItems());
    })();

    return () => {
      cancelled = true;
    };
  }, [getItems]);

  const toggleChecked = useCallback(
    async (id: string) => {
      const itemsBefore = await getItems();

      const itemsNow = itemsBefore.includes(id)
        ? itemsBefore.filter((e) => e !== id)
        : [...itemsBefore, id];

      const db = dbRef.current;

      if (!db) {
        return;
      }

      setCheckedItems(itemsNow);
      await db.put('checklistState', {
        shortId,
        checkedItems: itemsNow,
      });
    },
    [getItems, shortId]
  );

  return {
    checkedItems,
    toggleChecked,
  };
}
