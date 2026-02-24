/**
 * It uses local timezone if no timezone information in the input.
 */
export function fakeSystemTime(time: string | Date | number) {
  jest.useFakeTimers().setSystemTime(new Date(time));
}
