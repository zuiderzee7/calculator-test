export class binary
{
    static async getCalculator()
    {
        return new Promise((resolve) => {
            resolve(
                {
                    body: binary.body(),
                    option: {
                        button: binary.button(),
                    }
                }
            )
        });
    }

    static body()
    {
        return {
            thema: 'black',
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
                value: '0'
            },
            {
                value: '1',
            },
            {
                value: '-',
            },
            {
                value: '+',
            },
            {
                value: '/',
            },
            {
                value: 'x',
            },
            {
                value: '=',
            }
        ];
    }
}