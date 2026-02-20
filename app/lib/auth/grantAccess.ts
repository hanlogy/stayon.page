import { cookies } from 'next/headers';
import { AccessType } from '@/definitions/types';
import { generateJwt } from '../jwt';
import { buildCookieName } from './helpers';

export async function grantAccess({
  type,
  shortId,
  version,
}: {
  type: AccessType;
  shortId: string;
  version: number;
}) {
  const cookieStore = await cookies();
  const secret = process.env.ACCESS_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('unexpected');
  }

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
}
