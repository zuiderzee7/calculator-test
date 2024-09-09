import { BaseCalculator } from './BaseCalculator.class.js';

export class Binary extends BaseCalculator
{
    static body() {
        return {
            ...super.body(),
            thema: 'gray'
        };
    }

    static buttons()
    {
        const buttonList = [
            'AC', '%', '/', '<', '0', '1', '+', '=', 'x', '-'
        ];
        this.buttonOption(
            {
                height: '4',
                buttonOptions: {
                    '+': { rows: 2 },
                    '=': { rows: 2 }
                }
            }
        )
        return this.getButtonList(buttonList);
    }

    static convertCurrentValue(value, number)
    {
        return parseInt(value, number).toString(2); // 10진수에서 2진수로 변환
    }

    static parseValue(value)
    {
        return parseInt(value, 2); // 2진수로 변환
    }

    static formatResult(result)
    {
        return result.toString(2); // 결과를 2진수로 반환
    }
}