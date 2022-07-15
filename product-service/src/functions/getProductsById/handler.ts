import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import productList from "../../../mock/productList.json";
import schema from './schema';

const getProductsById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const { productId } = event.pathParameters;
  const product = productList.find(({ id }) => id === parseInt(productId));
  return formatJSONResponse({
    product
  });
};

export const main = middyfy(getProductsById);
