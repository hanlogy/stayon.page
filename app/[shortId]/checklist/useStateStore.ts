import { useCallback, useRef, useSyncExternalStore } from 'react';

const empty: string[] = [];

export function useStateStore({ shortId }: { shortId: string }) {
  const key = `state-${shortId}`;
  const itemsRef = useRef<string[]>([]);
  const rawRaf = useRef<string | null>(null);
  const listenerRef = useRef<VoidFunction>(null);

  const items = useSyncExternalStore(
    (listener: VoidFunction) => {
      listenerRef.current = listener;
      return () => {
        listenerRef.current = null;
      };
    },
    () => {
      const raw = localStorage.getItem(key);
      if (!raw) {
        return empty;
      }

      if (raw === rawRaf.current) {
        return itemsRef.current;
      }

      rawRaf.current = raw;

      try {
        itemsRef.current = JSON.parse(raw);
        return itemsRef.current;
      } catch {
        return empty;
      }
    },
    () => empty
  );

  const toggleChecked = useCallback(
    (id: string) => {
      const itemsBefore = itemsRef.current;
      const itemsNow = itemsBefore.includes(id)
        ? itemsBefore.filter((e) => e !== id)
        : [...itemsBefore, id];

      localStorage.setItem(key, JSON.stringify(itemsNow));

      if (listenerRef.current) {
        listenerRef.current();
      }
    },
    [key]
  );

  return {
    checkedItems: items,
    toggleChecked,
  };
}
