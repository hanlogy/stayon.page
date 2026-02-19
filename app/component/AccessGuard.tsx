import { PropsWithChildren } from 'react';
import { AccessType } from '@/definitions/types';
import { checkAccess } from '@/lib/auth/checkAccess';
import { AuthForm } from './AuthForm';

export interface AccessGuardAttributes {
  type: AccessType;
  shortId: string;
  viewPasscodeVersion?: number;
  adminPasscodeVersion?: number;
}

export async function AccessGuard({
  children,
  attributes,
}: PropsWithChildren<{
  attributes?: AccessGuardAttributes;
}>) {
  const accessDenied =
    attributes && !(await checkAccess(attributes.type, attributes));

  if (!accessDenied) {
    return children;
  }

  return <AuthForm type={attributes.type} shortId={attributes.shortId} />;
}
