import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'products/{productId}',
        description: 'Returns a product by ID',
        cors: true,
        responseData: {
          200: 'Product found',
          404: 'Product not found',
          500: 'Internal server error'
        }
      },
    },
  ],
};
