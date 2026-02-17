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

| Attribute     | Example                |
| ------------- | ---------------------- |
| pk            | shareable#{shortId}    |
| sk            | 01#                    |
| entity        | checklist / poll / ... |
| shortId       | {shortId}              |
| name          | {string}               |
| viewPasscode  | {encrypted}            |
| adminPasscode | {encrypted}            |
| expiresAt     | {ISO date string}      |

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
  "expiresAt": "2025-01-01T12:00:00.000Z"
}
```

## Entity: checklist

### Entity-specific attributes

| Attribute | Example |
| --------- | ------- |
| note      | foo     |

## Entity: checklist_item

### Main table schema

| Field           | Type   | Example                              | Notes                |
| --------------- | ------ | ------------------------------------ | -------------------- |
| pk              | string | checklist_item#{shortId}             |                      |
| sk              | string | 01#{checklistItemId}#                |                      |
| shortId         | string | abc-def-12345                        |                      |
| checklistItemId | string | 00000000-0000-0000-0000-000000000000 | UUID                 |
| order           | number | 0                                    |                      |
| name            | string | Item 1                               |                      |
| note            | string | example                              | optional, plain text |

### Example record

```json
{
  "pk": "checklist_item#abcdef12345",
  "sk": "01#00000000000000000000000000000000#",
  "shortId": "abc-def-12345",
  "checklistItemId": "00000000-0000-0000-0000-000000000000",
  "order": 0,
  "name": "Item 1",
  "note": "example"
}
```
