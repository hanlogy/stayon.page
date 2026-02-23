import { MouseEventHandler } from 'react';
import { MinusIcon, PlusIcon } from 'lucide-react';

export function DateTimeFieldToggle({
  field,
  isAdd,
  onClick,
}: {
  field: 'endTime' | 'rsvpDeadline';
  isAdd: boolean;
  onClick: MouseEventHandler;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-3 flex cursor-pointer items-center text-sm font-medium text-blue-500 hover:text-blue-800"
    >
      {isAdd ? (
        <PlusIcon className="mr-1" size={16} />
      ) : (
        <MinusIcon className="mr-1" size={16} />
      )}
      {field === 'endTime' && 'End date and time'}
      {field === 'rsvpDeadline' && 'RSVP deadline'}
    </button>
  );
}
