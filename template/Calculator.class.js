export class Calculator
{
    constructor(
    {
        backgroundColor = '#ffffff',
        buttonColor = '#000000',
        inputHeight = '2.5rem',
        padding = '0 0.75rem'
    } = {}) {
        this.backgroundColor = backgroundColor;
        this.buttonColor = buttonColor;
        this.inputHeight = inputHeight;
        this.padding = padding;
    }

    getTemplate()
    {
        return `
            <style>
                section {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding-top: 1.25rem;
                }
                .calculator-box {
                    width: 50vw;
                    max-width: 480px;
                    aspect-ratio: 4 / 6;
                    background-color: ${this.backgroundColor};
                    padding: 1.25rem;
                    border-radius: 0.75rem;
                    border: 1px solid ${this.buttonColor};
                }
                input.calculator-input {
                    width: 100%;
                    height: ${this.inputHeight};
                    padding: ${this.padding};
                    box-sizing: border-box;
                }
                .calculator-body {
                    margin-top: 0.5rem;
                }
                .options button {
                    margin: 0.5rem;
                    border: none;
                    border-radius: 0.25rem;
                    padding: 0.5rem 1rem;
                    cursor: pointer;
                }
            </style>

            <section>
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
            </section>
        `;
    }
}
