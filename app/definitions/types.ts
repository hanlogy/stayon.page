import { featureTypes } from './constants';

export type FeatureType = (typeof featureTypes)[number];

export interface ChecklistItem {
  readonly id: string;
  readonly name: string;
  readonly remark?: string;
  readonly isChecked: boolean;
}
