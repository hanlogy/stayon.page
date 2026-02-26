import clsx from 'clsx';
import {
  BalloonIcon,
  CalendarClockIcon,
  CircleQuestionMarkIcon,
  ListChecksIcon,
} from 'lucide-react';
import { LazyLink } from '@/component/LazyLink';

const options = [
  {
    name: 'Checklist',
    icon: <ListChecksIcon />,
    description: 'List tasks and tick them off.',
    path: 'checklist',
  },
  {
    name: 'Poll',
    icon: <CircleQuestionMarkIcon />,
    description: 'Ask one or more questions, collect votes.',
    path: 'poll',
  },
  {
    name: 'Event',
    icon: <BalloonIcon />,
    description: 'Share details and collect RSVPs.',
    path: 'event',
  },
  {
    name: 'Time slots',
    icon: <CalendarClockIcon />,
    description: 'Propose times, others pick what works.',
    path: 'time-slots',
  },
] as const;

export function CreateCards() {
  return (
    <>
      {options.map(({ name, description, path, icon }) => {
        return (
          <LazyLink
            href={`/editor/${path}`}
            key={path}
            className={clsx(
              'block rounded-2xl border border-white bg-white p-4 transition lg:p-6',
              'hover:border-gray-200 hover:shadow-lg hover:shadow-gray-200',
              'active:border-gray-200 active:shadow-lg active:shadow-gray-200'
            )}
          >
            <div className="mb-2 flex items-center space-x-2">
              {icon}
              <h3 className="text-xl">{name}</h3>
            </div>
            <p className="text-gray-500">{description}</p>
          </LazyLink>
        );
      })}
    </>
  );
}
