import { html } from '@polymer/lit-element';
import { DmPageView } from './dm-page-view';
import { SharedStyles } from './shared-styles';
import { Services } from './services';
import {
  Participant,
  Encounter,
  User,
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
import './dm-add-character';
import './dm-dice-roller';

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
          grid-template-columns: repeat(4, auto);
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
          <dm-card showActions>
            <div slot="header">Add Participants</div>
            <div slot="content">
              <vaadin-combo-box 
                label="Add Creature"
                .items="${this._creatures}"
                @selected-item-changed="${this._participantInputChanged.bind(this)}">
              </vaadin-combo-box>
              ${this._loggedIn ? html`
                <vaadin-combo-box 
                  label="Add Player"
                  .items="${this._players}"
                  @selected-item-changed="${this._playerInputChanged.bind(this)}">
                </vaadin-combo-box>
              ` : ''}
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
                ${this._loggedIn ? html`
                  <paper-icon-button
                    button
                    raised
                    icon="save"
                    title="Save Encounter"
                    @click="${this._startEncounter.bind(this)}">
                    Start
                  </paper-icon-button>
                ` : ''}
                
                <paper-icon-button
                  button
                  raised
                  src="https://img.icons8.com/metro/1600/dice.png"
                  title="Roll"
                  @click="${this._rollDice.bind(this)}">
                  Start
                </paper-icon-button>
              </div>
            </div>
          </dm-card>
        </div>
        <div id="initiative">
          ${this._showCharacterAdd ? this._getAddCharacterView() : this._getInitiativeView()}
        </div>
      </div>
      <vaadin-dialog id="roll-die-dialog" aria-label="simple">
        <template>
          <dm-dice-roller></dm-dice-roller>
        </template>
      </vaadin-dialog>
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
      _loggedIn: { type: Object },
      _showCharacterAdd: { type: Boolean },
    };
  }

  constructor() {
    super();
    this._showCharacterAdd = false;
    this._participants = [];
    this._players = [{ label: 'Add New Player', value: 'add' }];
    User.addAuthListener((user) => {
      this._loggedIn = user;
    });
  }

  firstUpdated() {
    Services.creatures.getAll()
      .then((creatures) => {
        this._creatures = creatures.map(c => ({ label: c.name, value: c }));
      })
      .catch(err => console.error(err));
  }

  _getInitiativeView() {
    return html`
    <dm-initiative
      .participants="${this._participants}"
      .state="${this.state}"
      @selected="${this._select.bind(this)}"
      @damaged="${this._updateParticipants.bind(this)}"
      @healed="${this._updateParticipants.bind(this)}"
      @initiative-changed="${this._updateParticipants.bind(this)}"
      @removed="${this._updateParticipants.bind(this)}">
    </dm-initiative>`;
  }

  _getAddCharacterView() {
    return html`
      <dm-add-character 
      @character-added="${this._characterAdded.bind(this)}"
      @cancel="${this._addCharacterCancel.bind(this)}">
      </dm-add-character>
    `;
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
      this._showCharacterAdd = true;
    }
  }

  _characterAdded({ detail }) {
    this._participants = [...this._participants, new Participant(detail)];
    this._players = [...this._players, { label: detail.name, value: detail }];
    this._showCharacterAdd = false;
    this.requestUpdate();
  }

  _addCharacterCancel() {
    this._showCharacterAdd = false;
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

  _rollDice() {
    const dialog = this.shadowRoot.querySelector('#roll-die-dialog');

    dialog.opened = true;
  }
}

window.customElements.define('dm-encounters-view', DmEncountersView);
