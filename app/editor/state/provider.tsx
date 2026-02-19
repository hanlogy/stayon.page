'use client';

import { PropsWithChildren, useMemo, useState } from 'react';
import { EditorContext } from './context';
import { EditorTabName } from './type';

export function EditorContextProvider({ children }: PropsWithChildren) {
  const [tabName, setTabName] = useState<EditorTabName>('detail');

  const value = useMemo(() => {
    return {
      tabName,
      setTabName: (name: EditorTabName) => {
        setTabName(name);
      },
    };
  }, [tabName]);

  return <EditorContext value={value}>{children}</EditorContext>;
}
