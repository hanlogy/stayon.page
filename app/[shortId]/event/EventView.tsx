import { MarkdownViewer } from '@/component/MarkdownViewer';
import { Event } from '@/definitions/types';
import { RsvpListButton } from '@/[shortId]/event/RsvpListButton';
import { RsvpButton } from './RsvpButton';
import { StartTimeAndEndTime } from './StartTimeAndEndTime';

export function EventView({
  item: {
    shortId,
    name,
    startTime,
    endTime,
    location,
    // type,
    description,
    rsvpDeadline,
  },
}: {
  item: Event;
}) {
  return (
    <div className="mx-auto max-w-3xl pb-10">
      <div className="px-4">
        <div className="mb-2 text-gray-500">
          <StartTimeAndEndTime startTime={startTime} endTime={endTime} />
        </div>

        <div className="text-2xl font-semibold text-gray-800 sm:text-3xl">
          {name}
        </div>
        {location && <div className="mt-2 text-gray-600">{location}</div>}
        {rsvpDeadline && (
          <RsvpButton shortId={shortId} rsvpDeadline={rsvpDeadline} />
        )}
        <RsvpListButton className="mt-4 justify-self-end" shortId={shortId} />
      </div>

      {description && (
        <div className="mt-4 sm:mt-6 sm:px-4">
          <div className="bg-gray-50 p-4 text-gray-800 sm:rounded-2xl sm:p-6">
            <MarkdownViewer text={description} />
          </div>
        </div>
      )}
    </div>
  );
}
