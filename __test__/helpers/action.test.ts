import { toActionFailure, toActionSuccess } from '@/helpers/action';

describe('toActionSuccess', () => {
  test('no success data', () => {
    expect(toActionSuccess()).toStrictEqual({
      success: true,
      data: undefined,
    });
  });

  test('with success data', () => {
    expect(toActionSuccess<{ name: string }>({ name: 'foo' })).toStrictEqual({
      success: true,
      data: { name: 'foo' },
    });
  });
});

describe('toActionFailure', () => {
  test('no error data', () => {
    expect(toActionFailure()).toStrictEqual({
      success: false,
      error: {
        code: 'unknown',
        data: undefined,
        message: undefined,
      },
    });
  });

  test('with error data', () => {
    expect(
      toActionFailure<{ name: string }>({
        code: 'notFound',
        data: { name: 'foo' },
      })
    ).toStrictEqual({
      success: false,
      error: {
        code: 'notFound',
        message: undefined,
        data: { name: 'foo' },
      },
    });
  });
});
