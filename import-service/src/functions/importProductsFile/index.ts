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
        authorizer: {
          name: 'tokenAuthorizer',
          arn: 'arn:aws:lambda:${self:provider.region}:${env:ACCOUNT_ID}:function:authorization-service-dev-basicAuthorizer',
          identitySource: 'method.request.header.Authorization',
          resultTtlInSeconds: 0,
          type: 'token',
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
