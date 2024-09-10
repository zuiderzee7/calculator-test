export class BaseCalculator
{
    static OPTION = {
        height: '4',
        buttonOptions: {
            '+': { rows: 2 }
        }
    };

    static NUMBER = {
        Decimal : 10,
        Binary : 2
    }

    static async getCalculator()
    {
        return new Promise((resolve) => {
            resolve({
                body: this.body(),
                buttons: this.buttons(),
            });
        });
    }

    static buttonOption(option)
    {
        this.OPTION = option;
    }

    static body()
    {
        return {
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
        return [];
    }

    static getButtonList(buttons)
    {
        return buttons.map(value => ({
            value,
            height: this.OPTION.buttonOptions[value]?.rows ?? (this.OPTION.buttonOptions[value]?.height ?? this.OPTION.height+'rem'),
            rows: this.OPTION.buttonOptions[value]?.rows
        }));
    }

    static convertValue(currentValue, number = 'Decimal')
    {
        return this.convertCurrentValue(currentValue, this.NUMBER[number]);
    }

    static calculate(currentValue, previousValue = null, operator = null)
    {
        const prev = this.parseValue(previousValue);
        const current = this.parseValue(currentValue);
        let result;

        switch (operator) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case 'x':
                result = prev * current;
                break;
            case '/':
                result = prev / current;
                break;
            case '%':
                result = prev % current;
                break;
            default:
                console.error('error operator : ', operator);
                return '';
        }
        return this.formatResult(result);
    }

    static convertCurrentValue(value, number)
    {
        // 변환 로직을 서브클래스에서 구현
        console.error('error method : convertCurrentValue');
        return '';
    }

    static parseValue(value)
    {
        return parseFloat(value);
    }

    static formatResult(result)
    {
        return result.toString();
    }
}