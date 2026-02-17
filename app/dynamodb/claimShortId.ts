import { ConditionalCheckFailedException } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  QueryCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { buildQueryInput, buildUpdateInput } from '@hanlogy/ts-dynamodb';
import { shuffle } from '@hanlogy/ts-lib';

const BUCKET_COUNT = 10;
const MAX_RETRIES = 5;
const TABLE_NAME = 'StayOnShortIdPool';
const GSI1 = 'GSI1';
const GSI1PK = 'gsi1Pk';

export const claimShortId = async (
  client: DynamoDBDocumentClient
): Promise<string> => {
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const buckets = Array.from(
      { length: BUCKET_COUNT },
      (_, i) => `bucket-${i}`
    );
    shuffle(buckets);

    for (const bucket of buckets) {
      const queryResult = await client.send(
        new QueryCommand(
          buildQueryInput({
            indexName: GSI1,
            tableName: TABLE_NAME,
            keyConditions: { attribute: GSI1PK, value: bucket },
            limit: 1,
          })
        )
      );

      const item = queryResult.Items?.[0];

      if (!item) {
        continue;
      }

      try {
        await client.send(
          new UpdateCommand(
            buildUpdateInput({
              tableName: TABLE_NAME,
              keys: { bucket: item.bucket, shortId: item.shortId },
              removeAttributes: [GSI1PK],
              timestamp: false,
            })
          )
        );
        return item.shortId as string;
      } catch (e) {
        if (!(e instanceof ConditionalCheckFailedException)) {
          throw e;
        }
      }
    }
  }

  throw new Error('Failed to claim a shortId');
};
