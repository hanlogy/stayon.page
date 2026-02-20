import { grantAccessIfNeeded } from '@/dynamodb/grantAccessIfNeeded';
import { grantAccess } from '@/lib/auth/grantAccess';

jest.mock('@/lib/auth/grantAccess', () => {
  return {
    grantAccess: jest.fn(),
  };
});

const mockedGrantAccess = jest.mocked(grantAccess);

beforeEach(() => {
  mockedGrantAccess.mockReset();
  mockedGrantAccess.mockImplementation(async () => {
    return;
  });
});

test('no accesses is needed', async () => {
  await grantAccessIfNeeded({
    forViewAccess: false,
    forAdminAccess: false,
    shortId: 'abc',
    version: 1,
  });

  expect(mockedGrantAccess).not.toHaveBeenCalled();
});

test('need view access', async () => {
  await grantAccessIfNeeded({
    forViewAccess: true,
    forAdminAccess: false,
    shortId: 'abc',
    version: 1,
  });

  expect(mockedGrantAccess).toHaveBeenCalledTimes(1);
  expect(mockedGrantAccess).toHaveBeenCalledWith({
    type: 'viewAccess',
    shortId: 'abc',
    version: 1,
  });
});

test('need admin access', async () => {
  await grantAccessIfNeeded({
    forViewAccess: false,
    forAdminAccess: true,
    shortId: 'abc',
    version: 1,
  });

  expect(mockedGrantAccess).toHaveBeenCalledTimes(1);
  expect(mockedGrantAccess).toHaveBeenCalledWith({
    type: 'adminAccess',
    shortId: 'abc',
    version: 1,
  });
});

test('need both access', async () => {
  await grantAccessIfNeeded({
    forViewAccess: true,
    forAdminAccess: true,
    shortId: 'abc',
    version: 1,
  });

  expect(mockedGrantAccess).toHaveBeenCalledTimes(1);
  expect(mockedGrantAccess).toHaveBeenCalledWith({
    type: 'adminAccess',
    shortId: 'abc',
    version: 1,
  });
});
