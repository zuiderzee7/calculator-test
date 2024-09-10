import { Calculator as Template } from '../template/Calculator.class.js';

class Calculator extends HTMLElement
{
    #template;

    #model;
    #currentModel = 'Decimal';
    #previousModel = '';// prev model

    #inputValue = ''; // 현재 입력된 값
    #previousValue = ''; // 이전 값
    #operation = '';  // 연산자
    #previousOperation = '';  // 결과 전 연산자

    constructor() 
    {
        super();
        this.attachShadow({ mode: 'open' });
        this.#template = new Template();
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
			// if (node.classList.contains('command-change-decimal'))
            // {
            //     if(this.#currentModel === 'Decimal') return true;
            //     this.#previousModel = this.#currentModel;
            //     this.#setModel('Decimal');
			// 	return true;
            // }

			if (node.classList.contains('command-model-change'))
            {
                const dataModel = node.getAttribute('data-model').replace(/\b\w/, (match) => match.toUpperCase());
                if(this.#currentModel === dataModel) return true;
                this.#previousModel = this.#currentModel;
                this.#setModel(dataModel);
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
            const { [model]: Model } = await import(`/model/${model}.class.js`);
            this.#model = Model;

            const calculatorModel = await this.#model.getCalculator();
            this.#renderCalculator(calculatorModel);
            this.#renderButtons(calculatorModel);

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

    #renderCalculator(calculatorModel)
    {
        const calculatorBox = this.shadowRoot.querySelector('.calculator-box');
        const buttonBox = this.shadowRoot.querySelector('.calculator-button-box');

        this.#template.applyStyles(calculatorBox, buttonBox, calculatorModel);
    }

    #renderButtons({buttons})
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
        this.shadowRoot.innerHTML = this.#template.getTemplate();
	}
}

customElements.define('cmp-calculator', Calculator);