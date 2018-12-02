import { html, LitElement } from '@polymer/lit-element';
import { SharedStyles } from './shared-styles';

import '@polymer/paper-card';


class DmCard extends LitElement {
  render() {
    return html`
      ${SharedStyles}
      <paper-card>
        
      </paper-card>
    `;
  }
}

window.customElements.define('dm-card', DmCard);
