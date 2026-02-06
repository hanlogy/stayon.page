import clsx from 'clsx';
import {
  BalloonIcon,
  CalendarClockIcon,
  CircleQuestionMarkIcon,
  ListChecksIcon,
} from 'lucide-react';
import Link from 'next/link';

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
    description: 'Ask a question, collect votes.',
    path: 'poll',
  },
  {
    name: 'Event',
    icon: <BalloonIcon />,
    description: 'Share details and get RSVPs.',
    path: 'event',
  },
  {
    name: 'Time slots',
    icon: <CalendarClockIcon />,
    description: 'Offer slots, others pick one.',
    path: 'time-slots',
  },
] as const;

export function CreateCards() {
  return (
    <>
      {options.map(({ name, description, path, icon }) => {
        return (
          <Link
            href={`/editor/${path}`}
            key={path}
            className={clsx(
              'block rounded-2xl bg-white p-4 transition lg:p-6',
              'hover:shadow-lg hover:shadow-gray-100',
              'active:shadow-lg active:shadow-gray-100'
            )}
          >
            <div className="mb-2 flex items-center space-x-2">
              {icon}
              <h3 className="text-xl">{name}</h3>
            </div>
            <p className="text-gray-500">{description}</p>
          </Link>
        );
      })}
    </>
  );
}
