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
    #currentModel = 'Decimal';
    #previousModel = '';// prev model

    #model;// init model

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

    connectedCallback()
    {
        this.#render();
        this.#setModel(this.#currentModel);
    }

	disconnectedCallback()
	{
		this.removeEventListener('click', this.#onClick);
	}

    #onClick(e)
	{
		e.composedPath().find(node =>
		{
			if (typeof(node.className) === 'object' || !node.className || !node.className.match(/command/)) return false;

            // 10진수
			if (node.classList.contains('command-change-decimal'))
            {
                if(this.#currentModel === 'Decimal') return true;
                this.#previousModel = this.#currentModel;
                this.#setModel('Decimal');
				return true;
            }

            // 2진수
			if (node.classList.contains('command-change-binary'))
            {
                if(this.#currentModel === 'Binary') return true;
                this.#previousModel = this.#currentModel;
                this.#setModel('Binary');
				return true;
            }

            if (node.tagName === 'BUTTON' && node.classList.contains('command-button')) 
            {
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

	async #setModel(model)
	{
        try 
        {
            this.#currentModel = model;
            const { [model]: calculatorModel } = await import(`/model/${model}.class.js`);
            this.#model = calculatorModel;

            const calculator = await this.#model.getCalculator();
            this.#renderCalculator(calculator);
            this.#renderButtons(calculator.buttons);

            if(this.#inputValue !== ''){
                let result = this.#model.convertValue(this.#inputValue, this.#previousModel);
                this.#inputValue = result;
                this.#updateInput(result);
            }
        }
        catch (error) 
        {
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
        if (this.#operation) 
        {
            // 새로운 연산을 시작할 때
            if (!this.#previousValue) this.#previousValue = this.#inputValue;
            this.#inputValue = value;
            this.#previousOperation = this.#operation;
            this.#operation = '';
        }
        else
        {
            this.#inputValue += value;
        }
        this.#updateInput(this.#inputValue);
    }

    #inputOperator(operator)
    {
        if (this.#inputValue) 
        {
            this.#operation = operator;
            this.#updateInput(`${this.#inputValue}${operator}`);
        }
    }

    #calculate()
    {
        if (this.#previousValue && this.#inputValue && this.#previousOperation) 
        {
            const result = this.#model.calculate(this.#inputValue, this.#previousValue, this.#previousOperation);
            this.#inputValue = result;
            this.#previousValue = '';
            this.#operation = '';
            this.#previousOperation = '';
            this.#updateInput(result);
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
        const { thema, grid } = calculator.body;

        this.#applyStyles(calculatorBox, buttonBox, thema, grid.cols, grid.gap);
    }

    #applyStyles(calculatorBox, buttonBox, thema = '#fff', gridCols = 4, gridGap = '0px')
    {
        calculatorBox.style.backgroundColor = `${thema}`;
        buttonBox.style.display = 'grid';
        buttonBox.style.gridTemplateColumns = `repeat(${gridCols}, 1fr)`;
        buttonBox.style.gridGap = gridGap;
    }

    #renderButtons(buttons)
    {
        const buttonBox = this.shadowRoot.querySelector('.calculator-button-box');
        buttonBox.innerHTML = '';

        buttons.forEach(buttonOption => {
            buttonBox.appendChild(this.#createButton(buttonOption));
        });
    }

    #createButton(buttonOption)
    {
        const button = document.createElement('button');

        button.setAttribute('data-value', buttonOption.value);
        button.textContent = buttonOption.value;
        button.className = 'command-button';
        
        if(buttonOption.height) button.style.height = `${buttonOption.height}`;
        if (buttonOption.rows) button.style.gridRow = `span ${buttonOption.rows}`;

        return button;
    }

	#render()
	{
        const template = new Template();
        this.shadowRoot.innerHTML = template.getTemplate();
	}
}

customElements.define('cmp-calculator', Calculator);