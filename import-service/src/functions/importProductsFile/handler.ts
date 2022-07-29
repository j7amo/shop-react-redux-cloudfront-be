import AWS from 'aws-sdk';
import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';
import { AppError } from '@libs/AppError';

const BUCKET = 'roman-tarnakin-import-bucket';

const importProductsFile: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  console.log(event);
  const { name: fileName } = event.queryStringParameters;
  const s3 = new AWS.S3({ region: 'us-east-1' });

  const params = {
    Bucket: BUCKET,
    Key: `uploaded/${fileName}`,
    Expires: 60,
    ContentType: 'text/csv',
  }

  let signedURL: string;

  try {
    signedURL = await s3.getSignedUrlPromise('putObject', params);
  } catch (err) {
    throw new AppError('Could not get signed URL', 400);
  }

    return {
      url: signedURL,
    };
};

export const main = middyfy(importProductsFile);