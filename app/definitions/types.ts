import {
  accessTypes,
  eventTypes,
  expiresAfterOptions,
  pollResultsVisibilities,
  rsvpResponses,
  rsvpVisibilities,
  shareableEntityNames,
} from './constants';

export type ShareableEntityName = (typeof shareableEntityNames)[number];

export type ExpiresAfterValue = (typeof expiresAfterOptions)[number];

export type EventType = (typeof eventTypes)[number];
export type RsvpVisibility = (typeof rsvpVisibilities)[number];
export type RsvpResponse = (typeof rsvpResponses)[number];

export type PollResultsVisibility = (typeof pollResultsVisibilities)[number];

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

// Poll
export interface Poll extends ShareableCommon {
  readonly note?: string;
  readonly resultsVisibility: PollResultsVisibility;
  readonly closesAt?: string;
  readonly questions: PollQuestion[];
}

export interface PollQuestion {
  readonly pollQuestionId: string;
  readonly title: string;
  readonly isMultiple: boolean;
  readonly isRequired: boolean;
  readonly options: PollQuestionOption[];
}

export interface PollQuestionOption {
  readonly pollQuestionOptionId: string;
  readonly label: string;
}

export interface PollVote {
  readonly shortId: string;
  readonly code: string;
  readonly name?: string;
  readonly answers: PollVoteAnswer[];
}

export interface PollVoteAnswer {
  readonly pollQuestionId: string;
  readonly optionIds: string[];
}

// Action response
export interface ActionSuccess<DataT = undefined> {
  readonly success: true;
  readonly data: DataT;
  readonly error?: undefined;
}

export interface ActionFailure {
  readonly success: false;
  readonly data?: undefined;
  readonly error: {
    code: string;
    message?: string | undefined;
  };
}

export type ActionResponse<DataT = undefined> =
  | ActionSuccess<DataT>
  | ActionFailure;
