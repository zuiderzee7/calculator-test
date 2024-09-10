const DEFAULT_THEME = {
    backgroundColor: '#fff',
    buttonColor: '#000000',
    inputHeight: '2.5rem',
    padding: '0 0.75rem'
};

export class Calculator
{
    static #instance;
    constructor(theme = DEFAULT_THEME) 
    {
        if (Calculator.#instance) 
        {
            return Calculator.#instance;
        }

        this.#applyTheme(theme);
        Calculator.#instance = this;
    }

    #applyTheme({ backgroundColor, buttonColor, inputHeight, padding }) 
    {
        this.backgroundColor = backgroundColor || DEFAULT_THEME.backgroundColor;
        this.buttonColor = buttonColor || DEFAULT_THEME.buttonColor;
        this.inputHeight = inputHeight || DEFAULT_THEME.inputHeight;
        this.padding = padding || DEFAULT_THEME.padding;
    }

    applyStyles(calculatorBox, buttonBox, calculatorModel)
    {
        const { thema, grid } = calculatorModel.body;

        calculatorBox.style.backgroundColor = `${thema ?? this.backgroundColor}`;
        buttonBox.style.display = 'grid';
        buttonBox.style.gridTemplateColumns = `repeat(${grid.cols ?? 4}, 1fr)`;
        buttonBox.style.gridGap = `${grid.gap ?? '0px'}`;
    }

    getTemplate()
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
                        <input class="calculator-input" type="text" readonly/>
                    </div>
                    <div class="calculator-body">
                        <div class="calculator-button-box"></div>
                    </div>
                </div>
                <div class="options">
                    <button type="button" class="command-change-binary">2진수</button>
                    <button type="button" class="command-change-decimal">10진수</button>
                </div>
            </main>
        `;
    }
}
