import {
  buildAdminPasscodeFields,
  buildViewPasscodeFields,
} from '@/dynamodb/buildPasscodeFields';
import { hashPasscode } from '@/lib/hash';

jest.mock('@/lib/hash', () => {
  return {
    hashPasscode: jest.fn(),
  };
});

const hashPasscodeMock = jest.mocked(hashPasscode);

beforeEach(() => {
  jest.clearAllMocks();
});

describe('buildViewPasscodeFields', () => {
  describe('no valid inputs', () => {
    test('empty', async () => {
      const result = await buildViewPasscodeFields({});
      expect(result).toStrictEqual({});
      expect(hashPasscodeMock).not.toHaveBeenCalled();
    });

    test('passcode undefined', async () => {
      const result = await buildViewPasscodeFields({
        passcode: undefined,
        version: 1,
      });
      expect(result).toStrictEqual({});
      expect(hashPasscodeMock).not.toHaveBeenCalled();
    });
  });

  test('delete', async () => {
    const result = await buildViewPasscodeFields({
      passcode: '1111',
      version: 1,
      isDelete: true,
    });

    expect(result).toStrictEqual({});
    expect(hashPasscodeMock).not.toHaveBeenCalled();
  });

  test('with passcode', async () => {
    hashPasscodeMock.mockResolvedValue('hashed-view');

    const result = await buildViewPasscodeFields({
      passcode: '1111',
      version: 1,
    });

    expect(result).toStrictEqual({
      viewPasscode: 'hashed-view',
      viewPasscodeVersion: 1,
    });
    expect(hashPasscodeMock).toHaveBeenCalledTimes(1);
    expect(hashPasscodeMock).toHaveBeenCalledWith('1111');
  });
});

describe('buildAdminPasscodeFields', () => {
  describe('no valid inputs', () => {
    test('missing inputs', async () => {
      const result = await buildAdminPasscodeFields({});
      expect(result).toStrictEqual({});
      expect(hashPasscodeMock).not.toHaveBeenCalled();
    });

    test('passcode undefined', async () => {
      const result = await buildAdminPasscodeFields({
        passcode: undefined,
        version: 1,
      });
      expect(result).toStrictEqual({});
      expect(hashPasscodeMock).not.toHaveBeenCalled();
    });
  });

  test('delete', async () => {
    const result = await buildAdminPasscodeFields({
      passcode: '2222',
      version: 1,
      isDelete: true,
    });

    expect(result).toStrictEqual({});
    expect(hashPasscodeMock).not.toHaveBeenCalled();
  });

  test('with passcode', async () => {
    hashPasscodeMock.mockResolvedValue('hashed-admin');

    const result = await buildAdminPasscodeFields({
      passcode: '2222',
      version: 1,
    });

    expect(result).toStrictEqual({
      adminPasscode: 'hashed-admin',
      adminPasscodeVersion: 1,
    });
    expect(hashPasscodeMock).toHaveBeenCalledTimes(1);
    expect(hashPasscodeMock).toHaveBeenCalledWith('2222');
  });
});
