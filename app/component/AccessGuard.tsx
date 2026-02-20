import { PropsWithChildren } from 'react';
import { AccessType } from '@/definitions/types';
import { checkAccess } from '@/lib/auth/checkAccess';
import { AuthForm } from './AuthForm/AuthForm';
import { LazyLink } from './LazyLink';

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

  if (attributes.type === 'adminAccess' && !attributes.adminPasscodeVersion) {
    return (
      <div className="text-center">
        <div className="mt-4 mb-2 font-medium text-gray-600">Access Denied</div>
        <div className="text-gray-500">You do not have an admin password</div>
        <div className="py-6 text-gray-500">
          <LazyLink
            href={`/${attributes.shortId}`}
            className="mt-2 rounded-full border border-gray-300 px-6 py-3 hover:bg-gray-100"
          >
            Continue with view passcode
          </LazyLink>
        </div>
      </div>
    );
  }

  return <AuthForm type={attributes.type} shortId={attributes.shortId} />;
}
