import {
  accessTypes,
  eventTypes,
  expiresAfterOptions,
  rsvpResponses,
  rsvpVisibilities,
  shareableEntityNames,
} from './constants';

export type ShareableEntityName = (typeof shareableEntityNames)[number];

export type ExpiresAfterValue = (typeof expiresAfterOptions)[number];

export type EventType = (typeof eventTypes)[number];
export type RsvpVisibility = (typeof rsvpVisibilities)[number];
export type RsvpResponse = (typeof rsvpResponses)[number];

export type YesOrNo = 'yes' | 'no';

export type AccessType = (typeof accessTypes)[number];

export interface ShareableCommon {
  readonly shortId: string;
  readonly name: string;
  readonly entity: ShareableEntityName;
  readonly expiresAfter: number;
  readonly viewPasscodeVersion?: number;
  readonly adminPasscodeVersion?: number;
}

// Checklist
export interface ChecklistItem {
  readonly checklistItemId: string;
  readonly name: string;
  readonly note?: string;
}

export interface Checklist extends ShareableCommon {
  readonly note?: string;
  readonly items: readonly ChecklistItem[];
}

// Event
export interface Event extends ShareableCommon {
  readonly startTime: string;
  readonly endTime?: string;
  readonly type?: EventType;
  readonly location?: string;
  readonly description?: string;
  readonly rsvpDeadline?: string;
  readonly rsvpVisibility?: RsvpVisibility;
  readonly rsvpList?: readonly EventRsvp[];
}

export interface EventRsvp {
  readonly shortId: string;
  readonly code: string;
  readonly response: RsvpResponse;
  readonly name: string;
  readonly guestCount?: number;
}

export interface ActionSuccess<DataT = undefined> {
  readonly success: true;
  readonly data?: DataT | undefined;
  readonly error?: undefined;
}

export interface ActionError {
  readonly success: false;
  readonly data?: undefined;
  readonly error: {
    code: string;
    message?: string | undefined;
  };
}

export type ActionResponse<DataT = undefined> =
  | ActionSuccess<DataT>
  | ActionError;
