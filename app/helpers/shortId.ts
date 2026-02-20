/**
 * @param id It must be a `abc-abc-1234` format.
 */
export function normalizeShortId(id?: string): string | null {
  if (!id || !/^[a-z]{3}-[a-z]{3}-[0-9]{4}$/i.test(id)) {
    return null;
  }

  return id.toLowerCase();
}

/**
 * @param shortId It must not contain `-`
 */
export function formatShortId(shortId: string) {
  return [shortId.slice(0, 3), shortId.slice(3, 6), shortId.slice(6, 10)].join(
    '-'
  );
}
