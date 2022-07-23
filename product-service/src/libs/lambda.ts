import middy from "@middy/core";
import middyJsonBodyParser from "@middy/http-json-body-parser";
import { Handler } from 'aws-lambda';

import { apiGatewayResponseMiddleware } from "@libs/middleware";

export const middyfy = (handler: Handler) => {
  return middy(handler)
      .use(middyJsonBodyParser())
      .use(apiGatewayResponseMiddleware({ enableErrorLogger: process.env.IS_OFFLINE === 'true' }));
}
