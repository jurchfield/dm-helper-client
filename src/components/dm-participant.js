import { LitElement, html } from '@polymer/lit-element';
import { SharedStyles } from './shared-styles';

class DmParticpant extends LitElement {
  render() {
    return html`
      ${SharedStyles}
      <style>
        h2 {
          font-family: var(--app-header-font);
        }
      </style>
      <h2>${this.participant.name}</h2>
      <p>${this.participant.size} ${this.participant.type}, ${this.participant.alignment}</p>
    `;
  }

  static get properties() {
    return {
      participant: { type: Object },
    };
  }
}

window.customElements.define('dm-participant', DmParticpant);
