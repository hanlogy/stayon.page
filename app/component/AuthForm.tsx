'use client';

import { SubmitEvent, useState } from 'react';
import { useForm } from '@hanlogy/react-web-ui';
import { AccessType } from '@/definitions/types';
import { login } from '@/lib/auth/login';
import { FilledButton } from './buttons';
import { createTextFieldWith } from './form/fields';

interface FormData {
  passcode: string;
}

const TextField = createTextFieldWith({ className: 'text-center' });

export function AuthForm({
  type,
  shortId,
}: {
  type: AccessType;
  shortId: string;
}) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string>();
  const { register, validate, getValues } = useForm<FormData>();

  const handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault();
    if (!validate()) {
      return;
    }

    const { passcode } = getValues();

    try {
      setIsPending(true);
      await login({ passcode, type, shortId }, true);
    } catch {
      setError('Varify failed');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form autoComplete="off" onSubmit={handleSubmit} className="text-center">
      <div className="w-60">
        <TextField
          controller={register('passcode', {
            validator: ({ passcode }) => {
              if (!passcode?.trim()) {
                return 'Enter passcode';
              }
            },
          })}
          type="password"
          placeholder="Passcode"
          maxLength={20}
        />
      </div>
      <div className="mt-4">
        <FilledButton type="submit" className="min-w-40" disabled={isPending}>
          Verify
        </FilledButton>
      </div>
      {error && <div className="my-4 text-red-600">{error}</div>}
    </form>
  );
}
