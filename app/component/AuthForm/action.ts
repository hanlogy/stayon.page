'use server';

import { refresh } from 'next/cache';
import { AccessType } from '@/definitions/types';
import { DBShareableHelper } from '@/dynamodb/DBShareableHelper';
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
) {
  if (!passcode) {
    return;
  }

  const shareableHelper = new DBShareableHelper();

  const item = await shareableHelper.get({ shortId });
  if (!item) {
    throw new Error('item does not exist');
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
    return;
  }

  if (!(await comparePasscode({ passcode, hash }))) {
    throw new Error('failed');
  }

  await grantAccess({ type, shortId, version });

  refresh();
}
