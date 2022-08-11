import type { AWS } from '@serverless/typescript';

import basicAuthorizer from '@functions/basicAuthorizer';

const serverlessConfiguration: AWS = {
  service: 'authorization-service',
  frameworkVersion: '3',
  useDotenv: true,
  plugins: [
    'serverless-dotenv-plugin',
    'serverless-auto-swagger',
    'serverless-esbuild',
    'serverless-offline'
  ],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
  },
  // resources: {
  //   Resources: {
  //     ImportServiceQueue: {
  //       Type: 'AWS::SQS::Queue',
  //       Properties: {
  //         QueueName: 'import-service-queue',
  //       }
  //     }
  //   }
  // },
  functions: { basicAuthorizer },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: true,
      sourcemap: true,
      exclude: ['aws-sdk', 'pg-native'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    autoswagger: {
      apiType: 'http',
      title: 'Products',
      host: 'lz37ta80t6.execute-api.us-east-1.amazonaws.com/dev/',
      schemes: ['https'],
      useStage: true,
    }
  },
};

module.exports = serverlessConfiguration;