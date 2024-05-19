import { DateTime } from 'luxon';

/* Get the current instant */
const now = DateTime.now();

/* tslint:disable:max-line-length */
export const finance = {
    recentTransactions: [
        {
            id           : '1b6fd296-bc6a-4d45-bf4f-e45519a58cf5',
            transactionId: '528651571NT',
            name         : 'Morgan Page',
            amount       : +1358.75,
            status       : 'completed',
            date         : '2019-10-07T22:22:37.274Z',
        },
        {
            id           : '2dec6074-98bd-4623-9526-6480e4776569',
            transactionId: '421436904YT',
            name         : 'Nita Hebert',
            amount       : -1042.82,
            status       : 'completed',
            date         : '2019-12-18T14:51:24.461Z',
        },
        {
            id           : 'ae7c065f-4197-4021-a799-7a221822ad1d',
            transactionId: '685377421YT',
            name         : 'Marsha Chambers',
            amount       : +1828.16,
            status       : 'pending',
            date         : '2019-12-25T17:52:14.304Z',
        },
        {
            id           : '0c43dd40-74f6-49d5-848a-57a4a45772ab',
            transactionId: '884960091RT',
            name         : 'Charmaine Jackson',
            amount       : +1647.55,
            status       : 'completed',
            date         : '2019-11-29T06:32:16.111Z',
        },
        {
            id           : 'e5c9f0ed-a64c-4bfe-a113-29f80b4e162c',
            transactionId: '361402213NT',
            name         : 'Maura Carey',
            amount       : -927.43,
            status       : 'completed',
            date         : '2019-11-24T12:13:23.064Z',
        },
    ],
};
