import type {ValidatedEventAPIGatewayProxyEvent} from '@libs/api-gateway';
import {middyfy} from '@libs/lambda';
import * as pg from 'pg';

import schema from './schema';
import { AppError } from '@libs/AppError';
import { setupDbOptions } from "utils";

const { Client } = pg;
const dbOptions = setupDbOptions();

const getProductsList: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async () => {
  const client = new Client(dbOptions);
  await client.connect();

  try {
    const { rows: productList } = await client.query(`select * from products`);

    return {
      productsList: productList
    };
  } catch(err) {
    throw new AppError('Products not found', 404);

  } finally {
    client.end();
  }

};

export const main = middyfy(getProductsList);
