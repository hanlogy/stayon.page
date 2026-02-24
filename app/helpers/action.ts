import { ActionError, ActionOk } from '@/definitions/types';

export function toActionOk<DataT>(data?: DataT | undefined): ActionOk<DataT> {
  return { ok: true, data };
}

export function toActionError(
  error: { message?: string | undefined } = {}
): ActionError {
  return {
    ok: false,
    error: {
      message: 'Unknown error',
      ...error,
    },
  };
}
