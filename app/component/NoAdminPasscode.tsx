import { LazyLink } from './LazyLink';

export function NoAdminPasscode({ shortId }: { shortId: string }) {
  return (
    <div className="text-center">
      <div className="mt-4 mb-2 font-medium text-gray-600">Access Denied</div>
      <div className="text-gray-500">You do not have an admin passcode</div>
      <div className="py-6 text-gray-500">
        <LazyLink
          href={`/${shortId}`}
          className="mt-2 rounded-full border border-gray-300 px-6 py-3 hover:bg-gray-100"
        >
          Continue with view passcode
        </LazyLink>
      </div>
    </div>
  );
}
