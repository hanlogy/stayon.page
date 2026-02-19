import {
  accessTypes,
  expiresAfterOptions,
  shareableEntityNames,
} from './constants';

export type ShareableEntityName = (typeof shareableEntityNames)[number];

export type ExpiresAfterValue = (typeof expiresAfterOptions)[number];

export type AccessType = (typeof accessTypes)[number];

export interface ShareableCommon {
  readonly shortId: string;
  readonly name: string;
  readonly entity: ShareableEntityName;
  readonly expiresAfter: number;
  readonly viewPasscodeVersion?: number;
  readonly adminPasscodeVersion?: number;
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
