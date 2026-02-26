import { useState } from 'react';
import { CloseDialogFn, useForm } from '@hanlogy/react-web-ui';
import { Dialog } from '@/component/Dialog';
import { FilledButton, TextButton } from '@/component/buttons';
import { TextField } from '@/component/form/fields';
import { PollVoteAnswer } from '@/definitions/types';
import { saveVote } from './actions';

interface FormData {
  name?: string;
}

export function VoteDialog({
  closeDialog,
  shortId,
  answers,
}: {
  closeDialog: CloseDialogFn<string>;
  answers: PollVoteAnswer[];
  shortId: string;
}) {
  const { register, validate, getValues } = useForm<FormData>();
  const [error, setError] = useState<string | undefined>();

  const handleSubmit = async () => {
    if (!validate()) {
      return;
    }

    const name = getValues().name;
    if (!name) {
      return;
    }

    const { error } = await saveVote({ shortId, answers, name });
    if (error) {
      setError('Something is wrong');
    }
  };

  return (
    <Dialog
      title="Confirm to vote"
      actions={
        <>
          <FilledButton onClick={handleSubmit}>Submit</FilledButton>
          <TextButton onClick={() => closeDialog()}>Close</TextButton>
        </>
      }
    >
      <TextField
        autoComplete="off"
        label="Your name"
        controller={register('name', {
          validator: ({ name }) => {
            if (!name?.trim()) {
              return 'Name is required';
            }
          },
        })}
      />
      {error && (
        <div className="pt-6 pb-2 text-center text-red-600">{error}</div>
      )}
    </Dialog>
  );
}
