'use server';

import type { ActionResponse, PollVoteAnswer } from '@/definitions/types';
import { toActionFailure } from '@/helpers/action';

export async function saveVote(actionData: {
  shortId: string;
  name: string;
  answers: PollVoteAnswer[];
}): Promise<ActionResponse> {
  return toActionFailure();
}
