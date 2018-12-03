import { html, LitElement } from '@polymer/lit-element';
import { SharedStyles } from './shared-styles';

import './dm-card';

class DmWeapon extends LitElement {
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
          text-align: left;
        }
      </style>
      <dm-card>
        <div slot="header">
          ${this.weapon.name}
        </div>
        <div slot="content">
          <h2>Attributes</h2>
          <div class="attributes-table">
            <div class="attributes-table-row">
              <div>
                <b>Damage: </b>
              </div>
              <div>
                ${this.weapon.damage.dice_count}d${this.weapon.damage.dice_value}
              </div>
            </div>
            <div class="attributes-table-row">
              <div>
                <b>Damage Type: </b>
              </div>
              <div>
                ${this.weapon.damage.damage_type.name}
              </div>
            </div>
            <div class="attributes-table-row">
              <div>
                <b>Item Type: </b>
              </div>
              <div>
                ${this.weapon.category_range}
              </div>
            </div>
            <div class="attributes-table-row">
              <div>
                <b>Properties: </b>
              </div>
              <div>
                ${this.weapon.properties.map((w, i) => html`${w.name}${i === this.weapon.properties.length - 1 ? '' : ', '}`)}
              </div>
            </div>
            <div class="attributes-table-row">
              <div>
                <b>Weight: </b>
              </div>
              <div>
                ${this.weapon.weight}
              </div>
            </div>
            ${this.weapon.range ? this._generateRange() : ''}
            ${this.weapon.throw_range ? this._generateThrowRange() : ''}
          </div>
        </div>
      </dm-card>
    `;
  }

  static get properties() {
    return {
      weapon: { type: Object },
    };
  }

  _generateThrowRange() {
    return html`
    <div class="attributes-table-row">
      <div>
        <b>Throw Range: </b>
      </div>
      <div>
        ${this.weapon.throw_range.normal}/${this.weapon.throw_range.long}
      </div>
    </div>
    `;
  }

  _generateRange() {
    return html`
    <div class="attributes-table-row">
      <div>
        <b>Range: </b>
      </div>
      <div>
        ${this.weapon.range.normal}${this.weapon.range.long ? `/${this.weapon.range}` : ''}
      </div>
    </div>
    `;
  }
}

window.customElements.define('dm-weapon', DmWeapon);
