import { EventRsvp } from '@/definitions/types';
import { DBHelperBase } from './DBHelperBase';
import { RsvpCreateFields, RsvpUpdateFields } from './types';

export class DBEventRsvpHelper extends DBHelperBase {
  skPrefix = '01#';

  private buildPk({ shortId }: { shortId: string }) {
    return this.db.buildKey('EVENT_RSVP', shortId);
  }

  private buildSk({ code }: { code: string }) {
    return this.db.buildKey(this.skPrefix, code, true);
  }

  private buildKeys({ code, shortId }: { code: string; shortId: string }) {
    return { pk: this.buildPk({ shortId }), sk: this.buildSk({ code }) };
  }

  async getItem({
    shortId,
    code,
  }: {
    shortId: string;
    code: string;
  }): Promise<EventRsvp | undefined> {
    const result = await this.db.get({
      keys: this.buildKeys({ code, shortId }),
    });

    if (!result || !result.item) {
      return undefined;
    }

    const { response, name, guestCount } = result.item;

    return {
      shortId,
      code,
      response,
      name,
      guestCount,
    };
  }

  async getItems({ shortId }: { shortId: string }): Promise<EventRsvp[]> {
    const { items } = await this.db.query({
      keyConditions: [
        { attribute: 'pk', value: this.buildPk({ shortId }) },
        { attribute: 'sk', value: this.skPrefix, operator: 'begins_with' },
      ],
    });

    return items.map(({ response, name, guestCount, code }) => {
      return {
        shortId,
        code,
        response,
        name,
        guestCount,
      };
    });
  }

  private async generateCode(
    shortId: string,
    count: number = 0
  ): Promise<string> {
    if (count > 5) {
      throw new Error('Faild to generate code');
    }

    const code = Math.floor(Math.random() * 1_000_000)
      .toString()
      .padStart(6, '0');
    if (await this.getItem({ shortId, code })) {
      return this.generateCode(shortId, count++);
    }
    return code;
  }

  async createItem({ shortId, name, response, guestCount }: RsvpCreateFields) {
    const code = await this.generateCode(shortId);

    const item = {
      shortId,
      name,
      response,
      guestCount,
      code,
    };

    await this.db.put({
      keyNames: ['pk', 'sk'],
      item: { ...item, ...this.buildKeys({ shortId, code }) },
    });

    return item;
  }

  async updateItem({
    code,
    shortId,
    name,
    response,
    guestCount,
  }: RsvpUpdateFields) {
    const setAttributes = {
      name,
      response,
      guestCount,
    };
    const removeAttributes: string[] = [];

    if (response === 'notGoing') {
      removeAttributes.push('guestCount');
    }

    await this.db.update({
      keys: this.buildKeys({ shortId, code }),
      setAttributes,
      removeAttributes,
    });

    return {
      code,
      shortId,
      ...setAttributes,
    };
  }
}
