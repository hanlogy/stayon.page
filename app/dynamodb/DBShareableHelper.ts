import { ShareableCommon } from '@/definitions/types';
import { hashPasscode } from '@/lib/hash';
import { DBHelperBase } from './DBHelperBase';
import { claimShortId } from './claimShortId';
import { ShareableCreateFields, ShareableEntity } from './types';

export class DBShareableHelper extends DBHelperBase {
  private skPrefix = '01#';

  private buildPk({ shortId }: { shortId: string }) {
    return this.db.buildKey('shareable', shortId);
  }

  private buildSk() {
    return this.db.buildKey(this.skPrefix, true);
  }

  private formatShortId(shortId: string) {
    return [
      shortId.slice(0, 3),
      shortId.slice(3, 6),
      shortId.slice(6, 10),
    ].join('-');
  }

  buildKeys({ shortId }: { shortId: string }): {
    pk: string;
    sk: string;
  } {
    return { pk: this.buildPk({ shortId }), sk: this.buildSk() };
  }

  async createItem<T extends ShareableCreateFields>({
    viewPasscode,
    adminPasscode,
    ...fieldsRest
  }: T): Promise<
    Omit<T, 'viewPasscode' | 'adminPasscode'> & {
      shortId: string;
      hasViewPasscode: boolean;
      hasAdminPasscode: boolean;
    }
  > {
    const shortId = this.formatShortId(await claimShortId(this.db.client));
    const hasViewPasscode = !!viewPasscode;
    const hasAdminPasscode = !!adminPasscode;

    const resolvedFields = {
      shortId,
      viewPasscode: viewPasscode ? await hashPasscode(viewPasscode) : undefined,
      adminPasscode: adminPasscode
        ? await hashPasscode(adminPasscode)
        : undefined,
      ...fieldsRest,
      ...this.buildKeys({ shortId }),
    };

    await this.db.create({
      keyNames: ['pk', 'sk'],
      attributes: resolvedFields,
    });

    return {
      ...fieldsRest,
      shortId,
      hasViewPasscode,
      hasAdminPasscode,
    };
  }

  async get<T extends ShareableEntity>({ shortId }: { shortId: string }) {
    const { item } = await this.db.get<T>({
      keys: this.buildKeys({ shortId }),
    });

    return item;
  }

  async getItem<T extends ShareableCommon>({ shortId }: { shortId: string }) {
    const item = await this.get<ShareableEntity<T>>({ shortId });
    if (!item) {
      return undefined;
    }

    const { pk: _pk, sk: _sk, viewPasscode, adminPasscode, ...rest } = item;

    return {
      hasViewPasscode: !!viewPasscode,
      hasAdminPasscode: !!adminPasscode,
      ...rest,
    };
  }
}
