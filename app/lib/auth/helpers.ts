import type { AccessType } from '@/definitions';

export function buildCookieName({
  type,
  shortId,
}: {
  type: AccessType;
  shortId: string;
}) {
  return [type, shortId].join('_');
}
