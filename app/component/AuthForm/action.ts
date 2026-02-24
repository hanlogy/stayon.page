'use server';

import { refresh } from 'next/cache';
import { AccessType, ActionResponse } from '@/definitions/types';
import { DBShareableHelper } from '@/dynamodb/DBShareableHelper';
import { toActionFailure, toActionSuccess } from '@/helpers/action';
import { grantAccess } from '@/lib/auth/grantAccess';
import { comparePasscode } from '../../lib/hash';

export async function auth(
  type: AccessType,
  {
    shortId,
    passcode,
  }: {
    shortId: string;
    passcode?: string;
  }
): Promise<ActionResponse> {
  if (!passcode) {
    return toActionSuccess();
  }

  const shareableHelper = new DBShareableHelper();

  const item = await shareableHelper.get({ shortId });
  if (!item) {
    return toActionFailure({ message: 'item does not exist' });
  }

  const {
    viewPasscode,
    adminPasscode,
    viewPasscodeVersion,
    adminPasscodeVersion,
  } = item;

  const [hash, version] =
    type === 'viewAccess'
      ? [viewPasscode, viewPasscodeVersion]
      : [adminPasscode, adminPasscodeVersion];

  if (!hash || !version) {
    return toActionSuccess();
  }

  if (!(await comparePasscode({ passcode, hash }))) {
    return toActionFailure({ message: 'Wrong passcode' });
  }

  await grantAccess({ type, shortId, version });

  refresh();
  return toActionSuccess();
}
