import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import productList from "../../../mock/productList.json";
import schema from './schema';
import { AppError } from "@libs/AppError";
import { isNumeric } from "../../utils/index";

const getProductsById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const { productId } = event.pathParameters;

  if (isNumeric(productId)) {
    const product = productList.find(({ id }) => id === parseInt(productId));

    if (product) {
      return {
        product
      };
    }

    throw new AppError('Product not found', 404);
  }
    throw new AppError('Bad request. Product ID should be a number', 400);
};

export const main = middyfy(getProductsById);
