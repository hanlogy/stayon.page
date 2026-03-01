import { searchParamsToStringRecord } from '@/helpers/searchParamsToStringRecord';

describe('searchParamsToStringRecord', () => {
  test('empty', () => {
    expect(searchParamsToStringRecord({})).toStrictEqual({});
  });

  test('all good', () => {
    expect(
      searchParamsToStringRecord({
        a: '',
        b: 2,
        c: true,
        d: ['1', '2'],
        e: undefined,
        x: 'foo',
      })
    ).toStrictEqual({
      x: 'foo',
    });
  });
});
