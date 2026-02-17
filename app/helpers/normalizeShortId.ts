export function normalizeShortId(id?: string): string | null {
  if (!id || !/^[a-z]{3}-[a-z]{3}-[0-9]{5}$/i.test(id)) {
    return null;
  }

  return id.toLowerCase();
}
