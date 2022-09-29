import AWS from 'aws-sdk';
import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import * as pg from 'pg';

import schema from './schema';
import { AppError } from '@libs/AppError';
import { isNumeric, setupDbOptions } from "utils";

const { Client } = pg;
const dbOptions = setupDbOptions();

const catalogBatchProcess: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const client = new Client(dbOptions);
  await client.connect();
  const sns = new AWS.SNS();
  // @ts-ignore
  const items = event.Records.map(({ body }) => JSON.parse(body));
  for (const item of items) {
    const { title, description, price, count } = item;
    if (!title || !description || !price || !count) {
      throw new AppError('Product data is invalid', 400);
    }
    if (!isNumeric(String(price)) || !isNumeric(String(count)) || price <= 0 || count <= 0) {
      throw new AppError('Product data is invalid', 400);
    }
    const productCreationQuery = `
      WITH new_product AS (
        INSERT INTO products (title, description , price)
        VALUES ('${title}', '${description}', ${price})
        RETURNING id
      )
      INSERT INTO stocks (product_id, counts)
      SELECT id, ${count}
      FROM new_product
    `;

    try {
      await client.query(productCreationQuery);
      await sns.publish({
        Subject: 'Product successfully created!',
        Message: `Product: ${JSON.stringify(item)}`,
        TopicArn: process.env.SNS_ARN,
      }).promise();
      return {
        message: 'Product successfully created'
      }
    } catch(err) {
      throw new AppError(err.message, 500);
    } finally {
      client.end();
    }
  }
};

export const main = middyfy(catalogBatchProcess);
