'use server';

import { refresh } from 'next/cache';
import { cookies } from 'next/headers';
import { AccessType } from '@/definitions/types';
import { DBShareableHelper } from '@/dynamodb/DBShareableHelper';
import { comparePasscode } from '../hash';
import { generateJwt } from '../jwt';

export async function login({
  shortId,
  passcode,
  type,
}: {
  shortId: string;
  passcode?: string;
  type: AccessType;
}) {
  if (!passcode) {
    return;
  }

  const shareableHelper = new DBShareableHelper();

  const item = await shareableHelper.get({ shortId });
  if (!item) {
    throw new Error('item does not exist');
  }

  const hash = type === 'adminAccess' ? item.adminPasscode : item.viewPasscode;
  if (hash && !(await comparePasscode({ passcode, hash }))) {
    throw new Error('failed');
  }

  const cookieStore = await cookies();
  const secret = process.env.ACCESS_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('unexpected');
  }

  cookieStore.set(type, await generateJwt({ id: shortId, secret }), {
    httpOnly: true,
  });

  refresh();
}
