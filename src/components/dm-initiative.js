import { LitElement, html } from '@polymer/lit-element';
import { SharedStyles } from './shared-styles';

import '@polymer/iron-icons';
import '@vaadin/vaadin-icons/vaadin-icons';
import '@polymer/iron-icon';
import '@polymer/paper-icon-button';
import '@polymer/paper-input/paper-input';

import './dm-card';

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
    </style>
    <dm-card>
      <div slot="header">Initiative Order</div>
      <div slot="content">
        ${this.participants.map(p => this._getParticipantCard(p))}
      </div>
    </dm-card>
    `;
  }

  constructor() {
    super();
    vm = this;
  }

  static get properties() {
    return {
      participants: {
        type: Array,
        notify: true,
      },
      state: { type: String },
    };
  }

  _getParticipantCard(p) {
    return html`
      <dm-card participant-card>
        <div
        slot="content"
        @click="${this._selectParticipant.bind(p)}">
          <div participant-card-heading>
            <span>${p.name}</span>
            <span participant-icon><iron-icon icon="favorite"></iron-icon>&nbsp;${p.hit_points}/${p.hit_points_max}</span>
            <span participant-icon><iron-icon icon="vaadin:shield"></iron-icon>&nbsp;${p.armor_class}</span>
          </div>
        </div>
        <div slot="actions">
          <div participant-card-actions>
            <paper-icon-button
              icon="add"
              title="Heal"
              @click="${this._healParticipant.bind(p)}">
            </paper-icon-button>
            <paper-icon-button 
              icon="remove"
              title="Damage"
              @click="${this._damageParticipant.bind(p)}">
            </paper-icon-button>
            <div participant-card-close-button>
              ${this.state === 'initiativeRolled' ? this._getInitiativeInput(p) : this._getDeleteButton(p)}
            </div>
          </div>
        </div>
      </dm-card>
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
        id="${p.id}" 
        @click="${this._removeParticipant.bind(p)}"
        icon="clear"
        title="Remove">
      </paper-icon-button>
    `;
  }

  _selectParticipant() {
    vm.dispatchEvent(new CustomEvent('selected', { detail: this }));
  }

  _damageParticipant() {
    this.damage(1);
    vm.requestUpdate();
    vm.dispatchEvent(new CustomEvent('damaged', { detail: vm.participants }));
  }

  _healParticipant() {
    this.heal(1);
    vm.requestUpdate();
    vm.dispatchEvent(new CustomEvent('healed', { detail: vm.participants }));
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
