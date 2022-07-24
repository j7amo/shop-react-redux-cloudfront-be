import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import * as pg from 'pg';

import schema from './schema';
import { AppError } from '@libs/AppError';
import { setupDbOptions } from "utils";

const { Client } = pg;
const dbOptions = setupDbOptions();

const getProductsById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  console.log(event);
  const client = new Client(dbOptions);
  await client.connect();
  const { productId } = event.pathParameters;
  const query = `select id, title, description, price, counts from (select * from products P join stocks S on P.id = S.product_id) X`

  let productList;

  try {
    productList = (await client.query(query)).rows;
  } catch(err) {
    throw new AppError(err.message, 500);
  } finally {
    client.end();
  }

  const product = productList.find(({ id }) => id === productId);

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  return {
    product
  };
};

export const main = middyfy(getProductsById);