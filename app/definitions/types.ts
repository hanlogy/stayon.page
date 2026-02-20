import {
  accessTypes,
  expiresAfterOptions,
  shareableEntityNames,
} from './constants';

export type ShareableEntityName = (typeof shareableEntityNames)[number];

export type ExpiresAfterValue = (typeof expiresAfterOptions)[number];

export type YesOrNo = 'yes' | 'no';

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

export interface ActionOk<DataT = undefined> {
  readonly ok: true;
  readonly data?: DataT | undefined;
  readonly error?: undefined;
}

export interface ActionError {
  readonly ok: false;
  readonly data?: undefined;
  readonly error?:
    | {
        message?: string | undefined;
      }
    | undefined;
}

export type ActionResponse<DataT = undefined> = ActionOk<DataT> | ActionError;
