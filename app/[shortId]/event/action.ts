'use server';

import { ActionResponse, EventRsvp, RsvpResponse } from '@/definitions/types';
import { DBEventRsvpHelper } from '@/dynamodb/DBEventRsvpHelper';
import { toActionError, toActionSuccess } from '@/helpers/action';
import { safeParseFields } from '@/helpers/schemaHelpers';
import { rsvpSchema } from './schema';

export interface RsvpFormData {
  name: string;
  guestCount?: string;
  response: RsvpResponse;
}

export async function saveRsvp(
  {
    code,
    shortId,
  }: {
    code?: string;
    shortId: string;
  },
  formData: Partial<RsvpFormData>
): Promise<ActionResponse<{ code: string }>> {
  const { error, data } = safeParseFields(rsvpSchema, formData);
  if (error || !data) {
    return toActionError();
  }

  const helper = new DBEventRsvpHelper();

  let item: EventRsvp;

  if (!code) {
    item = await helper.createItem({
      shortId,
      ...data,
    });
  } else {
    item = await helper.updateItem({
      shortId,
      code,
      ...data,
    });
  }
  return toActionSuccess({
    code: item.code,
  });
}

export async function searchRsvp({
  code,
  shortId,
}: {
  code: string;
  shortId: string;
}): Promise<ActionResponse<EventRsvp>> {
  if (!code || !shortId) {
    return toActionError();
  }
  const helper = new DBEventRsvpHelper();

  const item = await helper.getItem({ code, shortId });
  if (!item) {
    return toActionError({
      message: 'No RSVP found for that code.',
    });
  }

  return toActionSuccess(item);
}
