import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'products',
        description: 'Returns all products',
        cors: true,
        responseData: {
          200: 'Products received',
          404: 'Products not found',
          500: 'Internal server error'
        }
      },
    },
  ],
};
