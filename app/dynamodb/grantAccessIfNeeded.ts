import { grantAccess } from '@/lib/auth/grantAccess';

export async function grantAccessIfNeeded({
  forViewAccess,
  forAdminAccess,
  shortId,
  version,
}: {
  forViewAccess: boolean;
  forAdminAccess: boolean;
  shortId: string;
  version: number;
}): Promise<void> {
  if (!forViewAccess && !forAdminAccess) {
    return;
  }

  // When for both view access and admin access, only need to grant admin access
  await grantAccess({
    type: forAdminAccess ? 'adminAccess' : 'viewAccess',
    shortId,
    version,
  });
}
