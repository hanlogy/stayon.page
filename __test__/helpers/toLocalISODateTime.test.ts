import { toLocalISODateTime } from '@/helpers/toLocalISODateTime';

describe('date helpers', () => {
  afterEach(() => jest.useRealTimers());

  describe('toLocalISODateTime', () => {
    test('All good', () => {
      const { date, time, dateTime } = toLocalISODateTime(
        new Date('2025-08-20T12:00:00+08:00')
      );
      expect(date).toBe('2025-08-20');
      expect(time).toBe('06:00');
      expect(dateTime).toBe('2025-08-20T06:00');
    });
  });
});
