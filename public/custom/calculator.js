
/**
 * 계산기
 * 기능 : 2진법, 10진법 연산 처리 및 결과값 변환
 */
class Calculator extends HTMLElement
{
    #defalt_model = 'decimal';

    constructor() 
    {
        super();
        this.attachShadow({ mode: 'open' });
		this.addEventListener('click', this.#onClick);
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

            console.log(node.classList);
            // 10진수
			if (node.classList.contains('command-change-decimal'))
            {
                this.#getModel('decimal');
				return true;
            }

            // 2진수
			if (node.classList.contains('command-change-binary'))
            {
                this.#getModel('binary');
				return true;
            }

		})
	}

    connectedCallback() {
        this.#render();
        this.#getModel(this.#defalt_model);
    }

	disconnectedCallback()
	{
		this.removeEventListener('click', this.#onClick);
	}
    // model
    // 인터페이스 구현?
    // 모델 내 버튼의 형태와 위치 처리 값(숫자, 연산자 등) 
    // 모델 변환하여 다른 방식?
	async #getModel(model)
	{
        try {
            const calculatorModel = await import(`../model/${model}.class.js`);
            const module = calculatorModel[model];
            // module.buttonOption({
            //     height: '7rem'
            // });
            const calculator = await module.getCalculator();

            console.log(calculator);
    
            this.#renderCalculator(calculator)
            this.#renderButtons(calculator)
        } catch (error) {
            console.error('Error loading model:', error);
        }
    }

    #renderCalculator(calculator) {
        const calculatorBox = this.shadowRoot.querySelector('.calculator-box');
        const buttonBox = this.shadowRoot.querySelector('.calculator-button-box');

        this.#applyStyles(calculatorBox, buttonBox, calculator);
    }

    #applyStyles(calculatorBox, buttonBox, calculator) {
        calculatorBox.style.backgroundColor = `${calculator.body.thema ?? '#fff'}`;
        buttonBox.style.display = 'grid';
        buttonBox.style.gridTemplateColumns = `repeat(${calculator.body.grid.cols ?? 4}, 1fr)`;

        if (calculator.body.grid.gap) {
            buttonBox.style.gridGap = calculator.body.grid.gap;
        }
    }

    #renderButtons(calculator) {
        const buttonBox = this.shadowRoot.querySelector('.calculator-button-box');
        const buttons = calculator.buttons;

        buttonBox.innerHTML = '';
        buttons.forEach(buttonOption => {
            const button = this.#createButton(buttonOption);
            buttonBox.appendChild(button);
        });
    }

    #createButton(buttonOption) {
        const button = document.createElement('button');

        button.setAttribute('data-value', buttonOption.value);
        button.textContent = buttonOption.value;
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
		this.shadowRoot.innerHTML = this.#getTemplate();
	}

    #getTemplate(){
        return `
            <style>
                section {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding-top: 1.25rem;
                }
                .calculator-box{
                    width: 50vw;
                    max-width: 480px;
                    aspect-ratio: 4 / 6;
                    background-color: #ffffff;
                    padding: 1.25rem;
                    border-radius: 0.75rem;
                    border: 1px solid #000;
                }
                input.calculator-input{
                    width : 100%;
                    height: 2.5rem;
                    #padding: 0 0.75rem;
                    box-sizing:border-box;
                }
                .calculator-body{
                    margin-top: 0.5rem;
                }
            </style>

            <section>
                <div class="calculator-box">
                    <div class="calculator-input-box">
                        <input class="calculator-input" type="number"/>
                    </div>
                    <div class="calculator-body">
                        <div class="calculator-button-box"></div>
                    </div>
                </div>
                <div class="options">
                    <button type="button" class="command-change-binary">2진수</button>
                    <button type="button" class="command-change-decimal">10진수</button>
                </div>
            </section>
        `;
    }
}

customElements.define('cmp-calculator', Calculator);