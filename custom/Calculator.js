import { Calculator as Template } from '../template/Calculator.class.js';
/**
 * 계산기
 * 기능 : 2진법, 10진법 연산 처리 및 결과값 변환
 *
 *
 * model
 * 인터페이스 구현?
 * 모델 내 버튼의 형태와 위치 처리 값(숫자, 연산자 등)
 * 모델 변환하여 다른 방식?
 */
class Calculator extends HTMLElement
{
    #default_model = 'Decimal';

    #module = '';// init module

    #inputValue = ''; // 현재 입력된 값
    #previousValue = ''; // 이전 값
    #operation = '';  // 연산자
    #previousOperation = '';  // 결과 전 연산자

    constructor() 
    {
        super();
        this.attachShadow({ mode: 'open' });
		this.addEventListener('click', this.#onClick.bind(this));
    }

    #onClick(e)
	{
		e.composedPath().find(node =>
		{
			if (typeof(node.className) === 'object' || !node.className || !node.className.match(/command/)) return false;

            // 로마
			// if (node.classList.contains('command-model-change-Roman-numeral'))
			// {
			// 	return true;
			// }

            // 10진수
			if (node.classList.contains('command-change-decimal'))
            {
                if(this.#default_model === 'Decimal') return true;
                this.#getModel('Decimal');
				return true;
            }

            // 2진수
			if (node.classList.contains('command-change-binary'))
            {
                if(this.#default_model === 'Binary') return true;
                this.#getModel('Binary');
				return true;
            }

            if (node.tagName === 'BUTTON') {
                const value = node.getAttribute('data-value');
                if (!isNaN(value) || value === '.') {
                    this.#inputNumber(value);
                } else if (['+', '-', 'x', '/', '%'].includes(value)) {
                    this.#inputOperator(value);
                } else if (value === '=') {
                    this.#calculate();
                } else if (value === 'AC') {
                    this.#clear();
                } else if (value === '<') {
                    this.#delete();
                }
                return true;
            }

		})
	}

    connectedCallback()
    {
        this.#render();
        this.#getModel(this.#default_model);
    }

	disconnectedCallback()
	{
		this.removeEventListener('click', this.#onClick);
	}

	async #getModel(model)
	{
        try {
            this.#default_model = model;
            const calculatorModel = await import(`/model/${model}.class.js`);
            this.#module = calculatorModel[model];

            const calculator = await this.#module.getCalculator();

            this.#renderCalculator(calculator);
            this.#renderButtons(calculator);
            if(this.#inputValue !== ''){
                let result = this.#module.calculate(this.#inputValue);
                this.#inputValue = result;
                this.#updateInput(result);
            }
        } catch (error) {
            console.error('Error loading model:', error);
        }
    }

    #updateInput(value)
    {
        const input = this.shadowRoot.querySelector('.calculator-input');
        input.value = value;
    }

    #inputNumber(value)
    {
        if (this.#operation) {
            // 새로운 연산을 시작할 때
            if (!this.#previousValue) {
                this.#previousValue = this.#inputValue;
            }
            this.#inputValue = value;
            this.#previousOperation = this.#operation;
            this.#operation = '';
        } else {
            this.#inputValue += value;
        }
        this.#updateInput(this.#inputValue);
    }

    #inputOperator(operator)
    {
        if (this.#inputValue) {
            this.#operation = operator;
            this.#updateInput(this.#inputValue + operator);
        }
    }

    #calculate()
    {
        if (this.#previousValue && this.#inputValue && this.#previousOperation) {
            let result = this.#module.calculate(this.#inputValue, this.#previousValue, this.#previousOperation);

            this.#inputValue = result;
            this.#previousValue = ''; // 이전 값을 초기화
            this.#operation = '';     // 연산자 초기화
            this.#previousOperation = ''; // 연산자 초기화
            this.#updateInput(result); // 결과값 업데이트
        }
    }

    #clear()
    {
        this.#inputValue = '';
        this.#previousValue = '';
        this.#operation = '';
        this.#previousOperation = '';
        this.#updateInput('');
    }

    #delete()
    {
        this.#inputValue = this.#inputValue.slice(0, -1);
        this.#updateInput(this.#inputValue);
    }

    #renderCalculator(calculator)
    {
        const calculatorBox = this.shadowRoot.querySelector('.calculator-box');
        const buttonBox = this.shadowRoot.querySelector('.calculator-button-box');

        this.#applyStyles(calculatorBox, buttonBox, calculator);
    }

    #applyStyles(calculatorBox, buttonBox, calculator)
    {
        calculatorBox.style.backgroundColor = `${calculator.body.thema ?? '#fff'}`;
        buttonBox.style.display = 'grid';
        buttonBox.style.gridTemplateColumns = `repeat(${calculator.body.grid.cols ?? 4}, 1fr)`;

        if (calculator.body.grid.gap) {
            buttonBox.style.gridGap = calculator.body.grid.gap;
        }
    }

    #renderButtons(calculator)
    {
        const buttonBox = this.shadowRoot.querySelector('.calculator-button-box');
        const buttons = calculator.buttons;

        buttonBox.innerHTML = '';
        buttons.forEach(buttonOption => {
            const button = this.#createButton(buttonOption);
            buttonBox.appendChild(button);
        });
    }

    #createButton(buttonOption)
    {
        const button = document.createElement('button');

        button.setAttribute('data-value', buttonOption.value);
        button.textContent = buttonOption.value;
        button.className = 'command-button'
        if(buttonOption.height){
            button.style.height = `${buttonOption.height}`;
        }
        if (buttonOption.rows) {
            button.style.gridRow = `span ${buttonOption.rows}`;
        }

        return button;
    }

	#render()
	{
        const template = new Template();
        this.shadowRoot.innerHTML = template.getTemplate();
	}
}

customElements.define('cmp-calculator', Calculator);