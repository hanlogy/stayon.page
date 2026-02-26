import { Poll, ShareableEntityName } from '@/definitions/types';
import { DBHelperBase } from './DBHelperBase';
import { DBShareableHelper } from './DBShareableHelper';
import type {
  DBShareableRepository,
  PollCreateFields,
  PollUpdateFields,
} from './types';

const ENTITY_NAME: ShareableEntityName = 'poll';

export class DBPollHelper
  extends DBHelperBase
  implements DBShareableRepository<Poll>
{
  private get shareableHelper() {
    return this.createHelper(DBShareableHelper);
  }

  async createItem(fields: PollCreateFields): Promise<Poll> {
    const result = await this.shareableHelper.createItem({
      ...fields,
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

  async getItem({ shortId }: { shortId: string }): Promise<Poll | undefined> {
    return this.shareableHelper.getItem<Poll>({ shortId });
  }
}
