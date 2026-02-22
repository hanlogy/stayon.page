import { Event } from '@/definitions/types';

export function EventView({ item: { name } }: { item: Event }) {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-10">
      <div className="text-center text-xl text-gray-700">{name}</div>
    </div>
  );
}
