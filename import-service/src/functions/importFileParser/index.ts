import { handlerPath } from '@libs/handler-resolver';

const BUCKET = 'roman-tarnakin-import-bucket';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      s3: {
        bucket: BUCKET,
        event: 's3:ObjectCreated:*',
        rules: [
          {
            prefix: 'uploaded/',
            suffix: '.csv',
          },
        ],
        existing: true,
      },
    },
  ],
};
