import { LitElement, html } from '@polymer/lit-element';
import { SharedStyles } from './shared-styles';

import '@polymer/paper-card';
import '@polymer/iron-icons';
import '@vaadin/vaadin-icons/vaadin-icons';
import '@polymer/iron-icon';
import '@polymer/paper-icon-button';

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
      }

      [participant-card-close-button] {
        text-align: right;
      }

      [participant-icon] {
        text-align: right;
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
    };
  }

  _getParticipantCard(p) {
    return html`
      <paper-card participant-card>
        <div
        class="card-content"
        @click="${this._selectParticipant.bind(p)}">
          <div participant-card-heading>
            <span>${p.name}</span>
            <span participant-icon><iron-icon icon="favorite"></iron-icon>&nbsp;${p.hit_points}/${p.hit_points_max}</span>
            <span participant-icon><iron-icon icon="vaadin:shield"></iron-icon>&nbsp;${p.armor_class}</span>
          </div>
        </div>
        <div class="card-actions">
          <div participant-card-actions>
            <paper-icon-button
              icon="add-circle-outline"
              title="Heal"
              @click="${this._healParticipant.bind(p)}">
            </paper-icon-button>
            <paper-icon-button 
              icon="remove-circle-outline"
              title="Damage"
              @click="${this._damageParticipant.bind(p)}">
            </paper-icon-button>
            <div participant-card-close-button>
              <paper-icon-button
                id="${p.id}" 
                @click="${this._removeParticipant.bind(p)}"
                icon="clear"
                title="Remove">
              </paper-icon-button>
            </div>
          </div>
        </div>
      </paper-card>
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
}

window.customElements.define('dm-initiative', DmInitiative);
