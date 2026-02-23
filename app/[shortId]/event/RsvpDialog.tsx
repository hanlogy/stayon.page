import { useState } from 'react';
import { CloseDialogFn, useForm } from '@hanlogy/react-web-ui';
import { ChevronLeft } from 'lucide-react';
import { Dialog } from '@/component/Dialog';
import { FilledButton, OutlinedButton, TextButton } from '@/component/buttons';
import { RsvpResponse } from '@/definitions/types';
import { RsvpResponseForm } from './RsvpResponseForm';
import { SearchRsvpForm } from './SearchRsvpForm';

export interface RsvpFormData {
  name: string;
  guestCount?: string;
  response: RsvpResponse;
}
export function RsvpDialog({ closeDialog }: { closeDialog: CloseDialogFn }) {
  const { register } = useForm<RsvpFormData>();
  const [isRetrieve, setIsRetrieve] = useState(false);

  return (
    <Dialog
      title={isRetrieve ? 'Find RSVP' : 'RSVP'}
      actions={
        <>
          {!isRetrieve && <FilledButton>Save</FilledButton>}
          {isRetrieve && (
            <OutlinedButton
              onClick={() => setIsRetrieve(false)}
              icon={<ChevronLeft />}
            >
              Back
            </OutlinedButton>
          )}
          <TextButton onClick={() => closeDialog()}>Close</TextButton>
        </>
      }
    >
      {isRetrieve ? (
        <SearchRsvpForm />
      ) : (
        <>
          <RsvpResponseForm register={register} />
          <div className="mt-4">
            <span className="text-gray-500">Already Rsvp?</span>
            <button
              type="button"
              className="ml-2 cursor-pointer font-semibold"
              onClick={() => setIsRetrieve(true)}
            >
              Change Rsvp
            </button>
          </div>
        </>
      )}
    </Dialog>
  );
}
