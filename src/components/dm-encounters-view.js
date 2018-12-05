import { html } from '@polymer/lit-element';
import { DmPageView } from './dm-page-view';
import { SharedStyles } from './shared-styles';
import {
  Participant,
  Encounter,
} from './classes';

import '@vaadin/vaadin-combo-box';
import '@vaadin/vaadin-dialog';
import '@polymer/paper-card';
import '@polymer/paper-button';
import '@polymer/paper-icon-button';
import '@polymer/iron-icons/av-icons';

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
          grid-template-columns: 30% 70%;
          grid-column-gap: 1%;
        }

        [actions] {
          display: grid;
          grid-template-columns: repeat(3, auto);
          grid-column-gap: 1%;
          justify-items: center
        }

        [button] {
          margin-top: 5%;
        }

        @media only screen and (max-width: 640px) {
          #container {
            grid-template-columns: 100%;
            grid-row-gap: 1.5em;
          }
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
            </div>
            <div slot="actions">
              <div actions>
                <paper-icon-button
                  button
                  raised
                  icon="av:play-arrow"
                  title="Start Encounter"
                  @click="${this._startEncounter.bind(this)}">
                  Start
                </paper-icon-button>
                <paper-icon-button
                  button
                  raised
                  icon="av:stop"
                  title="Stop Encounter"
                  @click="${this._stopEncounter.bind(this)}">
                  Start
                </paper-icon-button>
                <paper-icon-button
                  button
                  raised
                  icon="save"
                  title="Save Encounter"
                  @click="${this._startEncounter.bind(this)}">
                  Start
                </paper-icon-button>
              </div>
            </div>
          </dm-card>
        </div>
        <div id="initiative">
          <dm-initiative
            .participants="${this._participants}"
            .state="${this.state}"
            @selected="${this._select.bind(this)}"
            @damaged="${this._updateParticipants.bind(this)}"
            @healed="${this._updateParticipants.bind(this)}"
            @initiative-changed="${this._updateParticipants.bind(this)}"
            @removed="${this._updateParticipants.bind(this)}">
          </dm-initiative>
        </div>
      </div>

      <vaadin-dialog id="add-player-dialog" aria-label="simple"></vaadin-dialog>
    `;
  }

  static get properties() {
    return {
      state: { type: String },
      _creatures: { type: Array },
      _participants: { type: Array },
      _players: { type: Array },
      _selectedParticipant: { type: Object },
      _encounter: { type: Object },
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

  _updateParticipants({ detail: p }) {
    this._participants = p;
  }

  _select({ detail: p }) {
    this._selectedParticipant = p;
  }

  _startEncounter() {
    this._encounter = new Encounter({ participants: this._participants });

    this._encounter.rollInitiative();
    this._participants = this._encounter.participants;

    this.state = 'initiativeRolled';
  }

  _stopEncounter() {
    this.state = 'idle';
    this._participants = [];
  }
}

window.customElements.define('dm-encounters-view', DmEncountersView);
