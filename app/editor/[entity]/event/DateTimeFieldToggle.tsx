import { MouseEventHandler } from 'react';
import { AddOrRemoveFieldToggle } from '@/editor/components/AddOrRemoveFieldToggle';

export function DateTimeFieldToggle({
  field,
  isAdd,
  onClick,
}: {
  field: 'endTime' | 'rsvpDeadline';
  isAdd: boolean;
  onClick: MouseEventHandler;
}) {
  const label = field === 'endTime' ? 'End date and time' : 'RSVP deadline';

  return (
    <AddOrRemoveFieldToggle label={label} isAdd={isAdd} onClick={onClick} />
  );
}
