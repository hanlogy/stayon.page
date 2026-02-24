import { ShareableCommon } from '@/definitions/types';
import { formatShortId } from '@/helpers/shortId';
import { DBHelperBase } from './DBHelperBase';
import {
  buildAdminPasscodeFields,
  buildViewPasscodeFields,
} from './buildPasscodeFields';
import { claimShortId } from './claimShortId';
import { grantAccessIfNeeded } from './grantAccessIfNeeded';
import type {
  ShareableCreateFields,
  ShareableEntity,
  ShareableUpdateFields,
} from './types';

export class DBShareableHelper extends DBHelperBase {
  private skPrefix = '01#';

  private buildPk({ shortId }: { shortId: string }) {
    return this.db.buildKey('shareable', shortId);
  }

  private buildSk() {
    return this.db.buildKey(this.skPrefix, true);
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
    }
  > {
    const shortId = formatShortId(await claimShortId(this.db.client));
    const now = Date.now();

    const item = {
      shortId,
      ...(await buildViewPasscodeFields({
        passcode: viewPasscode,
        version: now,
      })),
      ...(await buildAdminPasscodeFields({
        passcode: adminPasscode,
        version: now,
      })),
      ...fieldsRest,
      ...this.buildKeys({ shortId }),
    };

    await this.db.put({ keyNames: ['pk', 'sk'], item });
    await grantAccessIfNeeded({
      forViewAccess: !!viewPasscode,
      forAdminAccess: !!adminPasscode,
      shortId,
      version: now,
    });

    return {
      ...fieldsRest,
      shortId,
    };
  }

  async updateItem<T extends ShareableUpdateFields>(
    { shortId }: { shortId: string },
    {
      viewPasscode,
      adminPasscode,
      deleteViewPasscode,
      deleteAdminPasscode,
      ...fieldsRest
    }: T,
    { removeAttributes = [] }: { removeAttributes?: string[] } = {}
  ): Promise<void> {
    const now = Date.now();
    const attributes = {
      ...(await buildViewPasscodeFields({
        isDelete: deleteViewPasscode,
        passcode: viewPasscode,
        version: now,
      })),
      ...(await buildAdminPasscodeFields({
        isDelete: deleteAdminPasscode,
        passcode: adminPasscode,
        version: now,
      })),
      ...fieldsRest,
    };

    await this.db.update({
      keys: this.buildKeys({ shortId }),
      setAttributes: attributes,
      removeAttributes: [
        ...removeAttributes,
        ...(deleteViewPasscode ? ['viewPasscode', 'viewPasscodeVersion'] : []),
        ...(deleteAdminPasscode
          ? ['adminPasscode', 'adminPasscodeVersion']
          : []),
      ],
    });

    await grantAccessIfNeeded({
      forViewAccess: !deleteViewPasscode && !!viewPasscode,
      forAdminAccess: !deleteAdminPasscode && !!adminPasscode,
      shortId,
      version: now,
    });
  }

  async get<T extends ShareableEntity>({
    shortId,
  }: {
    shortId: string;
  }): Promise<T | undefined> {
    const { item } = await this.db.get({
      keys: this.buildKeys({ shortId }),
    });

    return item as T;
  }

  async getItem<T extends ShareableCommon>({
    shortId,
  }: {
    shortId: string;
  }): Promise<
    | Omit<ShareableEntity<T>, 'viewPasscode' | 'adminPasscode' | 'pk' | 'sk'>
    | undefined
  > {
    const item = await this.get<ShareableEntity<T>>({ shortId });
    if (!item) {
      return undefined;
    }

    const {
      pk: _pk,
      sk: _sk,
      viewPasscode: _vp,
      adminPasscode: _ap,
      ...rest
    } = item;

    return rest;
  }

  async deleteItem({ shortId }: { shortId: string }) {
    await this.db.delete({
      keys: this.buildKeys({ shortId }),
    });
  }
}
