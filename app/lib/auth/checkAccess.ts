import { cookies } from 'next/headers';
import { AccessType } from '@/definitions/types';
import { verifyJwt } from '../jwt';

// Access rules:
// - View: public when hasViewPasscode is false, else validate view token.
// - Admin:
//   - If hasAdminPasscode is true, validate admin token.
//   - Else if hasViewPasscode is true, validate view token (view grants admin).
//   - Else (no passcodes), admin is public.

export async function checkAccess(
  type: AccessType,
  {
    shortId,
    hasAdminPasscode,
    hasViewPasscode,
  }: {
    shortId: string;
    hasAdminPasscode: boolean;
    hasViewPasscode: boolean;
  }
): Promise<boolean> {
  if (
    (type === 'viewAccess' && !hasViewPasscode) ||
    (!hasViewPasscode && !hasAdminPasscode)
  ) {
    return true;
  }

  const secret = process.env.ACCESS_SECRET;
  if (!secret || secret.length < 32) {
    return false;
  }

  const cookieStore = await cookies();

  let token: string | undefined;

  if (type === 'adminAccess' && hasAdminPasscode) {
    token = cookieStore.get('adminAccess')?.value;
  } else {
    token = cookieStore.get('viewAccess')?.value;
  }

  if (!token) {
    return false;
  }

  const jwtValue = await verifyJwt({ token, secret });
  if (!jwtValue) {
    return false;
  }

  return shortId === jwtValue.id;
}
