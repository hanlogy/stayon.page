import { ActionFailure, ActionSuccess } from '@/definitions/types';

export function toActionSuccess(): ActionSuccess<undefined>;
export function toActionSuccess<DataT>(data: DataT): ActionSuccess<DataT>;
export function toActionSuccess<DataT>(data?: DataT) {
  if (arguments.length === 0) {
    return { success: true, data: undefined };
  }

  return { success: true, data };
}

export function toActionFailure({
  code = 'unknown',
  message,
}: { code?: string; message?: string | undefined } = {}): ActionFailure {
  return {
    success: false,
    error: { code, message },
  };
}
