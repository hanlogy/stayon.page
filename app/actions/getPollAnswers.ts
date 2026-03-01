'use server';

import { ActionResponse, Poll, PollVoteAnswer } from '@/definitions';
import { DBPollVoteHelper } from '@/dynamodb/DBPollVoteHelper';
import { toActionFailure, toActionSuccess } from '@/helpers/action';
import { checkAccess } from '@/lib/auth/checkAccess';

export type PollAnswersResponse = ActionResponse<
  PollVoteAnswer[] | undefined,
  {
    reason: 'notClosed' | 'needAdminAccess';
  }
>;

export async function getPollAnswers({
  poll: {
    isClosed,
    resultsVisibility,
    shortId,
    viewPasscodeVersion,
    adminPasscodeVersion,
  },
}: {
  poll: Poll;
}): Promise<PollAnswersResponse> {
  if (resultsVisibility === 'afterClose' && !isClosed) {
    return toActionFailure({
      code: 'forbidden',
      data: { reason: 'notClosed' },
    });
  }

  if (
    resultsVisibility === 'admin' &&
    !(await checkAccess('adminAccess', {
      shortId,
      viewPasscodeVersion,
      adminPasscodeVersion,
    }))
  ) {
    return toActionFailure({
      code: 'forbidden',
      data: { reason: 'needAdminAccess' },
    });
  }
  const helper = new DBPollVoteHelper();
  const votes = await helper.getItems({ shortId });

  return toActionSuccess(votes.map(({ answers }) => answers).flatMap((e) => e));
}
