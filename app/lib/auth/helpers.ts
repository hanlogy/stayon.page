import { AccessType } from '@/definitions/types';

export function buildCookieName({
  type,
  shortId,
}: {
  type: AccessType;
  shortId: string;
}) {
  return [type, shortId].join('_');
}
