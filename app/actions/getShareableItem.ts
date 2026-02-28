import { ActionResponse, AccessType, ShareableCommon } from '@/definitions';
import { DBShareableHelper } from '@/dynamodb/DBShareableHelper';
import { ShareableEntity } from '@/dynamodb/types';
import { toActionFailure, toActionSuccess } from '@/helpers/action';

export async function getShareableItem<T extends ShareableCommon>({
  shortId,
}: {
  shortId: string;
  accessType?: AccessType;
  search?: Record<string, unknown>;
}): Promise<
  ActionResponse<
    Omit<ShareableEntity<T>, 'viewPasscode' | 'adminPasscode' | 'pk' | 'sk'>
  >
> {
  const dbHelper = new DBShareableHelper();
  const item = await dbHelper.getItem<T>({ shortId });

  if (!item) {
    throw toActionFailure({
      code: 'notFound',
    });
  }

  // TOOD: check access

  return toActionSuccess(item);
}
