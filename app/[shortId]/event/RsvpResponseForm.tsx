import { useState } from 'react';
import {
  ButtonGroup,
  clsx,
  FormFieldRegister,
  FormSetFieldValue,
  HiddenField,
} from '@hanlogy/react-web-ui';
import { CheckIcon } from 'lucide-react';
import { TextField } from '@/component/form/fields';
import { EventRsvp, RsvpResponse } from '@/definitions/types';
import { safeParseField } from '@/helpers/schemaHelpers';
import type { RsvpFormData } from './actions';
import { rsvpNameSchema } from './schema';

const options = [
  { label: 'Going', value: 'going' },
  { label: 'Maybe', value: 'maybe' },
  { label: 'Not going', value: 'notGoing' },
] as const;

export function RsvpResponseForm({
  register,
  setFieldValue,
  rsvp,
}: {
  rsvp?: EventRsvp;
  setFieldValue: FormSetFieldValue<RsvpFormData>;
  register: FormFieldRegister<RsvpFormData>;
}) {
  const [response, setResponse] = useState<RsvpResponse>(
    rsvp?.response ?? 'going'
  );

  return (
    <form autoComplete="off" className="space-y-6 pb-1">
      {rsvp && (
        <div className="text-center">
          <span className="text-gray-500">RSVP Code:</span>{' '}
          <span className="font-semibold">{rsvp.code}</span>
        </div>
      )}
      <HiddenField defaultValue={response} controller={register('response')} />
      <ButtonGroup
        value={response}
        className="w-full"
        buttonBuilder={({ isSelected, isFirst, isLast, item }) => {
          return (
            <button
              onClick={() => {
                setResponse(item.value);
                setFieldValue('response', item.value);
              }}
              key={item.value}
              type="button"
              className={clsx(
                'inline-flex-center flex h-10',
                {
                  'rounded-l-full': isFirst,
                  'rounded-r-full': isLast,
                },
                isSelected
                  ? 'bg-gray-500 text-white'
                  : 'cursor-pointer bg-gray-100 text-gray-500 hover:bg-gray-200'
              )}
            >
              {isSelected && <CheckIcon size={18} className="mr-2" />}
              {item.label}
            </button>
          );
        }}
        items={options}
      />
      <TextField
        defaultValue={rsvp?.name}
        controller={register('name', {
          validator: ({ name }) => {
            const { error } = safeParseField(rsvpNameSchema, name);
            return error;
          },
        })}
        label="Your Name"
      />
      {response !== 'notGoing' && (
        <>
          <TextField
            defaultValue={rsvp?.guestCount}
            type="number"
            controller={register('guestCount')}
            label="How many others are with you?"
          />
        </>
      )}
    </form>
  );
}
