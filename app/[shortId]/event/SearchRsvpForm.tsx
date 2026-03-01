import { useState } from 'react';
import { InputLabel, TextInput } from '@hanlogy/react-web-ui';
import { FilledButton } from '@/component/buttons';
import type { EventRsvp } from '@/definitions';
import { searchRsvp } from './actions';

export function SearchRsvpForm({
  shortId,
  onSuccess,
}: {
  shortId: string;
  onSuccess: (data: EventRsvp) => void;
}) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleFind = async () => {
    if (!code) {
      return;
    }
    setError('');

    const { error, data } = await searchRsvp({ code, shortId });
    if (error) {
      setError(error.message ?? '');
    }

    if (!data) {
      return;
    }

    onSuccess(data);
  };

  return (
    <div className="pt-2 pb-4">
      <InputLabel className="mb-2 text-gray-600">
        Enter your RSVP code to update.
      </InputLabel>
      <div className="flex">
        <div className="mr-2 flex-1">
          <TextInput
            onChange={(e) => {
              setCode(e.currentTarget.value);
            }}
            placeholder="RSVP code"
            className="rounded-xl border border-gray-200 bg-gray-50"
          />
        </div>
        <FilledButton
          disabled={!code.trim()}
          onClick={handleFind}
          size="medium"
        >
          Find
        </FilledButton>
      </div>
      {error && <div className="pt-2 text-red-600">{error}</div>}
    </div>
  );
}
