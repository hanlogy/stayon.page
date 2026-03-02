# Table Design

We use a single-table design for the primary data model, with a few dedicated
helper tables to keep the main table clean and predictable.

## Conventions

- **pk (Partition Key):** prefixed with the entity name.
- **sk (Sort Key):** starts with a version and ends with a trailing `#` for
  consistency.
- **Normalization:**
  - Static segments in `pk`/`sk` are **UPPERCASE**
  - Dynamic/computed segments are **lowercase**, with spaces and `-` removed

## ShortIdPool (dedicated table)

Used to reserve a unique ShortId for an entity. The entry is deleted once
claimed.

| Field | Type   | Example       | Notes         |
| ----- | ------ | ------------- | ------------- |
| pk    | number | 99            | Range: 0–999  |
| sk    | string | available#01  | Bucket marker |
| id    | string | AAA-AAA-00000 | The ShortId   |

## Common attributes for all shareable entities

Expired entities are retained for **1 year** unless deleted by the user. Admins
can still access the content and clone it into a new shareable entity.

### Main table schema

| Attribute            | Example                |
| -------------------- | ---------------------- |
| pk                   | shareable#{shortId}    |
| sk                   | 01#                    |
| entity               | checklist / poll / ... |
| shortId              | {shortId}              |
| name                 | {string}               |
| viewPasscode         | {encrypted}            |
| adminPasscode        | {encrypted}            |
| viewPasscodeVersion  | {number}               |
| adminPasscodeVersion | {number}               |
| expiresAfter         | {1/7/30}               |

### Example record

```json
{
  "pk": "shareable#abcdef12345",
  "sk": "01#",
  "entity": "checklist",
  "shortId": "abc-def-12345",
  "name": "My shopping list",
  "viewPasscode": "***",
  "adminPasscode": "***",
  "viewPasscodeVersion": 1771415202059,
  "adminPasscodeVersion": 1771415202059,
  "expiresAfter": 7
}
```

## Entity: checklist

### Entity-specific attributes

| Attribute | Example |
| --------- | ------- |
| note      | foo     |
| items     | []      |

### item object

| Field           | Type   | Example                              | Notes                |
| --------------- | ------ | ------------------------------------ | -------------------- |
| checklistItemId | string | 00000000-0000-0000-0000-000000000000 | UUID                 |
| name            | string | Item 1                               |                      |
| note            | string | example                              | optional, plain text |

### Example record

```json
{
  "name": "Shopping list",
  "items": [
    {
      "checklistItemId": "00000000-0000-0000-0000-000000000000",
      "name": "Item 1",
      "note": "example"
    }
  ]
}
```

## Entity: event

### Entity-specific attributes

| Field          | Type             |
| -------------- | ---------------- |
| startTime      | string           |
| endTime        | string           |
| type           | inPerson/Virtual |
| location       | string           |
| description    | string           |
| isRsvpRequired | boolean          |
| rsvpDeadline   | string           |
| rsvpVisibility | RsvpVisibility   |

## Entity: event_rsvp

### Table design

| Field      | Value                  |
| ---------- | ---------------------- |
| pk         | event_rsvp#shortId     |
| sk         | 01#{code}#             |
| shortId    | string                 |
| code       | string                 |
| name       | string                 |
| response   | {going/notGoing/maybe} |
| guestCount | number                 |

## Entity: poll (multi-question)

### Entity-specific attributes

| Field             | Type                              |
| ----------------- | --------------------------------- |
| note              | string                            |
| resultsVisibility | always / afterSubmit / afterClose |
| closesAt          | string(ISO)                       |
| questions         | PollQuestion[]                    |
| isClosed          | boolean                           |

### PollQuestion object

| Field          | Type                 |
| -------------- | -------------------- |
| pollQuestionId | UUID                 |
| title          | string               |
| isMultiple     | boolean              |
| isRequired     | boolean              |
| options        | PollQuestionOption[] |

### PollQuestionOption object

| Field                | Type   |
| -------------------- | ------ |
| pollQuestionOptionId | UUID   |
| label                | string |

## Entity: poll_vote

### Table design

| Field     | Value             |
| --------- | ----------------- |
| pk        | poll_vote#shortId |
| sk        | 01#{code}#        |
| shortId   | string            |
| name      | string?           |
| code      | string            |
| answers   | PollAnswer[]      |
| createdAt | string (ISO)      |
| updatedAt | string (ISO)      |

### PollAnswer object

| Field          | Type   |
| -------------- | ------ |
| pollQuestionId | UUID   |
| optionIds      | UUID[] |
