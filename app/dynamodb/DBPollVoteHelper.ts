import type { PollVote } from '@/definitions';
import { DBHelperBase } from './DBHelperBase';
import { VoteCreateFields } from './types';

export class DBPollVoteHelper extends DBHelperBase {
  skPrefix = '01#';

  private buildPk({ shortId }: { shortId: string }) {
    return this.db.buildKey('POLL_VOTE', shortId);
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
  }): Promise<PollVote | undefined> {
    const result = await this.db.get({
      keys: this.buildKeys({ code, shortId }),
    });

    if (!result || !result.item) {
      return undefined;
    }

    const { name, answers } = result.item;

    return { shortId, code, name, answers };
  }

  async getItems({ shortId }: { shortId: string }): Promise<PollVote[]> {
    const { items } = await this.db.query({
      keyConditions: [
        { attribute: 'pk', value: this.buildPk({ shortId }) },
        { attribute: 'sk', value: this.skPrefix, operator: 'begins_with' },
      ],
    });

    return items.map(({ name, answers, code }) => {
      return {
        shortId,
        code,
        name,
        answers,
      };
    });
  }

  async createItem({ shortId, name, answers }: VoteCreateFields) {
    const code = await this.generateCode(
      shortId,
      async (code) => !!(await this.getItem({ shortId, code }))
    );

    const item = {
      shortId,
      name,
      answers,
      code,
    };

    await this.db.put({
      keyNames: ['pk', 'sk'],
      item: { ...item, ...this.buildKeys({ shortId, code }) },
    });

    return item;
  }
}
