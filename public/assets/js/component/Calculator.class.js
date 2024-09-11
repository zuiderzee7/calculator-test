class Calculator extends HTMLElement
{
    #mode;
    #currentMode = 'Decimal';
    #previousMode = '';// prev mode

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

    async connectedCallback()
    {
        await LazyLoader.getInstance().whenDefined(`model-base-calculator`);
        
        this.#render();
        this.#setMode(this.#currentMode);
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
            //     if(this.#currentMode === 'Decimal') return true;
            //     this.#previousMode = this.#currentMode;
            //     this.#setMode('Decimal');
			// 	return true;
            // }

			if (node.classList.contains('command-mode-change'))
            {
                const dataMode = node.dataset.mode.replace(/\b\w/, (match) => match.toUpperCase());
                if(this.#currentMode === dataMode) return true;
                this.#previousMode = this.#currentMode;
                this.#setMode(dataMode);
				return true;
            }

            if (node.tagName === 'BUTTON' && node.classList.contains('command-button')) 
            {
                const value = node.dataset.value;
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

    /* mode는 Decimal or Binary 임 */
	async #setMode(mode)
	{
        try 
        {
            this.#currentMode = mode;
            //const { [mode]: classObject } = await import(`/public/assets/js/model/${mode}.class.js`);
            
            const { [mode]: classObject } = await LazyLoader.getInstance().whenDefined(`model-${mode}`);
            this.#mode = classObject;

            const calculatorMode = await this.#mode.getCalculator();
            this.#renderCalculator(calculatorMode);
            this.#renderButtons(calculatorMode);

            if(this.#inputValue !== ''){
                let result = this.#mode.convertValue(this.#inputValue, this.#previousMode);
                this.#inputValue = result;
                this.#updateInput(result);
            }
        }
        catch (error) 
        {
            console.error('Error loading mode:', error);
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
            const result = this.#mode.calculate(this.#inputValue, this.#previousValue, this.#previousOperation);
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

    #renderCalculator(calculatorMode)
    {
        const calculatorBox = this.shadowRoot.querySelector('.calculator-box');
        const buttonBox = this.shadowRoot.querySelector('.calculator-button-box');

        this.applyStyles(calculatorBox, buttonBox, calculatorMode);
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
        this.shadowRoot.innerHTML = this.getDefaultTemplate();
	}

    getDefaultTemplate()
    {
        return `
            <style>
                main {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding-top: 1.25rem;
                }
                .calculator-box {
                    width: 100%;
                    max-width: 480px;
                    aspect-ratio: 4 / 6;
                    background-color: ${this.backgroundColor};
                    padding: 1.25rem;
                    border-radius: 0.75rem;
                    border: 1px solid ${this.buttonColor};
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
                }
                .calculator-input-box {
                    margin-bottom: 0.75rem;
                }
                input.calculator-input {
                    width: 100%;
                    height: ${this.inputHeight};
                    padding: ${this.padding};
                    font-size: 1.25rem;
                    background-color: #2c2c2c;
                    color: #ffffff;
                    border: none;
                    border-radius: 0.5rem;
                    box-sizing: border-box;
                    text-align: right;
                }
                .calculator-body {
                    margin-top: 0.5rem;
                }
                .options {
                    margin-top: 1rem;
                    display: flex;
                    gap: 0.5rem;
                }
                .options button {
                    padding: 0.5rem 1rem;
                    border: none;
                    border-radius: 0.25rem;
                    padding: 0.5rem 1rem;
                    cursor: pointer;
                }
                .options button:hover {
                    background-color: #e0e0e0;
                }
                .command-button:hover {
                    background-color: #555555;
                }
                .command-button:active {
                    background-color: #777777;
                }
            </style>

            <main>
                <div class="calculator-box">
                    <div class="calculator-input-box">
                        <input class="calculator-input" name="cal" type="text" readonly/>
                    </div>
                    <div class="calculator-body">
                        <div class="calculator-button-box"></div>
                    </div>
                </div>
                <div class="options">
                    <button type="button" class="command-mode-change" data-mode="binary">2진수</button>
                    <button type="button" class="command-mode-change" data-mode="Decimal">10진수</button>
                </div>
            </main>
        `;
    }

    #applyTheme()
    {
        const theme = {
            backgroundColor: '#000',
            buttonColor: '#000000',
            inputHeight: '2.5rem',
            padding: '0 0.75rem',
            gridCols: 4,
            gridGap: '4px',
        };

        Object.assign(this, theme);
    }

    applyStyles(calculatorBox, buttonBox, calculatorModel)
    {
        this.#applyTheme();
        const { thema, grid } = calculatorModel.body;

        calculatorBox.style.backgroundColor = `${thema ?? this.backgroundColor}`;
        buttonBox.style.display = 'grid';
        buttonBox.style.gridTemplateColumns = `repeat(${grid.cols ?? this.gridCols}, 1fr)`;
        buttonBox.style.gridGap = `${grid.gap ?? this.gridGap}`;
    }
}

customElements.define('cmp-calculator', Calculator);