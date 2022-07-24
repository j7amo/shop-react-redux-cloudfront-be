import { mocked } from 'ts-jest/utils';
import { Handler } from 'aws-lambda';

import { middyfy } from '@libs/lambda';

jest.mock('@libs/lambda');

describe('getProductsList', () => {
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
        const event = {} as any;

        const actual = await main(event);
        expect(actual).toEqual({
            "productsList": [
                {
                    "count": 4,
                    "description": "App for finding cheap flights to Mars",
                    "id": 1,
                    "price": 2.4,
                    "title": "Mars For Everyone"
                },
                {
                    "count": 6,
                    "description": "App for ordering food from Venus",
                    "id": 2,
                    "price": 10,
                    "title": "Venus On Your Plate"
                },
                {
                    "count": 7,
                    "description": "App for buying houses on Jupiter",
                    "id": 3,
                    "price": 23,
                    "title": "Sweet Home Jupiter"
                },
                {
                    "count": 12,
                    "description": "App for studying online with best mentors from our galaxy ",
                    "id": 4,
                    "price": 15,
                    "title": "Mind Galaxy"
                },
                {
                    "count": 7,
                    "description": "App for finding a job of your dream on Saturn",
                    "id": 5,
                    "price": 23,
                    "title": "Best Jobs On Saturn"
                }
            ]
        });
    });
});