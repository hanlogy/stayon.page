import { toDate } from '@hanlogy/ts-lib';
import { toLocalISODateTime } from '@/helpers/toLocalISODateTime';

export function transformDateTime(input?: string | undefined) {
  if (!input) {
    return '';
  }

  return new Date(input).toISOString();
}

export function normalizeDateTime(input?: string | undefined): string {
  return input ? toLocalISODateTime(toDate(input)).dateTime : '';
}
