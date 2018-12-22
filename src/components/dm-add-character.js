import { html, LitElement } from '@polymer/lit-element';

import { SharedStyles } from './shared-styles';
import { Services } from './services';
import { Player } from './classes';

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
          grid-template-columns: 45% 45% auto;
          grid-gap: 2%;
          align-items: center;
        }

        paper-button.create {
          background-color: var(--app-primary-color);
          color: var(--app-light-text-color);
        }
      </style>
      <dm-card showActions>
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
                    label="Alignment" 
                    name="alignment"
                    value="No Alignment"
                    type="text">
                  </paper-input>
                </div>
              </dm-card>
              <dm-card inner-card>
                <div slot="content">
                  <vaadin-combo-box
                    name="race"
                    label="Race"
                    .items="${this._races}"
                    @selected-item-changed="${this._onRaceChanged.bind(this)}">
                  </vaadin-combo-box>
                  <paper-input 
                    label="Other" 
                    name="customRace"
                    type="text"
                    value="">
                  </paper-input>
                </div>
              </dm-card>
              <dm-card inner-card>
                <div slot="content">
                  <vaadin-combo-box
                    name="class"
                    label="Class"
                    .items="${this._classes}">
                  </vaadin-combo-box>
                  <paper-input 
                    label="Other" 
                    name="customRace"
                    type="text"
                    value="">
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
                  <!-- SAVES -->
                  <div scores-container>
                    <paper-input 
                      label="Save" 
                      name="strength_save"
                      type="number">
                    </paper-input>
                    <paper-input 
                      label="Save" 
                      name="dexterity_save"
                      type="number">
                    </paper-input>
                    <paper-input 
                      label="Save" 
                      name="constitution_save"
                      type="number">
                    </paper-input>
                    <paper-input 
                      label="Save" 
                      name="intelligence_save"
                      type="number">
                    </paper-input>
                    <paper-input 
                      label="Save" 
                      name="wisdom_save"
                      type="number">
                    </paper-input>
                    <paper-input 
                      label="Save" 
                      name="charisma_save"
                      type="number">
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
            class="create"
            @click="${this._onSubmit.bind(this)}">
            Create
          </paper-button>
          <paper-button
            @click="${this._cancel.bind(this)}">
            Cancel
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
      features: { type: Array },

      _races: { type: Array },
      _traits: { type: Array },
      _actions: { type: Array },
      _reactions: { type: Array },
      _legendary_actions: { type: Array },
      _classes: { type: Array },
      _features: { type: Array },

      _rawTraits: { type: Array },
      _rawFeatures: { type: Array },
    };
  }

  constructor() {
    super();
    vm = this;

    // form values
    this.traits = [];
    this.actions = [];
    this.reactions = [];
    this.legendary_actions = [];
    this.features = [];

    // dropdown values
    this._races = [];
    this._traits = [];
    this._actions = [];
    this._reactions = [];
    this._legendary_actions = [];
    this._classes = [];
    this._features = [];

    // raw values for filtering
    this._rawTraits = [];
    this._rawFeatures = [];
  }

  firstUpdated() {
    Services.races.getAll()
      .then((races) => {
        this._races = this._generateDropdownList(races);
      });
    Services.traits.getAll()
      .then((traits) => {
        this._traits = this._generateDropdownList(traits);
        this._rawTraits = this._generateDropdownList(traits);
      });
    Services.classes.getAll()
      .then((classes) => {
        this._classes = this._generateDropdownList(classes);
      });
    // Services.features.getAll()
    //   .then((features) => {
    //     this._features = this._generateDropdownList(features);
    //     this._rawFeatures = this._generateDropdownList(features);
    //   });
  }

  _onRaceChanged({ target: { value } }) {
    this._traits = this._rawTraits.filter(
      t => (t.races.filter(r => r.name.includes(value)).length > 0),
    );
  }

  _onClassChanged({ target: { value } }) {
    this._features = this._rawFeatures.filter(f => f.class.name.includes(value));
  }

  _generateDropdownList(items) {
    return items.map(({ name, ...rest }) => ({ label: name, value: name, ...rest }));
  }

  _generateListBox(type) {
    function _onNameChanged({ target: { value } }) {
      if (value === '' || vm[`_${type}`].length === 0) return;
      const { desc } = vm[`_${type}`].find(t => t.label === value);
      [vm.shadowRoot.querySelector(`[id="${type}${this}"]`).value] = desc;
    }

    return html`
    <dm-card inner-card showActions>
      <div slot="header">
        ${type}
      </div>
      <div slot="content">
        ${this[type].length === 0 ? html`No ${type} added.` : ''}
        ${this[type].map((t, index) => html`
        <dm-card inner-card>
          <div slot="content">
            <div name-container>
              <vaadin-combo-box
                name="${type}"
                label="Name"
                index="${index}"
                @selected-item-changed="${_onNameChanged.bind(index)}"
                .items="${this[`_${type}`]}">
              </vaadin-combo-box>
              <paper-input
                label="Other"
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
              id="${type}${index}"
              required
              label="Description"
              rows="3"
              name="${type}">
            </paper-textarea>
          </div>
        </dm-card>
        
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
    const character = new Player(detail);

    console.log(character);

    this.dispatchEvent(new CustomEvent('character-added', { detail: character }));
  }

  _cancel() {
    this.dispatchEvent(new CustomEvent('cancel'));
  }

  _addItem() {
    vm[this.type].push(this.index);
    vm.requestUpdate();
  }

  _removeItem() {
    vm[this.type].splice(this.index, 1);
    vm.requestUpdate();
  }
}

window.customElements.define('dm-add-character', DmAddCharacter);
