import type { Checklist } from '@/definitions';

const CHECKLIST_EDITOR_KEY = 'checklist_editor';

export function getChecklistEditorCache(): Checklist | null {
  try {
    const rawData = localStorage.getItem(CHECKLIST_EDITOR_KEY);
    if (!rawData) {
      return null;
    }
    return JSON.parse(rawData);
  } catch {
    return null;
  }
}
