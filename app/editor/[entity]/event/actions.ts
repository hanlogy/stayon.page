'use server';

import { redirect } from 'next/navigation';
import { ActionResponse, Event } from '@/definitions';
import { DBEventHelper } from '@/dynamodb/DBEventHelper';
import { parseWithSchema } from '@/editor/schema/helpers';
import { SettingsFormData } from '@/editor/types';
import { toActionFailure } from '@/helpers/action';
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
    | 'rsvpDeadline'
    | 'rsvpVisibility'
  >;

export type EventActionData = Partial<EventFormData>;

export async function publishEvent(
  shortId: string | undefined,
  actionData: EventActionData
): Promise<ActionResponse> {
  const { error, data } = parseWithSchema(eventSchema, actionData);

  if (error || !data) {
    return toActionFailure({
      message: 'Invalid data',
    });
  }

  try {
    const helper = new DBEventHelper();

    if (!shortId) {
      ({ shortId } = await helper.createItem(data));
    } else {
      await helper.updateItem(shortId, data);
    }
  } catch {
    return toActionFailure({
      message: 'Something is wrong when saving data',
    });
  }

  redirect(`/${shortId}`);
}
