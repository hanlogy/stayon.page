import { Checklist, ShareableCommon } from '@/definitions/types';

// The user provided fields.
export type ShareableCreateFields = Pick<
  ShareableCommon,
  'name' | 'expiresAt'
> & {
  readonly viewPasscode?: string;
  readonly adminPasscode?: string;
};

export type ChecklistCreateFields = ShareableCreateFields &
  Pick<Checklist, 'note'>;
