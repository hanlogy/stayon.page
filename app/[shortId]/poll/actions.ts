'use server';

import type { ActionResponse, PollVoteAnswer } from '@/definitions/types';
import { DBPollVoteHelper } from '@/dynamodb/DBPollVoteHelper';
import { toActionFailure, toActionSuccess } from '@/helpers/action';

export async function saveVote(
  { shortId }: { shortId: string },
  actionData: {
    name: string;
    answers: PollVoteAnswer[];
  }
): Promise<ActionResponse> {
  const helper = new DBPollVoteHelper();

  try {
    await helper.createItem({
      shortId,
      ...actionData,
    });
    return toActionSuccess();
  } catch {
    return toActionFailure();
  }
}
