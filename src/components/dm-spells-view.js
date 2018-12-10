import { html } from '@polymer/lit-element';
import { DmPageView } from './dm-page-view';
import { SharedStyles } from './shared-styles';
import { Services } from './services';

import '@vaadin/vaadin-combo-box/vaadin-combo-box';

import './dm-spell';
import './snack-bar';

class DmSpellsView extends DmPageView {
  render() {
    return html`
      ${SharedStyles}
      <style>
      dm-spell {
        padding-top: 1%;
      }
      paper-dialog {
        position: fixed;
        top: 16px;
        right: 16px;
        width: 300px;
        height: 300px;
        overflow: auto;
      }
      </style>
      <vaadin-combo-box 
        label="Search for a spell"
        @selected-item-changed="${this._inputChanged.bind(this)}"
        .items="${this._spellList}">
      </vaadin-combo-box>
      ${this._selectedSpell ? this._generateSpellCard() : ''}
      <snack-bar ?active="${this._snackbarOpened}">
        Error fetching spells
      </snack-bar>
    `;
  }

  static get properties() {
    return {
      _spellList: { type: Array },
      _selectedSpell: { type: Object },
    };
  }

  constructor() {
    super();
    this._spellList = [];
  }

  firstUpdated() {
    Services.spells.getAll()
      .then((spells) => {
        this._spellList = spells.map(s => ({ label: s.name, value: s }));
      })
      .catch((err) => {
        console.error(err);
        this._openSnackbar();
      });
  }

  _generateSpellCard() {
    return html`
      <dm-spell .spell="${this._selectedSpell}"></dm-spell>
    `;
  }

  _inputChanged({ target: { value } }) {
    this._selectedSpell = value;
  }
}

window.customElements.define('dm-spells-view', DmSpellsView);
