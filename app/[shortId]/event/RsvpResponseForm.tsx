import { useState } from 'react';
import {
  ButtonGroup,
  clsx,
  FormFieldRegister,
  HiddenField,
} from '@hanlogy/react-web-ui';
import { CheckIcon } from 'lucide-react';
import { TextField } from '@/component/form/fields';
import { RsvpResponse } from '@/definitions/types';
import type { RsvpFormData } from './RsvpDialog';

const options = [
  { label: 'Going', value: 'going' },
  { label: 'Maybe', value: 'maybe' },
  { label: 'Not going', value: 'notGoing' },
] as const;

export function RsvpResponseForm({
  register,
}: {
  register: FormFieldRegister<RsvpFormData>;
}) {
  const [response, setResponse] = useState<RsvpResponse>('going');

  return (
    <div className="space-y-6 pb-1">
      <HiddenField defaultValue={response} controller={register('response')} />
      <ButtonGroup
        value={response}
        className="w-full"
        buttonBuilder={({ isSelected, isFirst, isLast, item }) => {
          return (
            <button
              onClick={() => setResponse(item.value)}
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
      <TextField controller={register('name')} label="Your Name" />
      {response !== 'notGoing' && (
        <>
          <TextField
            type="number"
            controller={register('guestCount')}
            label="How many others are with you?"
          />
        </>
      )}
    </div>
  );
}
