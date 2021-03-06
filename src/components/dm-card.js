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
          padding-left: 0.5em;
          color: var(--app-light-text-color);
          background-color: var(--app-primary-color);
          font-family: var(--app-header-font);
          text-align: left;
          margin-top: 0;
          margin-bottom: 0;
          font-weight: 100;
        }

        [content] {
          padding: 1em;
          font-family: var(--app-primary-font);
        }

        [actions] {
          padding: 1.5% repeat(3, 3%);
          border-top: 1px solid #e8e8e8;
        }
      </style>
      <paper-card>
        <h1 header>
          <slot name="header"></slot>
        </h1>
        <div content>
          <slot name="content"></slot>
        </div>
        <div actions>
          <slot name="actions"></slot>
        </div>
      </paper-card>
    `;
  }
}

window.customElements.define('dm-card', DmCard);
