import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      sqs: {
        arn: 'arn:aws:sqs:us-east-1:522943678476:import-service-queue',
        batchSize: 5,
        enabled: true,
      }
    },
  ],
};
