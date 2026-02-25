export const shareableEntityNames = [
  'checklist',
  'poll',
  'event',
  'timeSlots',
] as const;

export const accessTypes = ['adminAccess', 'viewAccess'] as const;
export const expiresAfterOptions = ['1', '7', '30'] as const;

// everyone means anyone who has the view access.
export const rsvpVisibilities = ['everyone', 'private'] as const;
export const rsvpResponses = ['going', 'notGoing', 'maybe'] as const;
export const eventTypes = ['inPerson', 'virtual'] as const;

export const pollResultsVisibilities = [
  'always',
  'afterSubmit',
  'afterClose',
] as const;
