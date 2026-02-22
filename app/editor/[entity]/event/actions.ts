'use server';

import { ActionResponse, Event } from '@/definitions/types';
import { parseWithSchema } from '@/editor/schema/helpers';
import { SettingsFormData } from '@/editor/types';
import { toActionError } from '@/helpers/action';
import { eventSchema } from './schema';

export type EventFormData = SettingsFormData &
  Pick<
    Event,
    | 'name'
    | 'startTime'
    | 'endTime'
    | 'type'
    | 'location'
    | 'description'
    | 'isRsvpRequired'
    | 'rsvpVisibility'
  >;

export async function publishEvent(
  shortId: string | undefined,
  formData: Partial<EventFormData>
): Promise<ActionResponse> {
  const { error, data } = parseWithSchema(eventSchema, formData);
  console.log({ error, data });
  return toActionError();
}
