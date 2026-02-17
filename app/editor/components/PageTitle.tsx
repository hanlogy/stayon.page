'use client';

import { kebabToCamel } from '@hanlogy/ts-lib';
import { notFound, usePathname } from 'next/navigation';
import { shareableEntityNames } from '@/definitions/constants';

export function PageTitle() {
  const featureKey = usePathname().replace('/editor/', '');
  const featureType = shareableEntityNames.find((e) => e === kebabToCamel(featureKey));

  if (!featureType) {
    return notFound();
  }

  const name = {
    checklist: 'Checklist',
    poll: 'Poll',
    event: 'Event',
    timeSlots: 'Time slots',
  }[featureType];

  return `Create ${name}`;
}
