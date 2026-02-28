import type { YesOrNo } from '@/definitions';

export interface SettingsFormData {
  viewPasscode?: string;
  adminPasscode?: string;
  deleteViewPasscode?: YesOrNo;
  deleteAdminPasscode?: YesOrNo;
  expiresAfter: string;
}
