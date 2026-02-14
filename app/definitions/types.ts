import { featureTypes } from './constants';

export type FeatureType = (typeof featureTypes)[number];

/**
 * @deprecated
 */
export interface ChecklistItem {
  readonly id: string;
  readonly name: string;
  readonly remark?: string;
  readonly isChecked: boolean;
}

/**
 * @deprecated
 * // TODO: This should not be universal, for example the plain text passcode
 * // only exist in form data
 */
export interface Checklist {
  readonly id: string;
  readonly readPasscode?: string;
  readonly adminPasscode?: string;
  readonly expiresAfter: number;
  readonly items: readonly ChecklistItem[];
}
