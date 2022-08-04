import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'post',
        path: 'products',
        description: 'Creates a new product',
        cors: true,
        responseData: {
          200: 'Product created',
          400: 'Product data is invalid',
          500: 'Internal server error'
        },
        bodyType: 'ProductCreationRequestBody',
      },
    },
  ],
};
