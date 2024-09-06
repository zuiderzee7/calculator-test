export class decimal
{
    static OPTION = {
        height : '4rem'
    };
    
    static async getCalculator()
    {
        return new Promise((resolve) => {
            resolve(
                {
                    body: this.body(),
                    buttons: this.buttons(),
                }
            )
        });
    }

    static buttonOption(option){
        this.OPTION = option;
    }
    
    static body()
    {
        return {
            thema: 'gray',
            grid: {
                cols: 4,
                gap: '4px'
            },
            button: {
                size: '1rem'
            }
        };
    }

    static buttons()
    {
        const buttonList = [
            'AC', '%', '/', '<', '7', '8', '9', 'x', '4', '5', '6', '+', '1', '2', '3', '.', '0', '-', '='
        ];
        return buttonList.map(value => ({
            value,
            ...(value !== '+' && {height: this.OPTION.height}),
            ...(value === '+' && { rows: 2 }), // '+' 버튼에만 rows 속성 추가
        }));

        return [
            {
                value: 'AC',
                height: button_option.height
            },
            {
                value: '%',
                height: button_option.height
            },
            {
                value: '/',
                height: button_option.height
            },
            {
                value: '<',
                height: button_option.height
            },
            {
                value: '7',
                height: button_option.height
            },
            {
                value: '8',
                height: button_option.height
            },
            {
                value: '9',
                height: button_option.height
            },
            {
                value: 'x',
                height: button_option.height
            },
            {
                value: '4',
                height: button_option.height
            },
            {
                value: '5',
                height: button_option.height
            },
            {
                value: '6',
                height: button_option.height
            },
            {
                value: '+',
                rows: 2,
            },
            {
                value: '1',
                height: button_option.height
            },
            {
                value: '2',
                height: button_option.height
            },
            {
                value: '3',
                height: button_option.height
            },
            {
                value: '.',
                height: button_option.height
            },
            {
                value: '0',
                height: button_option.height
            },
            {
                value: '-',
                height: button_option.height
            },
            {
                value: '=',
                height: button_option.height
            }
        ];
    }
}