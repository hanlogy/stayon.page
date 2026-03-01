import { cookies } from 'next/headers';
import type { AccessType } from '@/definitions';
import { verifyJwt } from '../jwt';
import { buildCookieName } from './helpers';

// Access rules:
// - View:
//   - Public when there is no view passcode.
//   - Else validate view token. If that fails and an admin passcode exists,
//     validate admin token (admin grants view).
// - Admin:
//   - If an admin passcode exists, validate admin token.
//   - Else if a view passcode exists, validate view token (view grants admin).
//   - Else (no passcodes), admin is public.

export async function checkAccess(
  type: AccessType,
  {
    shortId,
    adminPasscodeVersion,
    viewPasscodeVersion,
  }: {
    shortId: string;
    adminPasscodeVersion?: number;
    viewPasscodeVersion?: number;
  }
): Promise<boolean> {
  const hasAdminPasscode = !!adminPasscodeVersion;
  const hasViewPasscode = !!viewPasscodeVersion;

  if (
    (type === 'viewAccess' && !hasViewPasscode) ||
    (!hasViewPasscode && !hasAdminPasscode)
  ) {
    return true;
  }

  const cookieStore = await cookies();

  let token: string | undefined;
  let version: number | undefined;

  if (type === 'adminAccess' && hasAdminPasscode) {
    token = cookieStore.get(
      buildCookieName({ type: 'adminAccess', shortId })
    )?.value;
    version = adminPasscodeVersion;
  } else {
    token = cookieStore.get(
      buildCookieName({ type: 'viewAccess', shortId })
    )?.value;
    version = viewPasscodeVersion;
  }

  const secret = process.env.ACCESS_SECRET;
  if (!secret || secret.length < 32) {
    return false;
  }

  const isTokenValid = async (
    tokenToVerify: string | undefined,
    expectedVersion: number | undefined
  ): Promise<boolean> => {
    if (!tokenToVerify) {
      return false;
    }

    const jwtValue = await verifyJwt({ token: tokenToVerify, secret });
    if (!jwtValue) {
      return false;
    }

    return (
      shortId === jwtValue.id && expectedVersion === jwtValue.claims.version
    );
  };

  if (await isTokenValid(token, version)) {
    return true;
  }

  if (type === 'viewAccess' && hasAdminPasscode) {
    const adminToken = cookieStore.get(
      buildCookieName({ type: 'adminAccess', shortId })
    )?.value;

    return isTokenValid(adminToken, adminPasscodeVersion);
  }

  return false;
}
