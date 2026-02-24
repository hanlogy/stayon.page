import { ActionError, ActionSuccess } from '@/definitions/types';

export function toActionSuccess<DataT>(
  data?: DataT | undefined
): ActionSuccess<DataT> {
  return { success: true, data };
}

export function toActionError({
  code = 'unknown',
  message,
}: { code?: string; message?: string | undefined } = {}): ActionError {
  return {
    success: false,
    error: { code, message },
  };
}
