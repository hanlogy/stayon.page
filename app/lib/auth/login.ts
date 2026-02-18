'use server';

import { refresh } from 'next/cache';
import { cookies } from 'next/headers';
import { AccessType } from '@/definitions/types';
import { DBShareableHelper } from '@/dynamodb/DBShareableHelper';
import { comparePasscode } from '../hash';
import { generateJwt } from '../jwt';
import { buildCookieName } from './helpers';

export async function login(
  {
    shortId,
    passcode,
    type,
  }: {
    shortId: string;
    passcode?: string;
    type: AccessType;
  },
  shouldRefresh: boolean = false
) {
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

  const version =
    type === 'viewAccess'
      ? item.viewPasscodeVersion
      : item.adminPasscodeVersion;

  const expiresInSeconds = 60 * 60 * 24 * 7;

  cookieStore.set(
    buildCookieName({ type, shortId }),
    await generateJwt({
      id: shortId,
      secret,
      expiresInSeconds,
      claims: { version },
    }),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: expiresInSeconds,
    }
  );

  if (shouldRefresh) {
    refresh();
  }
}
