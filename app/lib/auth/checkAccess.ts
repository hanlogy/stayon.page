import { cookies } from 'next/headers';
import { AccessType } from '@/definitions/types';
import { verifyJwt } from '../jwt';
import { buildCookieName } from './helpers';

// Access rules:
// - View: public when there is a view passcode, else validate view token.
// - Admin:
//   - If there is a admin passcode is true, validate admin token.
//   - Else if there is a view passcode, validate view token (view grants admin).
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

  if (!token) {
    return false;
  }

  const secret = process.env.ACCESS_SECRET;
  if (!secret || secret.length < 32) {
    return false;
  }
  const jwtValue = await verifyJwt({ token, secret });
  if (!jwtValue) {
    return false;
  }

  return shortId === jwtValue.id && version === jwtValue.claims.version;
}
