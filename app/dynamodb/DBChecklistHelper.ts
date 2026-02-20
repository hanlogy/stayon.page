import { Checklist, ShareableEntityName } from '@/definitions/types';
import { DBHelperBase } from './DBHelperBase';
import { DBShareableHelper } from './DBShareableHelper';
import type { ChecklistCreateFields, ChecklistUpdateFields } from './types';

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

  async updateItem(
    shortId: string,
    fields: ChecklistUpdateFields
  ): Promise<void> {
    await this.shareableHelper.updateItem(
      { shortId },
      {
        ...fields,
        entity: ENTITY_NAME,
      }
    );
  }

  async getItem({
    shortId,
  }: {
    shortId: string;
  }): Promise<Checklist | undefined> {
    return this.shareableHelper.getItem<Checklist>({ shortId });
  }
}
