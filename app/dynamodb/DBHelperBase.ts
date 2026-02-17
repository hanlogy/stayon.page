import { DynamoDBHelper } from '@hanlogy/ts-dynamodb';

interface DBHelperBaseOptions {
  db?: DynamoDBHelper;
}

export abstract class DBHelperBase {
  constructor({ db }: DBHelperBaseOptions = {}) {
    this.db = db ?? new DynamoDBHelper();
  }

  protected readonly db: DynamoDBHelper;

  protected createHelper<T extends DBHelperBase>(
    HelperClass: new (options: DBHelperBaseOptions) => T
  ): T {
    if (this.constructor === HelperClass) {
      throw new Error(`Cannot create self helper (${HelperClass.name})`);
    }

    return new HelperClass({ db: this.db });
  }
}
