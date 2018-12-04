import { html } from '@polymer/lit-element';
import { DmPageView } from './dm-page-view';
import { SharedStyles } from './shared-styles';
import { Participant } from './classes';

import '@vaadin/vaadin-combo-box';
import '@vaadin/vaadin-dialog';
import '@polymer/paper-card';
import '@polymer/paper-button';

import './dm-card';
import './dm-participant';
import './dm-initiative';

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
          <dm-initiative
            .participants="${this._participants}"
            @selected="${this._select.bind(this)}"
            @damaged="${this._damage.bind(this)}"
            @healed="${this._heal.bind(this)}"
            @removed="${this._remove.bind(this)}">
          </dm-initiative>
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

  _participantInputChanged({ target: { value } }) {
    if (!value) return;
    const uParticipant = JSON.parse(JSON.stringify(value));
    const participant = new Participant(uParticipant);

    this._participants = [...this._participants, participant];
    this.render();
  }

  _playerInputChanged({ target: { value } }) {
    if (value === 'add') {
      this.shadowRoot.querySelector('#add-player-dialog').opened = true;
    }
  }

  _remove({ detail: p }) {
    this._participants = p;
  }

  _damage({ detail: p }) {
    this._participants = p;
  }

  _heal({ detail: p }) {
    this._participants = p;
  }

  _select({ detail: p }) {
    this._selectedParticipant = p;
  }
}

window.customElements.define('dm-encounters-view', DmEncountersView);
