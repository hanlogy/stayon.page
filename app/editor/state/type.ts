export type EditorTabName = 'detail' | 'settings';

export interface EditorContextValue {
  tabName: EditorTabName;
  setTabName: (name: EditorTabName) => void;
}
