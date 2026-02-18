import { Checklist, ShareableCommon } from '@/definitions/types';

// The user provided fields.
export type ShareableCreateFields = Pick<
  ShareableCommon,
  'name' | 'expiresAfter'
> & {
  readonly viewPasscode?: string;
  readonly adminPasscode?: string;
};

export type ChecklistCreateFields = ShareableCreateFields &
  Pick<Checklist, 'note' | 'items'>;

export type ShareableEntity<T extends ShareableCommon = ShareableCommon> = Omit<
  T,
  'hasViewPasscode' | 'hasAdminPasscode'
> & {
  readonly pk: string;
  readonly sk: string;
  readonly viewPasscode?: string;
  readonly adminPasscode?: string;
};
