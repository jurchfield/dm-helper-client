import { html } from '@polymer/lit-element';
import { DmPageView } from './dm-page-view';
import { SharedStyles } from './shared-styles';

import './dm-spell';
import '@vaadin/vaadin-combo-box/vaadin-combo-box';

class DmSpellsView extends DmPageView {
  constructor() {
    super();
    this.baseUrl = 'http://www.dnd5eapi.co/api/spells';
    this.spellList = [];
    this.selectedSpell = undefined;
  }

  firstUpdated() {
    fetch(this.baseUrl)
      .then(r => r.json())
      .then(({ results }) => {
        this.spellList = results.map(s => ({ label: s.name, value: s.url }));
        this.requestUpdate();
      });
  }

  render() {
    return html`
      ${SharedStyles}
      <style>
        :host {
          display: block;
          --lumo-primary-text-color: var(--app-primary-color);
        }
        
        vaadin-combo-box {
          width: 100%;
        }

        dm-spell {
          padding-top: 1%;
        }
      </style>
      <section>
        <vaadin-combo-box 
          label="Search for a spell"
          @selected-item-changed="${this._inputChanged.bind(this)}"
          .items="${this.spellList}">
        </vaadin-combo-box>
        ${this.selectedSpell ? this._generateSpellCard() : ''}
      </section>
    `;
  }

  _generateSpellCard() {
    return html`
      <dm-spell .spell="${this.selectedSpell}"></dm-spell>
    `;
  }

  _inputChanged({ target: { value } }) {
    fetch(value)
      .then(r => r.json())
      .then((s) => {
        this.selectedSpell = s;
        this.update();
      });
  }
}

window.customElements.define('dm-spells-view', DmSpellsView);
