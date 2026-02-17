export interface ChecklistItem {
  readonly id: string;
  readonly name: string;
  readonly note?: string;
}

export interface Checklist {
  readonly id: string;
  readonly readPasscode?: string;
  readonly adminPasscode?: string;
  readonly expiresAfter: number;
  readonly items: readonly ChecklistItem[];
}
