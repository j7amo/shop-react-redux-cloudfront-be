import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: '/token',
        request: {
          parameters: {
            querystrings: {
              name: true
            }
          }
        },
        description: 'Authorization',
        cors: true,
        responseData: {
          200: 'Signed URL successfully generated',
          401: 'Unauthorized',
          403: 'Forbidden',
          500: 'Internal server error'
        }
      },
    },
  ],
};
