/**
 * Keeps only string values from the `input`. Currently we only support single
 * string values.
 */
export function searchParamsToStringRecord(
  input: Record<string, unknown>
): Record<string, string> {
  const output: Record<string, string> = {};

  for (const key in input) {
    const value = input[key];
    if (!value || typeof value !== 'string') {
      continue;
    }
    output[key] = value;
  }

  return output;
}
