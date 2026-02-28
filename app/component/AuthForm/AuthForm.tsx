'use client';

import { SubmitEvent, useState } from 'react';
import { useForm } from '@hanlogy/react-web-ui';
import clsx from 'clsx';
import { type AccessType } from '@/definitions';
import { FilledButton } from '../buttons';
import { createTextFieldWith } from '../form/fields';
import { auth } from './action';

interface FormData {
  passcode: string;
}

const TextField = createTextFieldWith({ className: 'text-center' });

export function AuthForm({
  type,
  shortId,
  className,
}: {
  type: AccessType;
  shortId: string;
  className?: string;
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

    setIsPending(true);
    const { success, error } = await auth(type, { passcode, shortId });
    if (!success) {
      setError(error?.message ?? 'Varify failed');
    }
    setIsPending(false);
  };
  const { title, placeholder } = (() => {
    if (type === 'viewAccess') {
      return {
        title: 'Enter passcode to view',
        placeholder: 'Passcode',
      };
    }

    return {
      title: 'Enter admin passcode to manage',
      placeholder: 'Admin passcode',
    };
  })();

  return (
    <form
      autoComplete="off"
      onSubmit={handleSubmit}
      className={clsx(
        'mx-auto flex flex-col items-center text-center',
        className
      )}
    >
      <div className="mb-4 text-gray-600">{title}</div>
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
          placeholder={placeholder}
          maxLength={20}
        />
      </div>
      <div className="mt-4">
        <FilledButton type="submit" className="min-w-40" disabled={isPending}>
          Continue
        </FilledButton>
      </div>
      {error && <div className="my-4 text-red-600">{error}</div>}
    </form>
  );
}
