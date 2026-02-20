import { YesOrNo } from '@/definitions/types';

export interface SettingsFormData {
  viewPasscode?: string;
  adminPasscode?: string;
  deleteViewPasscode?: YesOrNo;
  deleteAdminPasscode?: YesOrNo;
  expiresAfter: string;
}
