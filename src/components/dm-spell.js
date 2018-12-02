import { LitElement, html } from '@polymer/lit-element';
import { SharedStyles } from './shared-styles';

import '@polymer/polymer/lib/elements/custom-style';
import '@polymer/paper-card';
import '@polymer/paper-tabs';

class DmSpell extends LitElement {
  static get properties() {
    return {
      spell: { type: Object },
    };
  }

  render() {
    return html`
      ${SharedStyles}
      <style>
        :host {
          display: block;
        }
        
        h1, h2 {
          color: var(--app-dark-text-color);
          font-family: var(--app-header-font);
          text-transform: uppercase;
          text-align: left;
        }

        h1 {
          padding-top: 0;
        }

        paper-card {
          width: 100%;
          --paper-card-header-text: {
            background: green;
          };
          --paper-card-content: {
            padding: 0;
          }
        }
      </style>
      <paper-card>
        <div class="card-content">
          <h1>${this.spell.name}</h1>
          <h2>Description</h2>
          ${this.spell.desc.map(d => html`<p>${d.replace('â€™', "'")}</p>`)}
          ${this.spell.higher_level ? html`<h2>Higher Level</h2> ${this.spell.higher_level.map(lev => html`<p>${lev}</p>`)}` : ''}
          <h2>Attributes</h2>
          <div class="attributes-table">
            <div class="attributes-table-row">
              <div>
                <b>Casting Time: </b>
              </div>
              <div>
                ${this.spell.casting_time}
              </div>
            </div>
            <div class="attributes-table-row">
              <div>
                <b>Classes: </b>
              </div>
              <div>
                ${this.spell.classes.map((c, i) => html`${c.name}${i === this.spell.classes.length - 1 ? '' : ', '}`)}
              </div>
            </div>
            <div class="attributes-table-row">
              <div>
                <b>Components: </b>
              </div>
              <div>
                ${this.spell.components.map((c, i) => html`${c}${i === this.spell.components.length - 1 ? '' : ', '}`)}
              </div>
            </div>
            <div class="attributes-table-row">
              <div>
                <b>Level: </b>
              </div>
              <div>
                ${this.spell.level}
              </div>
            </div>
            <div class="attributes-table-row">
              <div>
                <b>Range: </b>
              </div>
              <div>
                ${this.spell.range || 'N/A'}
              </div>
            </div>
            <div class="attributes-table-row">
              <div>
                <b>School: </b>
              </div>
              <div>
                ${this.spell.school.name}
              </div>
            </div>
          </div>
        </div>
      </paper-card>
    `;
  }
}

window.customElements.define('dm-spell', DmSpell);
