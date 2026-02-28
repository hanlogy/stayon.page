export type ErrorCode =
  | 'unknown'
  | 'forbidden'
  | 'unauthorized'
  | 'notFound'
  | 'notImplemented';

// Action response
export interface ActionSuccess<DataT = undefined> {
  readonly success: true;
  readonly data: DataT;
  readonly error?: undefined;
}

export interface ActionFailure {
  readonly success: false;
  readonly data?: undefined;
  readonly error: {
    code: ErrorCode;
    message?: string | undefined;
  };
}

export type ActionResponse<DataT = undefined> =
  | ActionSuccess<DataT>
  | ActionFailure;
