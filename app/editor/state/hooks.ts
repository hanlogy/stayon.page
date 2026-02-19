import { useContext } from 'react';
import { EditorContext } from './context';

export function useEditorContext() {
  const value = useContext(EditorContext);

  if (!value) {
    throw new Error('EditorContext is not provided');
  }

  return value;
}
