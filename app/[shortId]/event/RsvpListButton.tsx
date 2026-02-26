'use client';

import { useEffect, useState } from 'react';
import { CloseDialogFn, useDialog } from '@hanlogy/react-web-ui';
import clsx from 'clsx';
import { UsersIcon } from 'lucide-react';
import { Dialog } from '@/component/Dialog';
import { TextButton } from '@/component/buttons';
import { EventRsvp, RsvpResponse } from '@/definitions/types';
import { fetchRsvpList } from './actions';

export function RsvpListButton({
  shortId,
  className,
}: {
  shortId: string;
  className?: string;
}) {
  const { openDialog } = useDialog();

  return (
    <button
      className={clsx('flex-center', className)}
      onClick={() => {
        openDialog(({ closeDialog }) => (
          <RsvpListDialog closeDialog={closeDialog} shortId={shortId} />
        ));
      }}
    >
      <UsersIcon size={18} className="mr-1 text-green-600" />
      <span className="text-sm font-semibold">RSVP List</span>
    </button>
  );
}

function RsvpListDialog({
  closeDialog,
  shortId,
}: {
  closeDialog: CloseDialogFn;
  shortId: string;
}) {
  const [rsvpList, setRsvpList] = useState<EventRsvp[] | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await fetchRsvpList(shortId);
      setRsvpList(data ?? []);
    })();
  }, [shortId]);

  return (
    <Dialog
      title="RSVP list"
      actions={<TextButton onClick={() => closeDialog()}>Close</TextButton>}
    >
      {rsvpList && (
        <div className="space-y-3">
          {rsvpList && !rsvpList.length && (
            <div className="text-gray-500 italic">Empty</div>
          )}
          {rsvpList.map(({ code, name, guestCount, response }) => {
            return (
              <div
                key={code}
                className="flex justify-between border-b border-b-gray-200 last:border-b-0"
              >
                <div className="flex pb-3">
                  <span
                    className={clsx({
                      'text-gray-800': response !== 'notGoing',
                      'text-gray-600': response === 'notGoing',
                    })}
                  >
                    {name}
                  </span>
                  {guestCount && (
                    <span className="ml-1 text-sm text-green-600">
                      +{guestCount}
                    </span>
                  )}
                </div>

                <RsvpResponseBadge response={response} />
              </div>
            );
          })}
        </div>
      )}
    </Dialog>
  );
}

function RsvpResponseBadge({ response }: { response: RsvpResponse }) {
  let text: string;
  if (response === 'going') {
    text = 'Yes';
  } else if (response === 'maybe') {
    text = 'Maybe';
  } else {
    text = 'No';
  }
  return (
    <div
      className={clsx('text-sm', {
        'text-red-500': response === 'notGoing',
      })}
    >
      {text}
    </div>
  );
}
