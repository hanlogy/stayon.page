import { ActionResponse, AccessType, ShareableCommon } from '@/definitions';
import { DBShareableHelper } from '@/dynamodb/DBShareableHelper';
import { ShareableEntity } from '@/dynamodb/types';
import { toActionFailure, toActionSuccess } from '@/helpers/action';
import { checkAccess } from '@/lib/auth/checkAccess';

export async function getShareableItem<T extends ShareableCommon>({
  shortId: shortIdLike,
  accessType = 'viewAccess',
}: {
  shortId: string;
  accessType: AccessType;
  search?: Record<string, unknown>;
}): Promise<
  ActionResponse<
    Omit<ShareableEntity<T>, 'viewPasscode' | 'adminPasscode' | 'pk' | 'sk'>,
    | {
        shortId: string;
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
        hasAdminPassword: !!adminPasscodeVersion,
      },
    });
  }

  // TODO: for the sub query, we return with nested response

  return toActionSuccess(item);
}
