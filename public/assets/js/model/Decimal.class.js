export class Decimal extends BaseCalculator
{
    static body() {
        return {
            ...super.body(),
            /* grid: {
                cols: 4,
                gap: '4px'
            }, */
        };
    }

    static buttons()
    {
        const buttonList = [
            'AC', '%', '/', '<', '7', '8', '9', 'x', '4', '5', '6', '+', '1', '2', '3', '.', '0', '-', '='
        ];
        return this.getButtonList(buttonList);
    }

    static convertCurrentValue(value, number)
    {
        return parseInt(value, number).toString(10); // 2진수에서 10진수로 변환
    }

    static formatResult(result)
    {
        return result.toString();
    }
}