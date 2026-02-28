import type { ActionFailure, ActionSuccess, ErrorCode } from '@/definitions';

// Without overload, this will not complain:
// toActionSuccess<{ name: string }>()
export function toActionSuccess(): ActionSuccess<undefined>;
export function toActionSuccess<SuccessDataT>(
  data: SuccessDataT
): ActionSuccess<SuccessDataT>;
export function toActionSuccess<SuccessDataT>(
  data?: SuccessDataT
): ActionSuccess<SuccessDataT | undefined> {
  if (arguments.length === 0) {
    return { success: true, data: undefined };
  }

  return { success: true, data };
}

export function toActionFailure(options?: {
  code?: ErrorCode;
  message?: string | undefined;
}): ActionFailure<undefined>;

export function toActionFailure<ErrorDataT>(options: {
  code?: ErrorCode;
  message?: string | undefined;
  data: ErrorDataT;
}): ActionFailure<ErrorDataT>;

export function toActionFailure<ErrorDataT>({
  code = 'unknown',
  message,
  data,
}: {
  code?: ErrorCode;
  message?: string | undefined;
  data?: ErrorDataT;
} = {}): ActionFailure<ErrorDataT | undefined> {
  return {
    success: false,
    error: { code, message, data },
  };
}
