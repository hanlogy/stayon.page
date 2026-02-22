import { Event, ShareableEntityName } from '@/definitions/types';
import { DBHelperBase } from './DBHelperBase';
import { DBShareableHelper } from './DBShareableHelper';
import type { EventCreateFields, EventUpdateFields } from './types';

const ENTITY_NAME: ShareableEntityName = 'event';

export class DBEventHelper extends DBHelperBase {
  private get shareableHelper() {
    return this.createHelper(DBShareableHelper);
  }

  async createItem(fields: EventCreateFields): Promise<Event> {
    const result = await this.shareableHelper.createItem({
      ...fields,
      entity: ENTITY_NAME,
    });

    return result;
  }

  async updateItem(shortId: string, fields: EventUpdateFields): Promise<void> {
    const removeAttributes: string[] = [];
    if (!fields.endTime) {
      removeAttributes.push('endTime');
    }

    if (!fields.type) {
      removeAttributes.push('type');
    }

    await this.shareableHelper.updateItem(
      { shortId },
      {
        ...fields,
        entity: ENTITY_NAME,
      },
      { removeAttributes }
    );
  }

  async getItem({ shortId }: { shortId: string }): Promise<Event | undefined> {
    return this.shareableHelper.getItem<Event>({ shortId });
  }
}
