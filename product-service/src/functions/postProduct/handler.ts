import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import * as pg from 'pg';

import schema from './schema';
import { AppError } from '@libs/AppError';
import { isNumeric, setupDbOptions } from "utils";

const { Client } = pg;
const dbOptions = setupDbOptions();

const postProduct: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  console.log(event);
  const client = new Client(dbOptions);
  await client.connect();

  if (!event.body) {
    throw new AppError('Product data is invalid', 400);
  }

  const { title, description, price, count } = event.body;

  if (!title || !description || !price || !count) {
    throw new AppError('Product data is invalid', 400);
  }

  if (!isNumeric(String(price)) || !isNumeric(String(count))) {
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
    return {
      message: "Product successfully created"
    }
  } catch(err) {
    throw new AppError(err.message, 500);
  } finally {
    client.end();
  }

};

export const main = middyfy(postProduct);
