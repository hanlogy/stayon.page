'use server';

import { Poll } from '@/definitions/types';
import { SettingsFormData } from '@/editor/types';

export type PollFormData = SettingsFormData & Pick<Poll, 'name'>;

export async function publishPoll(
  shortId: string | undefined,
  formData: Partial<PollFormData>
): Promise<ActionResponse> {}
