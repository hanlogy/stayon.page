import { Checklist, ShareableEntityName } from '@/definitions/types';
import { DBHelperBase } from './DBHelperBase';
import { DBShareableHelper } from './DBShareableHelper';
import { ChecklistCreateFields } from './types';

const ENTITY_NAME: ShareableEntityName = 'checklist';

export class DBChecklistHelper extends DBHelperBase {
  private get shareableHelper() {
    return this.createHelper(DBShareableHelper);
  }

  async createItem(fields: ChecklistCreateFields): Promise<Checklist> {
    const result = await this.shareableHelper.createItem({
      ...fields,
      entity: ENTITY_NAME,
    });

    return result;
  }

  // async getItem(shortId: string) {}
}
