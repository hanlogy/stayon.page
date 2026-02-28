export type ErrorCode =
  | 'unknown'
  | 'forbidden'
  | 'unauthorized'
  | 'notFound'
  | 'notImplemented';

// Action response
export interface ActionSuccess<SuccessDataT = undefined> {
  readonly success: true;
  readonly data: SuccessDataT;
  readonly error?: undefined;
}

export interface ActionFailure<ErrorDataT = undefined> {
  readonly success: false;
  readonly data?: undefined;
  readonly error: {
    code: ErrorCode;
    data: ErrorDataT;
    message?: string | undefined;
  };
}

export type ActionResponse<SuccessDataT = undefined, ErrorDataT = undefined> =
  | ActionSuccess<SuccessDataT>
  | ActionFailure<ErrorDataT>;
