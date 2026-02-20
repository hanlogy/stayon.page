import { createContext } from 'react';
import { EditorContextValue } from './type';

export const EditorContext = createContext<EditorContextValue | null>(null);
