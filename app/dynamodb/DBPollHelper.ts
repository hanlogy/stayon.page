import type { Poll, ShareableEntityName } from '@/definitions/types';
import { DBHelperBase } from './DBHelperBase';
import { DBShareableHelper } from './DBShareableHelper';
import type { PollCreateFields, PollUpdateFields } from './types';

const ENTITY_NAME: ShareableEntityName = 'poll';

export class DBPollHelper extends DBHelperBase {
  private get shareableHelper() {
    return this.createHelper(DBShareableHelper);
  }

  async createItem(fields: PollCreateFields): Promise<Poll> {
    const result = await this.shareableHelper.createItem({
      ...fields,
      isClosed: false,
      entity: ENTITY_NAME,
    });

    return result;
  }

  async updateItem(shortId: string, fields: PollUpdateFields): Promise<void> {
    const optinalFields = ['closesAt'] as const;
    const removeAttributes = optinalFields.filter((e) => !fields[e]);

    await this.shareableHelper.updateItem(
      { shortId },
      {
        ...fields,
        entity: ENTITY_NAME,
      },
      { removeAttributes }
    );
  }
}
