'use client';

import { toDate } from '@hanlogy/ts-lib';
import { isSameDay } from '@/helpers/isSameDay';
import { toLocalDateTime, toLocalTime } from '@/helpers/toLocalDateTime';

export function StartTimeAndEndTime({
  startTime,
  endTime,
}: {
  startTime: string;
  endTime?: string;
}) {
  const startTimeObj = toDate(startTime);
  const endTimeObj = endTime ? toDate(endTime) : undefined;

  const startTimeFormatted = toLocalDateTime(startTimeObj);
  if (!endTimeObj) {
    return startTimeFormatted;
  }

  const endTimeFormatted = isSameDay(startTimeObj, endTimeObj)
    ? toLocalTime(endTimeObj)
    : toLocalDateTime(endTimeObj);

  return [startTimeFormatted, endTimeFormatted].join(' - ');
}
