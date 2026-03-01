'use server';

import { ActionResponse, Poll, PollVote } from '@/definitions';
import { DBPollVoteHelper } from '@/dynamodb/DBPollVoteHelper';
import { toActionFailure, toActionSuccess } from '@/helpers/action';
import { checkAccess } from '@/lib/auth/checkAccess';

export async function getPollResult({
  poll: {
    isClosed,
    resultsVisibility,
    shortId,
    viewPasscodeVersion,
    adminPasscodeVersion,
  },
  view,
}: {
  poll: Poll;
  view: unknown;
}): Promise<
  ActionResponse<
    PollVote[] | undefined,
    {
      reason: 'notClosed' | 'needAdminAccess';
    }
  >
> {
  const viewMode = normalizeViewMode(view);
  if (viewMode === 'questions') {
    return toActionSuccess();
  }

  if (viewMode === 'result') {
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
  }
  const helper = new DBPollVoteHelper();
  const votes = await helper.getItems({ shortId });

  return toActionSuccess(votes);
}

function normalizeViewMode(view: unknown): 'questions' | 'result' | undefined {
  if (!view || typeof view !== 'string') {
    return undefined;
  }

  return (['questions', 'result'] as const).find(
    (e) => e === view.toLocaleLowerCase()
  );
}
