import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';
import { AppError } from '@libs/AppError';

const importProductsFile: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  console.log(event);
  const { name } = event.queryStringParameters;

  // let productList;
  //
  // try {
  //   productList = (await client.query(query)).rows;
  // } catch(err) {
  //   throw new AppError(err.message, 500);
  // } finally {
  //   client.end();
  // }

  // const product = productList.find(({ id }) => id === productId);
  //
  // if (!product) {
  //   throw new AppError('Product not found', 404);
  // }
  //
  // return {
  //   product
  // };
};

export const main = middyfy(importProductsFile);