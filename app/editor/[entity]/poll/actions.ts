'use server';

import { redirect } from 'next/navigation';
import {
  ActionResponse,
  PollQuestion,
  PollResultsVisibility,
} from '@/definitions/types';
import { DBPollHelper } from '@/dynamodb/DBPollHelper';
import { parseWithSchema } from '@/editor/schema/helpers';
import { SettingsFormData } from '@/editor/types';
import { toActionFailure } from '@/helpers/action';
import { pollSchema } from './schema';

export type PollFormData = SettingsFormData & {
  name: string;
  note?: string;
  resultsVisibility: PollResultsVisibility;
  closesAt?: string;
};

export type PollActionData = Partial<PollFormData> & {
  questions: readonly PollQuestion[];
};

export async function publishPoll(
  shortId: string | undefined,
  { questions, ...formData }: PollActionData
): Promise<ActionResponse> {
  const { error, data } = parseWithSchema(pollSchema, formData);
  console.log(error);
  if (error || !data) {
    return toActionFailure({
      message: 'Invalid data',
    });
  }

  try {
    const helper = new DBPollHelper();

    if (!shortId) {
      ({ shortId } = await helper.createItem({ ...data, questions }));
    } else {
      await helper.updateItem(shortId, { ...data, questions });
    }
  } catch {
    return toActionFailure({
      message: 'Something is wrong when saving data',
    });
  }

  redirect(`/${shortId}`);
}
