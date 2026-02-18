import { cookies } from 'next/headers';
import { checkAccess } from '@/lib/auth/checkAccess';
import { buildCookieName } from '@/lib/auth/helpers';
import { verifyJwt } from '@/lib/jwt';

jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}));

jest.mock('@/lib/jwt', () => ({
  verifyJwt: jest.fn(),
}));

jest.mock('@/lib/auth/helpers', () => ({
  buildCookieName: jest.fn(),
}));

type CookieStore = {
  get: (name: string) => { value: string } | undefined;
};

const cookiesMock = cookies as unknown as jest.MockedFunction<
  () => Promise<CookieStore>
>;

const verifyJwtMock = verifyJwt as jest.MockedFunction<
  (args: {
    token: string;
    secret: string;
  }) => Promise<{ id: string; claims: { version: number } } | null>
>;

const buildCookieNameMock = buildCookieName as jest.MockedFunction<
  (args: { type: 'viewAccess' | 'adminAccess'; shortId: string }) => string
>;

const createCookieStore = (
  values: Record<string, string | undefined>
): CookieStore => {
  return {
    get: (name: string) => {
      const value = values[name];
      if (!value) {
        return undefined;
      }
      return { value };
    },
  };
};

describe('checkAccess', () => {
  const originalEnv = process.env.ACCESS_SECRET;

  beforeEach(() => {
    jest.resetAllMocks();

    process.env.ACCESS_SECRET = 'x'.repeat(32);

    buildCookieNameMock.mockImplementation(
      ({ type, shortId }) => `${type}:${shortId}`
    );
  });

  afterAll(() => {
    process.env.ACCESS_SECRET = originalEnv;
  });

  test('public view', async () => {
    cookiesMock.mockResolvedValue(createCookieStore({}));
    const result = await checkAccess('viewAccess', { shortId: 'abc' });
    expect(result).toBe(true);
    expect(verifyJwtMock).not.toHaveBeenCalled();
  });

  test('public admin', async () => {
    cookiesMock.mockResolvedValue(createCookieStore({}));
    const result = await checkAccess('adminAccess', { shortId: 'abc' });
    expect(result).toBe(true);
    expect(verifyJwtMock).not.toHaveBeenCalled();
  });

  test('view token ok', async () => {
    cookiesMock.mockResolvedValue(
      createCookieStore({ 'viewAccess:abc': 'view-token' })
    );

    verifyJwtMock.mockResolvedValue({ id: 'abc', claims: { version: 2 } });

    const result = await checkAccess('viewAccess', {
      shortId: 'abc',
      viewPasscodeVersion: 2,
    });

    expect(result).toBe(true);
    expect(verifyJwtMock).toHaveBeenCalledTimes(1);
  });

  test('view token missing', async () => {
    cookiesMock.mockResolvedValue(createCookieStore({}));

    const result = await checkAccess('viewAccess', {
      shortId: 'abc',
      viewPasscodeVersion: 2,
    });

    expect(result).toBe(false);
  });

  test('view fallback to admin token - no view token', async () => {
    cookiesMock.mockResolvedValue(
      createCookieStore({
        'adminAccess:abc': 'admin-token',
      })
    );

    // First attempt (view) will fail due to missing token, then fallback uses
    // admin token.
    verifyJwtMock.mockResolvedValue({ id: 'abc', claims: { version: 7 } });

    const result = await checkAccess('viewAccess', {
      shortId: 'abc',
      viewPasscodeVersion: 2,
      adminPasscodeVersion: 7,
    });

    expect(result).toBe(true);
    expect(verifyJwtMock).toHaveBeenCalledTimes(1);
  });

  test('view invalid then admin ok', async () => {
    cookiesMock.mockResolvedValue(
      createCookieStore({
        'viewAccess:abc': 'view-token',
        'adminAccess:abc': 'admin-token',
      })
    );

    // First verification fails (view), second succeeds (admin)
    verifyJwtMock
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ id: 'abc', claims: { version: 7 } });

    const result = await checkAccess('viewAccess', {
      shortId: 'abc',
      viewPasscodeVersion: 2,
      adminPasscodeVersion: 7,
    });

    expect(result).toBe(true);
    expect(verifyJwtMock).toHaveBeenCalledTimes(2);
  });

  test('view invalid and admin invalid', async () => {
    cookiesMock.mockResolvedValue(
      createCookieStore({
        'viewAccess:abc': 'view-token',
        'adminAccess:abc': 'admin-token',
      })
    );

    verifyJwtMock.mockResolvedValue(null);

    const result = await checkAccess('viewAccess', {
      shortId: 'abc',
      viewPasscodeVersion: 2,
      adminPasscodeVersion: 7,
    });

    expect(result).toBe(false);
    expect(verifyJwtMock).toHaveBeenCalledTimes(2);
  });

  test('admin requires admin token when admin passcode exists', async () => {
    cookiesMock.mockResolvedValue(
      createCookieStore({
        'viewAccess:abc': 'view-token',
      })
    );

    const result = await checkAccess('adminAccess', {
      shortId: 'abc',
      viewPasscodeVersion: 2,
      adminPasscodeVersion: 7,
    });

    expect(result).toBe(false);
    expect(verifyJwtMock).not.toHaveBeenCalled();
  });

  test('admin granted by view token when no admin passcode', async () => {
    cookiesMock.mockResolvedValue(
      createCookieStore({
        'viewAccess:abc': 'view-token',
      })
    );

    verifyJwtMock.mockResolvedValue({ id: 'abc', claims: { version: 2 } });

    const result = await checkAccess('adminAccess', {
      shortId: 'abc',
      viewPasscodeVersion: 2,
    });

    expect(result).toBe(true);
    expect(verifyJwtMock).toHaveBeenCalledTimes(1);
  });

  test('secret too short', async () => {
    process.env.ACCESS_SECRET = 'short-secret';

    cookiesMock.mockResolvedValue(
      createCookieStore({
        'viewAccess:abc': 'view-token',
      })
    );

    const result = await checkAccess('viewAccess', {
      shortId: 'abc',
      viewPasscodeVersion: 2,
    });

    expect(result).toBe(false);
    expect(verifyJwtMock).not.toHaveBeenCalled();
  });

  test('id mismatch', async () => {
    cookiesMock.mockResolvedValue(
      createCookieStore({
        'viewAccess:abc': 'view-token',
      })
    );

    verifyJwtMock.mockResolvedValue({ id: 'other', claims: { version: 2 } });

    const result = await checkAccess('viewAccess', {
      shortId: 'abc',
      viewPasscodeVersion: 2,
    });

    expect(result).toBe(false);
  });

  test('version mismatch', async () => {
    cookiesMock.mockResolvedValue(
      createCookieStore({
        'viewAccess:abc': 'view-token',
      })
    );

    verifyJwtMock.mockResolvedValue({ id: 'abc', claims: { version: 999 } });

    const result = await checkAccess('viewAccess', {
      shortId: 'abc',
      viewPasscodeVersion: 2,
    });

    expect(result).toBe(false);
  });
});
