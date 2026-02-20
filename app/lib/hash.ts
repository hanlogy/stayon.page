import bcrypt from 'bcryptjs';

export async function hashPasscode(passcode: string): Promise<string> {
  return bcrypt.hash(passcode, 12);
}

export async function comparePasscode({
  passcode,
  hash,
}: {
  passcode: string;
  hash: string;
}): Promise<boolean> {
  return await bcrypt.compare(passcode, hash);
}
