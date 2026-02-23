'use client';

import { useDialog } from '@hanlogy/react-web-ui';
import { toDate } from '@hanlogy/ts-lib';
import { RsvpDialog } from './RsvpDialog';

export function RsvpButton({ rsvpDeadline }: { rsvpDeadline: string }) {
  const { openDialog } = useDialog();

  const handleRsvp = () => {
    openDialog(({ closeDialog }) => <RsvpDialog closeDialog={closeDialog} />);
  };

  const dateTime = toDate(rsvpDeadline).toLocaleString([], {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  return (
    <div className="mt-3">
      <button
        onClick={() => handleRsvp()}
        className="cursor-pointer rounded-lg bg-gray-700 px-6 py-2 text-white hover:bg-gray-800"
      >
        RSVP
      </button>
      <div className="mt-1 text-sm text-gray-500">
        Please respond before {dateTime}
      </div>
    </div>
  );
}
