export class DBError extends Error {
  constructor({
    code = 'unknown',
    data,
    message,
  }: {
    code?: string;
    message?: string;
    data?: unknown;
  } = {}) {
    super(message);
    this.code = code;
    this.data = data;
  }

  name = DBError.name;
  code: string;
  data?: unknown;

  static fromCode(
    code: 'forbidden' | 'unauthorized' | 'notFound' | 'notImplemented',
    extra: { message?: string; data?: unknown } = {}
  ): DBError {
    return new DBError({ code, ...extra });
  }
}
