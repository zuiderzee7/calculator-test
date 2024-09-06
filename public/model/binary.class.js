export class binary
{
    static async getCalculator()
    {
        return new Promise((resolve) => {
            resolve(
                {
                    body: this.body(),
                    buttons: this.buttons(this.buttonOption()),
                }
            )
        });
    }

    static buttonOption(option = null){
        return option ?? {
            height : '4rem'
        };
    }

    static body()
    {
        return {
            thema: 'black',
            grid: {
                cols: 4,
                gap: '4px'
            },
            button: {
                size: '1rem'
            }
        };
    }

    static buttons(button_option)
    {
        return [
            {
                value: '0'
            },
            {
                value: '1',
            },
            {
                value: 'x',
            },
            {
                value: '=',
                rows: 2
            },
            {
                value: '+',
            },
            {
                value: '-',
            },
            {
                value: '/',
            }
        ];
    }
}