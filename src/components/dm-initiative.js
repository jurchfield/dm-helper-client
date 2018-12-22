import { LitElement, html } from '@polymer/lit-element';
import { SharedStyles } from './shared-styles';

import '@polymer/iron-icons';
import '@polymer/iron-icon';
import '@polymer/paper-icon-button';
import '@polymer/paper-button';
import '@polymer/paper-input/paper-input';
import '@polymer/iron-collapse';

import '@vaadin/vaadin-icons/vaadin-icons';
import '@vaadin/vaadin-dialog';

import './dm-card';
import './dm-participant';

let vm;

class DmInitiative extends LitElement {
  render() {
    return html`
    ${SharedStyles}
    <style>
      [participant-card] {
        width: 100%;
        margin: 1% auto 1% auto
      }

      [participant-card-heading] {
        font-size: 12pt;
        display: grid;
        grid-template-columns: 50% repeat(2, 25%);
        justify-items: stretch;
      }

      [participant-card-actions] {
        width: 100%;
        display: grid;
        grid-template-columns: 10% 10% 80%;
        align-items: center;
      }

      [participant-card-close-button] {
        text-align: right;
      }

      [participant-icon] {
        text-align: right;
      }

      [initiative-input] {
        width: 10%;
        margin-left: 85%;
      }

      [participant-name] {
        font-family: var(--app-header-font);
        font-size: 18pt;
      }
    </style>
    <dm-card>
      <div slot="header">Initiative Order</div>
      <div slot="content">
        ${this.participants.length < 1 ? html`<p> No participants added</p>` : this.participants.map(p => this._getParticipantCard(p))}
      </div>
    </dm-card>
    `;
  }

  constructor() {
    super();
    this._damageTemp = 0;
    this._healTemp = 0;

    vm = this;
  }

  static get properties() {
    return {
      participants: {
        type: Array,
        notify: true,
      },
      state: { type: String },
      _selectedParticipant: { type: Object },
      _damageTemp: { type: Number },
      _healTemp: { type: Number },
    };
  }

  updated() {
    const damageDialog = this.shadowRoot.querySelector('#damage-dialog');
    const healDialog = this.shadowRoot.querySelector('#heal-dialog');

    if (!damageDialog || !healDialog) return;

    damageDialog.renderer = root => this._renderDialog('damage', root);

    healDialog.renderer = root => this._renderDialog('heal', root);
  }

  _getParticipantCard(p) {
    return html`
      <dm-card participant-card showActions>
        <div
        slot="content"
        @click="${this._selectParticipant.bind(p)}">
          <div participant-card-heading>
            <div participant-name>${p.name}</div>
            <span participant-icon><iron-icon icon="favorite"></iron-icon>&nbsp;${p.hit_points}/${p.hit_points_max}</span>
            <span participant-icon><iron-icon icon="vaadin:shield"></iron-icon>&nbsp;${p.armor_class}</span>
          </div>

          <iron-collapse id="${p.id}">
            <dm-participant .participant="${p}"></dm-participant>
          </iron-collapse>
        </div>
        <div slot="actions">
          <div participant-card-actions>
            <paper-icon-button
              .disabled="${this.state !== 'initiativeRolled'}"
              icon="add"
              title="Heal"
              @click="${this._toggleHealModal.bind(p)}">
            </paper-icon-button>
            <paper-icon-button
              .disabled="${this.state !== 'initiativeRolled'}"
              icon="remove"
              title="Damage"
              @click="${this._toggleDamageModal.bind(p)}">
            </paper-icon-button>
            <div participant-card-close-button>
              ${this.state === 'initiativeRolled' ? this._getInitiativeInput(p) : this._getDeleteButton(p)}
            </div>
          </div>
        </div>
      </dm-card>
      <vaadin-dialog
        @opened-changed="${this._damageParticipant.bind(this)}"
        id="damage-dialog">
      </vaadin-dialog>
      <vaadin-dialog
        @opened-changed="${this._healParticipant.bind(this)}"
        id="heal-dialog">
      </vaadin-dialog>
    `;
  }

  _getInitiativeInput(p) {
    return html`
      <paper-input
        prevent-invalid-input
        allowed-pattern="[0-9]"
        initiative-input
        always-float-label
        maxlength="2"
        label="Roll"
        value="${p.initiative_roll}"
        @change="${this._initiativeChanged.bind(p)}">
      </paper-input>
    `;
  }

  _getDeleteButton(p) {
    return html`
      <paper-icon-button
        .disabled="${this.state === 'initiativeRolled'}"
        id="${p.id}" 
        @click="${this._removeParticipant.bind(p)}"
        icon="clear"
        title="Remove">
      </paper-icon-button>
    `;
  }

  _renderDialog(type, root) {
    if (root.firstElementChild) {
      return;
    }

    const dialog = this.shadowRoot.querySelector(`#${type}-dialog`);

    const input = window.document.createElement('paper-input');

    input.setAttribute('label', `${type.charAt(0).toUpperCase()}${type.slice(1)}`);
    input.setAttribute('value', vm[`_${type}Temp`]);

    // on change set damage/heal
    input.addEventListener('change', ({ target: { value } }) => {
      vm[`_${type}Temp`] = Number(value);
    });

    // // on enter do the same, close the dialog
    // input.addEventListener('keypress', ({ charCode, target: { value } }) => {
    //   if (charCode !== 13) return;
    //   vm[`_${type}Temp`] = Number(value);
    //   dialog.opened = false;
    //   console.log(this._damageTemp);

    // });

    root.appendChild(input);
  }

  _selectParticipant() {
    vm.shadowRoot.getElementById(this.id).toggle();
    vm.dispatchEvent(new CustomEvent('selected', { detail: this }));
  }

  _toggleDamageModal() {
    vm._selectedParticipant = this;
    vm.shadowRoot.querySelector('#damage-dialog').opened = !vm.shadowRoot.querySelector('#damage-dialog').opened;
  }

  _toggleHealModal() {
    vm._selectedParticipant = this;
    vm.shadowRoot.querySelector('#heal-dialog').opened = !vm.shadowRoot.querySelector('#damage-dialog').opened;
  }

  _damageParticipant() {
    if (this._damageTemp === 0 || !this._damageTemp) return;

    this._selectedParticipant.damage(this._damageTemp);
    this.requestUpdate();
    this.dispatchEvent(new CustomEvent('damaged', { detail: this.participants }));
    this._damageTemp = 0;
  }

  _healParticipant() {
    if (this._healTemp === 0 || !this._healTemp) return;

    this._selectedParticipant.heal(this._healTemp);
    this.requestUpdate();
    this.dispatchEvent(new CustomEvent('healed', { detail: this.participants }));
    this._healTemp = 0;
  }

  _removeParticipant() {
    vm.participants = vm.participants.filter(p => p.id !== this.id);
    vm.dispatchEvent(new CustomEvent('removed', { detail: vm.participants }));
  }

  _initiativeChanged({ target: { value } }) {
    this.initiative_roll = value;
    vm.dispatchEvent(new CustomEvent('initiative-changed', { detail: vm.participants }));
  }
}

window.customElements.define('dm-initiative', DmInitiative);
