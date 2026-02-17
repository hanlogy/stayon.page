import { expiresAfterOptions, shareableEntityNames } from './constants';

export type ShareableEntityName = (typeof shareableEntityNames)[number];

export type ExpiresAfterValue = (typeof expiresAfterOptions)[number];

export interface ShareableCommon {
  readonly shortId: string;
  readonly name: string;
  readonly hasViewPasscode: boolean;
  readonly hasAdminPasscode: boolean;
  readonly entity: ShareableEntityName;
  readonly expiresAt: string;
}

export interface ChecklistItem {
  readonly checklistItemId: string;
  readonly name: string;
  readonly note?: string;
}

export interface Checklist extends ShareableCommon {
  readonly note?: string;
  readonly items: readonly ChecklistItem[];
}
