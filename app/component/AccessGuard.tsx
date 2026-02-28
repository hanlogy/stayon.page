import { PropsWithChildren, ReactNode } from 'react';
import type { AccessType } from '@/definitions';
import { checkAccess } from '@/lib/auth/checkAccess';
import { AuthForm } from './AuthForm/AuthForm';
import { Layout } from './Layout';
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

  let content: ReactNode;

  if (attributes.type === 'adminAccess' && !attributes.adminPasscodeVersion) {
    content = (
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
  } else {
    content = <AuthForm type={attributes.type} shortId={attributes.shortId} />;
  }

  return (
    <Layout>
      <title>Access Denied</title>
      {content}
    </Layout>
  );
}
