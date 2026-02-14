export type EditorTabName = 'detail' | 'settings';

export interface EditorTabItem {
  value: EditorTabName;
  label: string;
}

export interface SettingsFormData {
  viewPasscode?: string;
  adminPasscode?: string;
  expiresAfter: string;
}
