import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: '/import',
        request: {
          parameters: {
            querystrings: {
              name: true
            }
          }
        },
        description: 'Returns a Signed URL for CSV file to import',
        cors: true,
        responseData: {
          200: 'Signed URL successfully generated',
          400: 'Could not get signed URL',
          500: 'Internal server error'
        }
      },
    },
  ],
};
