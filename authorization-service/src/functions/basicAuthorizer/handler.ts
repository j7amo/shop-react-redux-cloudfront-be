import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';
// import { AppError } from '@libs/AppError';


const basicAuthorizer: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  console.log(event);
};

export const main = middyfy(basicAuthorizer);