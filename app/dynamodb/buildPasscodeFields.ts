import { hashPasscode } from '@/lib/hash';

interface Input {
  passcode?: string;
  version?: number;
  isDelete?: boolean;
}

interface Fields {
  passcode: 'viewPasscode' | 'adminPasscode';
  version: 'viewPasscodeVersion' | 'adminPasscodeVersion';
}

async function buildPasscodeFields(
  { passcode: passcodeField, version: versionField }: Fields,
  { passcode, version, isDelete }: Input
) {
  if (isDelete || !passcode || version === undefined) {
    return {};
  }

  return {
    [passcodeField]: await hashPasscode(passcode),
    [versionField]: version,
  };
}

export async function buildViewPasscodeFields(input: Input) {
  return await buildPasscodeFields(
    {
      passcode: 'viewPasscode',
      version: 'viewPasscodeVersion',
    },
    input
  );
}

export async function buildAdminPasscodeFields(input: Input) {
  return await buildPasscodeFields(
    {
      passcode: 'adminPasscode',
      version: 'adminPasscodeVersion',
    },
    input
  );
}
