import { html, LitElement } from '@polymer/lit-element';
import { roll } from './classes';
import { SharedStyles } from './shared-styles';

import '@polymer/paper-input/paper-input';
import '@polymer/paper-icon-button';

let vm;

class DmDiceRoller extends LitElement {
  render() {
    return html`
      ${SharedStyles}
      <style>
        [container] {
          display: grid;
          grid-template-columns: repeat(5, 20%);
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        [icon-wrapper] {
          text-align: center;
        }

        h3 {
          font-family: 'TiamatRegular', serif;
        }
      </style>
      <div container>
        <h3>Amount</h3>
        <h3>Die</h3>
        <h3>Modfier</h3>
        <h3>Roll</h3>
        <h3>Result</h3>
       ${this._diceTypes.map(d => this._getDieInput(d))}
      </div>
    `;
  }

  constructor() {
    super();

    this._diceTypes = [
      {
        name: 'd6',
        type: 6,
        mod: 0,
        amount: 1,
        result: 0,
      },
      {
        name: 'd8',
        type: 8,
        mod: 0,
        amount: 1,
        result: 0,
      },
      {
        name: 'd10',
        type: 10,
        mod: 0,
        amount: 1,
        result: 0,
      },
      {
        name: 'd12',
        type: 12,
        mod: 0,
        amount: 1,
        result: 0,
      },
      {
        name: 'd20',
        type: 20,
        mod: 0,
        amount: 1,
        result: 0,
      },
    ];
    this._modifier = 0;
    this._amount = 1;

    vm = this;
  }

  static get properties() {
    return {
      _diceTypes: { type: Array },
      _modifier: { type: Number },
      _amount: { type: Number },
    };
  }

  _roll() {
    this.result = roll(this.type, this.amount, Number(this.mod));
    vm.requestUpdate();
  }

  _modifierChange({ target: { value } }) {
    this.mod = Number(value);
  }

  _amountChanged({ target: { value } }) {
    this.amount = Number(value);
  }

  _getDieInput(diceType) {
    return html`
      <paper-input 
        prevent-invalid-input
        allowed-pattern="[0-9]"
        always-float-label
        .value="${this._amount}"
        @change="${this._amountChanged.bind(diceType)}">
      </paper-input>
      <h3>${diceType.name}</h3>
      <paper-input
        prevent-invalid-input
        allowed-pattern="[0-9]"
        always-float-label
        .value="${this._modifier}"
        @change="${this._modifierChange.bind(diceType)}">
      </paper-input>
      <div icon-wrapper>
        <paper-icon-button 
          src="https://static.thenounproject.com/png/1173491-200.png"
          @click="${this._roll.bind(diceType)}">
        </paper-icon-button>
      </div>
      <h3>
        ${diceType.result}
      </h3>
    `;
  }
}

window.customElements.define('dm-dice-roller', DmDiceRoller);
