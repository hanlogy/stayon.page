import type {
  Checklist,
  Event,
  EventRsvp,
  Poll,
  PollVote,
  ShareableCommon,
} from '@/definitions';

// The user provided fields.
export type ShareableCreateFields = Pick<
  ShareableCommon,
  'name' | 'expiresAfter'
> & {
  readonly viewPasscode?: string;
  readonly adminPasscode?: string;
};

export type ShareableUpdateFields = Pick<
  ShareableCommon,
  'name' | 'expiresAfter'
> & {
  readonly viewPasscode?: string;
  readonly adminPasscode?: string;
  readonly deleteViewPasscode?: boolean;
  readonly deleteAdminPasscode?: boolean;
};

export type ChecklistCreateFields = ShareableCreateFields &
  Pick<Checklist, 'note' | 'items'>;

export type ChecklistUpdateFields = ShareableUpdateFields &
  Pick<Checklist, 'note' | 'items'>;

export type EventCreateFields = ShareableCreateFields &
  Pick<
    Event,
    | 'startTime'
    | 'endTime'
    | 'type'
    | 'location'
    | 'description'
    | 'rsvpDeadline'
    | 'rsvpVisibility'
  >;

export type EventUpdateFields = ShareableUpdateFields &
  Pick<
    Event,
    | 'startTime'
    | 'endTime'
    | 'type'
    | 'location'
    | 'description'
    | 'rsvpDeadline'
    | 'rsvpVisibility'
  >;

export type RsvpCreateFields = Omit<EventRsvp, 'code'>;

export type RsvpUpdateFields = EventRsvp;

// Poll
export type PollCreateFields = ShareableCreateFields &
  Pick<Poll, 'note' | 'questions' | 'closesAt' | 'resultsVisibility'>;

export type PollUpdateFields = ShareableUpdateFields &
  Pick<Poll, 'note' | 'questions' | 'closesAt' | 'resultsVisibility'>;

export type ShareableEntity<T extends ShareableCommon = ShareableCommon> = T & {
  readonly pk: string;
  readonly sk: string;
  readonly viewPasscode?: string;
  readonly adminPasscode?: string;
};

/**
 * In our use cases, this type has the same runtime value shape as `T`
 * (for example, when `T` is `Checklist`).
 *
 * However, before TypeScript knows the concrete `T`, it cannot guarantee that
 * a generic `T` does not also declare the stripped keys (`pk`, `sk`,
 * `viewPasscode`, `adminPasscode`).
 *
 * Returning an explicit `Omit<...>` keeps the return type safe and accurate.
 *
 * ### Example:
 * ```
 * const item: Checklist = await new DBShareableHelper().getItem<Checklist>(...)
 * ```
 * does not complain, because `ShareableEntityStripped<Checklist>` is
 * structurally compatible with `Checklist` in our current type definitions.
 */
export type ShareableEntityStripped<
  T extends ShareableCommon = ShareableCommon,
> = Omit<ShareableEntity<T>, 'viewPasscode' | 'adminPasscode' | 'pk' | 'sk'>;

export type VoteCreateFields = Omit<PollVote, 'code'>;

export interface DBShareableRepository<T extends ShareableCommon> {
  getItem: ({ shortId }: { shortId: string }) => Promise<T | undefined>;
}
