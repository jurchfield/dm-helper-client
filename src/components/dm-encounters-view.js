import { html } from '@polymer/lit-element';
import { DmPageView } from './dm-page-view';
import { SharedStyles } from './shared-styles';

import '@vaadin/vaadin-combo-box';
import '@vaadin/vaadin-dialog';
import '@polymer/paper-card';
import '@polymer/paper-button';
import '@polymer/iron-icons';
import '@vaadin/vaadin-icons/vaadin-icons';
import '@polymer/iron-icon';
import '@polymer/paper-icon-button';

import './dm-card';
import './dm-participant';

let vm;
let dragSrcEl = null;
let cards;

class Participant {
  constructor(p) {
    Object.assign(this, { ...p, id: this._guidGenerator(), hit_points_max: p.hit_points });
  }

  damage(amt) {
    this.hit_points -= amt;
  }

  heal(amt) {
    if (this.hit_points + amt > this.hit_points_max) {
      this.hit_points = this.hit_points + (amt - ((this.hit_points + amt) - this.hit_points_max));
      return;
    }

    this.hit_points += amt;
  }

  _guidGenerator() {
    const S4 = () => (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    return (`${S4()}${S4()}-${S4()}-${S4()}-${S4()}-${S4()}${S4()}${S4()}`);
  }
}
class DmEncountersView extends DmPageView {
  render() {
    return html`
      ${SharedStyles}
      <style>
        #container {
          display: grid;
          grid-template-columns: 25% 34% 40%;
          grid-column-gap: 1%;
        }

        [save-button] {
          width: 100%;
          margin-top: 5%;
        }

        [participant-card] {
          width: 100%;
          margin: 1% auto 1% auto
        }

        [participant-card-heading] {
          font-size: 14pt;
          display: grid;
          grid-template-columns: repeat(3, auto);
        }

        [participant-card-actions] {
          width: 100%;
          display: grid;
          grid-template-columns: 10% 10% 80%;
        }

        [participant-card-close-button] {
          text-align: right;
        }

        [draggable] {
          -moz-user-select: none;
          -khtml-user-select: none;
          -webkit-user-select: none;
          user-select: none;
          /* Required to make elements draggable in old WebKit */
          -khtml-user-drag: element;
          -webkit-user-drag: element;
        }

      </style>
      <div id="container">
        <div id="add-characters">
          <dm-card>
            <div slot="header">Add Participants</div>
            <div slot="content">
              <vaadin-combo-box 
                label="Add Creature"
                .items="${this._creatures}"
                @selected-item-changed="${this._participantInputChanged.bind(this)}">
              </vaadin-combo-box>
              <vaadin-combo-box 
                label="Add Player"
                .items="${this._players}"
                @selected-item-changed="${this._playerInputChanged.bind(this)}">
              </vaadin-combo-box>
              <paper-button save-button raised class="indigo">Save</paper-button>
            </div>
          </dm-card>
        </div>
        <div id="initiative">
          <dm-card>
            <div slot="header">Initiative Order</div>
            <div slot="content">
              ${this._participants.map(p => this._getParticipantCard(p))}
            </div>
          </dm-card>
        </div>
        <div id="selected-participant">
          <dm-card>
            <div slot="header">Selected Participant</div>
            <div slot="content">
              ${this._selectedParticipant ? html`<dm-participant .participant="${this._selectedParticipant}"></dm-participant>` : ''}
            </div>
          </dm-card>
        </div>
      </div>

      <vaadin-dialog id="add-player-dialog" aria-label="simple"></vaadin-dialog>
    `;
  }

  static get properties() {
    return {
      _creatures: { type: Array },
      _participants: { type: Array },
      _players: { type: Array },
      _selectedParticipant: { type: Object },
    };
  }

  constructor() {
    super();
    vm = this;
    this._baseUrl = 'https://us-central1-dm-helper-1f262.cloudfunctions.net';
    this._participants = [];
    this._players = [{ label: 'Add New Player', value: 'add' }];
  }

  firstUpdated() {
    fetch(`${this._baseUrl}/creatures`)
      .then(res => res.json())
      .then((creatures) => {
        this._creatures = creatures.map(c => ({ label: c.name, value: c }));
      })
      .catch(err => console.error(err));
  }

  _handleDragStart(e) {
    dragSrcEl = e.target;

    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.innerHTML);
  }

  _handleDragOver(e) {
    if (e.preventDefault) {
      e.preventDefault();
    }

    e.dataTransfer.dropEffect = 'move';

    return false;
  }

  _handleDrop(e) {
    if (e.stopPropagation) {
      e.stopPropagation();
    }

    const target = vm.shadowRoot.getElementById(this.id);

    if (dragSrcEl != target) {
      dragSrcEl.innerHTML = target.innerHTML;
      target.innerHTML = e.dataTransfer.getData('text/html');
    }

    return false;
  }

  _getParticipantCard(p) {
    return html`
      <paper-card 
        id="${p.id}"
        @dragstart="${this._handleDragStart}"
        @dragover="${this._handleDragOver}"
        @drop="${this._handleDrop.bind(p)}"
        participant-card 
        draggable>
        <div
        class="card-content"
        @click="${this._selectParticipant.bind(p)}">
          <div participant-card-heading>
            <span>${p.name}</span>
            <span><iron-icon icon="favorite"></iron-icon>&nbsp;${p.hit_points}/${p.hit_points_max}</span>
            <span><iron-icon icon="vaadin:shield"></iron-icon>&nbsp;${p.armor_class}</span>
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
                @click="${this._removeParticipant.bind(this)}"
                icon="clear"
                title="Remove">
              </paper-icon-button>
            </div>
          </div>
        </div>
      </paper-card>
    `;
  }

  _participantInputChanged({ target: { value } }) {
    if (!value) return;
    const uParticipant = JSON.parse(JSON.stringify(value));
    const participant = new Participant(uParticipant);

    this._participants.push(participant);
    this.requestUpdate();
  }

  _playerInputChanged({ target: { value } }) {
    if (value === 'add') {
      this.shadowRoot.querySelector('#add-player-dialog').opened = true;
    }
  }

  _removeParticipant({ path }) {
    this._participants = this._participants.filter(p => p.id !== path[2].id);
    this.requestUpdate();
  }

  _damageParticipant() {
    this.damage(1);
    vm.requestUpdate();
  }

  _healParticipant() {
    this.heal(1);
    vm.requestUpdate();
  }

  _selectParticipant() {
    vm._selectedParticipant = this;
    vm.requestUpdate();
  }
}

window.customElements.define('dm-encounters-view', DmEncountersView);
