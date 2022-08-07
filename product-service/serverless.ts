import type { AWS } from '@serverless/typescript';

import catalogBatchProcess from '@functions/catalogBatchProcess';
import getProductsList from '@functions/getProductsList';
import getProductsById from '@functions/getProductsById';
import postProduct from '@functions/postProduct';

const serverlessConfiguration: AWS = {
  service: 'product-service',
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
      SNS_ARN: { Ref: 'CreateProductTopic' },
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: ['sns:*'],
        Resource: { Ref: 'CreateProductTopic' },
      }
    ],
  },
  resources: {
    Resources: {
      CreateProductTopic: {
        Type: 'AWS::SNS::Topic',
        Properties: {
          TopicName: 'create-product-topic',
        }
      },
      CreateProductTopicSubscription: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: 'roman.tarnakin@gmail.com',
          Protocol: 'email',
          TopicArn: { Ref: 'CreateProductTopic' },
        }
      }
    }
  },
  functions: { getProductsList, getProductsById, postProduct, catalogBatchProcess },
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
      title: 'Products',
      host: 'lz37ta80t6.execute-api.us-east-1.amazonaws.com/dev/',
      schemes: ['https'],
      useStage: true,
    }
  },
};

module.exports = serverlessConfiguration;