import { html, LitElement } from '@polymer/lit-element';
import { SharedStyles } from './shared-styles';

import '@polymer/paper-card';


class DmCard extends LitElement {
  render() {
    return html`
      ${SharedStyles}
      <style>
        :host {
          width: 100%;
        }

        paper-card {
          width: 100%;
        }

        [header] {
          padding-left: 3%;
          color: var(--app-light-text-color);
          background-color: var(--app-primary-color);
          font-family: var(--app-header-font);
          text-align: left;
          margin-top: 0;
          margin-bottom: 0;
          font-weight: 100;
        }

        [content] {
          padding: 3%;
        }
      </style>
      <paper-card>
        <h1 header>
          <slot name="header"></slot>
        </h1>
        <div content>
          <slot name="content"></slot>
        </div>
      </paper-card>
    `;
  }
}

window.customElements.define('dm-card', DmCard);
