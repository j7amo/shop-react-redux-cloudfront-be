import { mocked } from 'ts-jest/utils';
import { Handler } from 'aws-lambda';
import { middyfy } from '@libs/lambda';

jest.mock('@libs/lambda');

describe('getProductsById', () => {
  let main: any;
  let mockedMiddyfy: jest.MockedFn<typeof middyfy>;

  beforeEach(async () => {
    mockedMiddyfy = mocked(middyfy);
    mockedMiddyfy.mockImplementationOnce((handler: Handler) => {
      return handler as never;
    });

    main = (await import('./handler')).main;
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

  it('returns response object with 400 when productId is incorrect', async () => {
    const event = {
      pathParameters: {
        productId: '1sdjfskdjf',
      }
    } as any;

    try {
      await main(event);
    } catch (err) {
      expect(err.message).toEqual("Bad request. Product ID should be a number");
    }

  });

  it('returns response object with 404 when productId is correct but there is no such id', async () => {
    const event = {
      pathParameters: {
        productId: '6',
      }
    } as any;

    try {
      await main(event);
    } catch (err) {
      expect(err.message).toEqual("Product not found");
    }
  });
});