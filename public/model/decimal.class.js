export class decimal
{
    static async getCalculator()
    {
        return new Promise((resolve) => {
            resolve(
                {
                    body: decimal.body(),
                    option: {
                        button: decimal.button(),
                    }
                }
            )
        });
    }

    static body()
    {
        return {
            thema: 'gray',
            grid: {
                cols: 4,
                gap: '4px'
            }
        };
    }
    
    static button()
    {
        return [
            {
                value: 'AC',
            },
            {
                value: '%',
            },
            {
                value: '/',
            },
            {
                value: '<',
            },
            {
                value: '7'
            },
            {
                value: '8',
            },
            {
                value: '9',
            },
            {
                value: 'x',
            },
            {
                value: '4',
            },
            {
                value: '5',
            },
            {
                value: '6',
            },
            {
                value: '+',
                rows: 2
            },
            {
                value: '1',
            },
            {
                value: '2',
            },
            {
                value: '3',
            },
            {
                value: '.',
            },
            {
                value: '0',
            },
            {
                value: '-',
            },
            {
                value: '=',
            }
        ];
    }
}