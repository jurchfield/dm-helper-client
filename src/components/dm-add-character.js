import { html, LitElement } from '@polymer/lit-element';

import { SharedStyles } from './shared-styles';

import '@polymer/iron-form';
import '@polymer/paper-button';
import '@polymer/paper-icon-button';
import '@polymer/iron-icons';
import '@polymer/paper-input/paper-input';
import '@polymer/paper-input/paper-textarea';

import './dm-card';

let vm;

class DmAddCharacter extends LitElement {
  render() {
    return html`
      ${SharedStyles}
      <style>
        [dual-container] {
          display: grid;
          grid-template-columns: 20% auto;
          grid-gap: 5%;
          width: 100%;
        }

        [inner-card] {
          margin: 2% auto 2% auto;
        }

        [scores-container] {
          display: grid;
          grid-template-columns: repeat(6, auto);
          grid-gap: 5%;
        }

        [name-container] {
          display: grid;
          grid-template-columns: 90% auto;
          grid-gap: 5%;
          align-items: center;
        }
      </style>
      <dm-card>
        <div slot="header">Add New Character</div>
        <div slot="content">
          <iron-form
            id="character-form"
            @iron-form-submit="${this._onFormSubmitted.bind(this)}">
            <form character-form>
              <dm-card inner-card>
                <div slot="content">
                  <paper-input 
                    label="Name" 
                    name="name"
                    value="New Player"
                    type="text"
                    required>
                  </paper-input>
                  <paper-input 
                    label="Level" 
                    name="level"
                    value="1"
                    type="text"
                    required>
                  </paper-input>
                  <paper-input 
                    label="Race" 
                    name="race"
                    type="text"
                    value="Human"
                    required>
                  </paper-input>
                  <paper-input 
                    label="Alignment" 
                    name="alignment"
                    value="No Alignment"
                    type="text">
                  </paper-input>
                </div>
              </dm-card>
              <dm-card inner-card>
                <div slot="content">
                  <div dual-container>
                    <paper-input 
                      label="Hit Points" 
                      name="hit_points"
                      value="1"
                      type="number">
                    </paper-input>
                    <paper-input 
                    label="Hit Dice" 
                    name="hit_dice"
                    value="1d1+0"
                    type="text">
                    </paper-input>
                  </div>
                  <paper-input 
                    label="Armor Class" 
                    name="armor_class"
                    value="10"
                    type="number">
                  </paper-input>
                </div>
              </dm-card>
              <dm-card inner-card>
                <div slot="content">
                  <div scores-container>
                    <paper-input 
                      label="Str" 
                      name="strength"
                      value="10"
                      type="number"
                      required>
                    </paper-input>
                    <paper-input 
                      label="Dex" 
                      name="dexterity"
                      value="10"
                      type="number"
                      required>
                    </paper-input>
                    <paper-input 
                      label="Con" 
                      name="constitution"
                      value="10"
                      type="number"
                      required>
                    </paper-input>
                    <paper-input 
                      label="Int" 
                      name="intelligence"
                      value="10"
                      type="number"
                      required>
                    </paper-input>
                    <paper-input 
                      label="Wis" 
                      name="wisdom"
                      value="10"
                      type="number"
                      required>
                    </paper-input>
                    <paper-input 
                      label="Cha" 
                      name="charisma"
                      value="10"
                      type="number"
                      required>
                    </paper-input>
                  </div>
                </div>
              </dm-card>
              ${this._generateListBox('traits')}
              ${this._generateListBox('actions')}
              ${this._generateListBox('reactions')}
              ${this._generateListBox('legendary_actions')}
            </form>
          </iron-form>
        </div>
        <div slot="actions">
          <paper-button
            @click="${this._onSubmit.bind(this)}">
            Create
          </paper-button>
        </div>
      </dm-card>
    `;
  }

  static get properties() {
    return {
      traits: { type: Array },
      actions: { type: Array },
      reactions: { type: Array },
      legendary_actions: { type: Array },
    };
  }

  constructor() {
    super();
    vm = this;
    this.traits = [];
    this.actions = [];
    this.reactions = [];
    this.legendary_actions = [];
  }

  _generateListBox(type) {
    return html`
    <dm-card inner-card>
      <div slot="header">
        ${type}
      </div>
      <div slot="content">
        ${this[type].length === 0 ? html`No ${type} added.` : ''}
        ${this[type].map((t, index) => html`
        <div name-container>
          <paper-input
            required
            label="Name"
            name="${type}">
          </paper-input>
          <paper-icon-button
            icon="close"
            title="Remove"
            @click="${this._removeItem.bind({ type, index })}">
            Start
          </paper-icon-button>
        </div>
       
        <paper-textarea
          required
          label="Description"
          rows="3"
          name="${type}">
        </paper-textarea>
        `)}
      </div>
      <div slot="actions">
        <paper-button
          @click="${this._addItem.bind({ type, index: (this[type].length + 1) })}">
          Add
        </paper-button>
      </div>
    </dm-card>
    `;
  }

  _onSubmit() {
    this.shadowRoot.querySelector('#character-form').submit();
  }

  _onFormSubmitted({ detail }) {
    const {
      traits,
      actions,
      reactions,
      legendary_actions,
      ...props
    } = detail;

    const character = {
      special_abilities: this._createNameDescArray(traits),
      actions: this._createNameDescArray(actions),
      reactions: this._createNameDescArray(reactions),
      legendary_actions: this._createNameDescArray(legendary_actions),
      ...props,
    };

    console.log(character);

    this.dispatchEvent(new CustomEvent('character-added', { detail: character }));
  }

  _addItem() {
    vm[this.type].push(this.index);
    vm.requestUpdate();
  }

  _removeItem() {
    vm[this.type].splice(this.index, 1);
    vm.requestUpdate();
  }

  _createNameDescArray(arr = []) {
    return arr.reduce((pV, name, i) => {
      if ((i + 1) % 2 == 0) return pV;

      pV.push({
        name,
        desc: arr[i + 1],
      });
      return pV;
    }, []);
  }
}

window.customElements.define('dm-add-character', DmAddCharacter);
