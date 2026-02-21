import { IndexedDB, ObjectStoreSchemas } from '@hanlogy/react-web-ui';

export type IDBHandle = IndexedDB<DBSchema>;

interface DBSchema {
  checklistState: {
    shortId: string;
    checkedItems: string[];
  };
}

const stores: ObjectStoreSchemas<DBSchema> = {
  checklistState: {
    keyPath: 'shortId',
  },
};

let dbPromise: Promise<IDBHandle> | null = null;

export async function openDB(): Promise<IDBHandle> {
  return (dbPromise ??= IndexedDB.open<DBSchema>({
    name: 'StayOnPage',
    version: 1,
    stores,
    onVersionChange: () => {
      dbPromise = null;
    },
  }).catch((e) => {
    dbPromise = null;
    throw e;
  }));
}
