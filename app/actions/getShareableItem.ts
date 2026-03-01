'use server';

import {
  ActionResponse,
  AccessType,
  ShareableCommon,
  Poll,
  ShareableEntityName,
} from '@/definitions';
import { DBShareableHelper } from '@/dynamodb/DBShareableHelper';
import { ShareableEntity } from '@/dynamodb/types';
import { toActionFailure, toActionSuccess } from '@/helpers/action';
import { checkAccess } from '@/lib/auth/checkAccess';
import { getPollAnswers, PollAnswersResponse } from './getPollAnswers';

export async function getShareableItem<T extends ShareableCommon>({
  shortId: shortIdLike,
  accessType = 'viewAccess',
  search = {},
}: {
  shortId: string;
  accessType: AccessType;
  search?: Record<string, string>;
}): Promise<
  ActionResponse<
    Omit<ShareableEntity<T>, 'viewPasscode' | 'adminPasscode' | 'pk' | 'sk'> & {
      pollAnswers?: PollAnswersResponse;
    },
    | {
        shortId: string;
        entity: ShareableEntityName;
        hasAdminPassword: boolean;
      }
    | undefined
  >
> {
  const dbHelper = new DBShareableHelper();
  const item = await dbHelper.getItem<T>({ shortId: shortIdLike });

  if (!item) {
    return toActionFailure({
      code: 'notFound',
    });
  }
  const { viewPasscodeVersion, adminPasscodeVersion, shortId } = item;

  if (
    !(await checkAccess(accessType, {
      shortId,
      viewPasscodeVersion,
      adminPasscodeVersion,
    }))
  ) {
    return toActionFailure({
      code: 'unauthorized',
      data: {
        shortId,
        entity: item.entity,
        hasAdminPassword: !!adminPasscodeVersion,
      },
    });
  }

  if (item.entity === 'poll' && search.view === 'result') {
    const result = await getPollAnswers({
      poll: item as unknown as Poll,
    });

    return toActionSuccess({ ...item, pollAnswers: result });
  }

  return toActionSuccess(item);
}
