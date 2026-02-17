import bcrypt from 'bcryptjs';
import { ShareableCommon } from '@/definitions/types';
import { DBHelperBase } from './DBHelperBase';
import { claimShortId } from './claimShortId';
import { ShareableCreateFields } from './types';

export class DBShareableHelper extends DBHelperBase {
  private skPrefix = '01#';

  private buildPk({ shortId }: { shortId: string }) {
    return this.db.buildKey('shareable', shortId);
  }

  private buildSk() {
    return this.db.buildKey(this.skPrefix, true);
  }

  private async encryptPasscode(code?: string): Promise<string | undefined> {
    if (!code) {
      return undefined;
    }

    return await bcrypt.hash(code, 12);
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
      viewPasscode: await this.encryptPasscode(viewPasscode),
      adminPasscode: await this.encryptPasscode(adminPasscode),
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

  async getItem<T extends ShareableCommon>({
    shortId,
  }: {
    shortId: string;
  }) {
    const { item } = await this.db.get<
      Omit<T, 'hasViewPasscode' | 'hasAdminPasscode'> & {
        readonly pk: string;
        readonly sk: string;
        readonly viewPasscode?: string;
        readonly adminPasscode?: string;
      }
    >({
      keys: this.buildKeys({ shortId }),
    });

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
