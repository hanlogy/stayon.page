'use server';

import { redirect } from 'next/navigation';
import type { ActionResponse } from '@/definitions';
import { DBShareableHelper } from '@/dynamodb/DBShareableHelper';
import { toActionFailure } from '@/helpers/action';

export async function deleteEntity({
  shortId,
}: {
  shortId: string;
}): Promise<ActionResponse> {
  const helper = new DBShareableHelper();
  try {
    await helper.deleteItem({ shortId });
  } catch {
    return toActionFailure({ message: 'Delete failed' });
  }

  redirect('/');
}
