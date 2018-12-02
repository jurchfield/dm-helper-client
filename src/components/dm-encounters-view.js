import { html } from '@polymer/lit-element';
import { DmPageView } from './dm-page-view';

class DmEncountersView extends DmPageView {
  render() {
    return html``;
  }

  static get properties() {
    return {};
  }

  constructor() {
    super();
    this._baseUrl = 'https://us-central1-dm-helper-1f262.cloudfunctions.net';
  }
}

window.customElements.define('dm-encounters-view', DmEncountersView);
