import { html } from '@polymer/lit-element';
import { DmPageView } from './dm-page-view';
import { SharedStyles } from './shared-styles';
import '@vaadin/vaadin-combo-box/vaadin-combo-box';

class DmSpellsView extends DmPageView {
  constructor() {
    super();
    this.baseUrl = 'http://www.dnd5eapi.co/api/spells';
    this.spellList = [];
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
      <section>
        <vaadin-combo-box 
          label="Search for a spell"
          @selected-item-changed="${this._inputChanged.bind(this)}"
          .items="${this.spellList}">
        </vaadin-combo-box>

        <div>
          ${this.spellList.map(({ name }) => html`<p>${name}</p>`)}
        </div>
      </section>
    `;
  }

  _inputChanged({ target: { value } }) {
    console.log(value);
    // fetch(`${this.baseUrl}?name=${value.replace(/ /g,'+')}`)
    //   .then(r => r.json())
    //   .then(({ results }) => {
    //     this.spellList = results;
    //     this.update();
    //   });
  }
}

window.customElements.define('dm-spells-view', DmSpellsView);
