import { Checklist, ShareableCommon } from '@/definitions/types';

// The user provided fields.
export type ShareableCreateFields = Pick<
  ShareableCommon,
  'name' | 'expiresAfter'
> & {
  readonly viewPasscode?: string;
  readonly adminPasscode?: string;
};

export type ShareableUpdateFields = Pick<
  ShareableCommon,
  'name' | 'expiresAfter'
> & {
  readonly viewPasscode?: string;
  readonly adminPasscode?: string;
  readonly deleteViewPasscode?: boolean;
  readonly deleteAdminPasscode?: boolean;
};

export type ChecklistCreateFields = ShareableCreateFields &
  Pick<Checklist, 'note' | 'items'>;

export type ChecklistUpdateFields = ShareableUpdateFields &
  Pick<Checklist, 'note' | 'items'>;

export type ShareableEntity<T extends ShareableCommon = ShareableCommon> = T & {
  readonly pk: string;
  readonly sk: string;
  readonly viewPasscode?: string;
  readonly adminPasscode?: string;
  readonly viewPasscodeVersion?: number;
  readonly adminPasscodeVersion?: number;
};
