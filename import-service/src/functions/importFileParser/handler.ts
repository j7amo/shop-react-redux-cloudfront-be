import AWS from 'aws-sdk';
import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';
import { AppError } from '@libs/AppError';
import csvParser from 'csv-parser';

const BUCKET = 'roman-tarnakin-import-bucket';

const importFileParser: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async () => {
  const s3 = new AWS.S3({ region: 'us-east-1' });

  const paramsForBucketListing = {
    Bucket: BUCKET,
    Prefix: `uploaded/`,
    Delimiter: '/'
  }

  let uploadedFile;

  try {
    uploadedFile = (await s3.listObjectsV2(paramsForBucketListing).promise()).Contents[0];
    const paramsForGettingFileFromS3 = {
      Bucket: BUCKET,
      Key: uploadedFile.Key,
    }
    const s3Stream = s3.getObject(paramsForGettingFileFromS3).createReadStream();
    const results = [];
    await new Promise((resolve, reject) => {
      s3Stream
          .pipe(csvParser({ separator: ';' }))
          .on('data', (data) => {
            results.push(data);
          })
          .on('error', (error) => {
            reject(error);
          })
          .on('end', () => {
            console.log('Parsing completed!');
            resolve(results);
          })
    });

    results.forEach((item) => {
      console.log(item);
    });

    return {
      message: 'CSV successfully parsed'
    }
  } catch (err) {
    console.log(err);
    throw new AppError('Something went wrong', 500);
  }
};

export const main = middyfy(importFileParser);