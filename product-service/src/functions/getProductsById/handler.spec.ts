import { mocked } from 'ts-jest/utils';
import { Handler } from 'aws-lambda';

import { middyfy } from '@libs/lambda';

jest.mock('@libs/lambda');

describe('getProductsById', () => {
  let main: any;
  let mockedMiddyfy: jest.MockedFn<typeof middyfy>;

  beforeEach(async () => {
    mockedMiddyfy = mocked(middyfy);
    mockedMiddyfy.mockImplementation((handler: Handler) => {
      return handler as never;
    });

    main = (await import('./handler')).main;
  });

  afterEach(() => {
    jest.resetModules();
  });

  it('returns correct response object', async () => {
    const event = {
      pathParameters: {
        productId: 1,
      }
    } as any;

    const actual = await main(event);
    expect(actual).toEqual({
      "product": {
        "count": 4,
        "description": "App for finding cheap flights to Mars",
        "id": 1,
        "price": 2.4,
        "title": "Mars For Everyone"
      }
    });
  });
});