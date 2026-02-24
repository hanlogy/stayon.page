import { ReactNode, useState } from 'react';
import { CloseDialogFn, useForm } from '@hanlogy/react-web-ui';
import { ChevronLeft } from 'lucide-react';
import { Dialog } from '@/component/Dialog';
import { FilledButton, OutlinedButton, TextButton } from '@/component/buttons';
import { EventRsvp } from '@/definitions/types';
import { RsvpConfirmedView } from './RsvpConfirmedView';
import { RsvpResponseForm } from './RsvpResponseForm';
import { SearchRsvpForm } from './SearchRsvpForm';
import { saveRsvp, type RsvpFormData } from './actions';

export function RsvpDialog({
  closeDialog,
  shortId,
}: {
  closeDialog: CloseDialogFn;
  shortId: string;
}) {
  const { register, getValues, validate, setValues } = useForm<RsvpFormData>();
  const [isRetrieve, setIsRetrieve] = useState(false);
  const [rsvpToUpdate, setRsvpToUpdate] = useState<EventRsvp | undefined>(
    undefined
  );
  const [error, setError] = useState('');
  const [successResponse, setSuccessResponse] = useState<
    { code: string } | undefined
  >(undefined);

  const handleSubmit = async () => {
    setError('');
    if (!validate()) {
      return;
    }

    const { data, error } = await saveRsvp(
      { shortId, code: rsvpToUpdate?.code },
      getValues()
    );
    if (error || !data) {
      // TODO: Handle error
      setError('Something is wrong');
      return;
    }

    setSuccessResponse({ code: data.code });
  };

  let content: ReactNode;
  let title = 'RSVP';

  if (successResponse && !rsvpToUpdate) {
    title = 'RSVP Confirmed';
    content = <RsvpConfirmedView code={successResponse.code} />;
  } else if (successResponse && rsvpToUpdate) {
    title = 'RSVP Updated';
    content = (
      <div className="py-4">Your RSVP has been updated successfully.</div>
    );
  } else if (isRetrieve) {
    content = (
      <SearchRsvpForm
        onSuccess={(e) => {
          setRsvpToUpdate(e);
          setIsRetrieve(false);
          setValues({
            response: e.response,
            name: e.name,
            guestCount: e.guestCount ? String(e.guestCount) : '',
          });
        }}
        shortId={shortId}
      />
    );
  } else {
    if (rsvpToUpdate) {
      title = 'Update RSVP';
    }
    content = (
      <>
        <RsvpResponseForm rsvp={rsvpToUpdate} register={register} />
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
    );
  }

  return (
    <Dialog
      title={title}
      actions={
        <>
          {!isRetrieve && !successResponse && (
            <FilledButton onClick={() => handleSubmit()}>
              {rsvpToUpdate ? 'Update' : 'Save'}
            </FilledButton>
          )}
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
      <>
        {content}
        {error && <div className="mt-4 text-center text-red-600">{error}</div>}
      </>
    </Dialog>
  );
}
