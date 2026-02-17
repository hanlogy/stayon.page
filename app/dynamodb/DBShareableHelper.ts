import bcrypt from 'bcryptjs';
import { ShareableEntityName } from '@/definitions/types';
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
    entity,
    viewPasscode,
    adminPasscode,
    ...fieldsRest
  }: T & { readonly entity: ShareableEntityName }): Promise<
    Omit<T, 'viewPasscode' | 'adminPasscode' | 'entity'> & {
      shortId: string;
      hasViewPasscode: boolean;
      hasAdminPasscode: boolean;
    }
  > {
    const shortId = await claimShortId(this.db.client);
    const hasViewPasscode = !!viewPasscode;
    const hasAdminPasscode = !!adminPasscode;

    const resolvedFields = {
      shortId,
      entity,
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
      shortId: this.formatShortId(shortId),
      hasViewPasscode,
      hasAdminPasscode,
    };
  }
}
