import { SignJWT, jwtVerify, type JWTPayload } from 'jose';

export async function generateJwt(params: {
  id: string;
  secret: string;
  expiresInSeconds?: number;
  claims?: Record<string, unknown>;
}): Promise<string> {
  const { id, secret, expiresInSeconds = 60 * 60 * 24, claims } = params;

  const key = getJwtSecretKey(secret);

  const payload = normalizeCustomClaims(claims);

  const jwt = new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(id)
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + expiresInSeconds);

  return jwt.sign(key);
}

export async function verifyJwt(params: {
  token: string;
  secret: string;
}): Promise<{ id: string; claims: Record<string, unknown> } | null> {
  const { token, secret } = params;

  try {
    const key = getJwtSecretKey(secret);
    const { payload } = await jwtVerify(token, key, {
      algorithms: ['HS256'],
    });

    if (!payload.sub) {
      return null;
    }

    const claims = extractCustomClaims(payload);

    return { id: payload.sub, claims };
  } catch {
    return null;
  }
}

function normalizeCustomClaims(
  claims: Record<string, unknown> | undefined
): Record<string, unknown> {
  if (!claims) {
    return {};
  }

  assertNoReservedClaims(claims);
  return claims;
}

function extractCustomClaims(payload: JWTPayload): Record<string, unknown> {
  const claims: Record<string, unknown> = {};

  for (const key of Object.keys(payload)) {
    if (isReservedClaimKey(key)) {
      continue;
    }
    claims[key] = payload[key];
  }

  return claims;
}

function assertNoReservedClaims(claims: Record<string, unknown>): void {
  for (const key of Object.keys(claims)) {
    if (isReservedClaimKey(key)) {
      throw new Error(`JWT payload cannot include reserved claim: ${key}`);
    }
  }
}

function isReservedClaimKey(key: string): boolean {
  return (
    key === 'iss' ||
    key === 'sub' ||
    key === 'aud' ||
    key === 'exp' ||
    key === 'nbf' ||
    key === 'iat' ||
    key === 'jti'
  );
}

function getJwtSecretKey(secret: string): Uint8Array {
  if (secret.length < 32) {
    throw new Error('JWT secret must be at least 32 characters');
  }
  return new TextEncoder().encode(secret);
}
