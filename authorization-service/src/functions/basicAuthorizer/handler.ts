// @ts-nocheck
import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';
import { AppError } from '@libs/AppError';


const basicAuthorizer: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  console.log(`Event: ${JSON.stringify(event)}`);

  if (event.type !== 'TOKEN') {
    throw new AppError('Unauthorized', 401);
  }

  try {
    const authorizationToken = event.authorizationToken;
    const encodedCredentials = authorizationToken.split(' ')[1];
    const buffer = Buffer.from(encodedCredentials, 'base64');
    const decodedCredentials = buffer.toString('utf-8').split(':');
    const userName = decodedCredentials[0];
    const password = decodedCredentials[1];

    console.log(`userName: ${userName} and password: ${password}`);

    const effect = !process.env[userName] || process.env[userName] !== password ? 'Deny' : 'Allow';

    return generatePolicy(encodedCredentials, event.methodArn, effect);
  } catch (err) {
    throw new AppError('Unauthorized', 401);
  }
};

const generatePolicy = (principalId, resource, effect = 'Allow') => {
  return {
    principalId: principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource
        }
      ]
    }
  }
}

export const main = middyfy(basicAuthorizer);