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

        [features] {
          display: grid;
          grid-template-columns: repeat(6, 16.667%);
          justify-items: center;
        }

        [feature], [header] {
          text-align: center;
        }
        
        [header] {
          font-weight: bold;
        }
      </style>
      <h2>${this.participant.name}</h2>
      <p>${this.participant.size} ${this.participant.type}, ${this.participant.alignment}</p>
      <hr>
      <p><b>Armor Class:</b> ${this.participant.armor_class}</p>
      <p><b>Hit Points:</b> ${this.participant.hit_points} (${this.participant.hit_dice})</p>
      <p><b>Speed:</b> ${this.participant.speed}</p>
      <div features>
        <!-- headers -->
        <div feature header>Str</div>
        <div feature header>Dex</div>
        <div feature header>Con</div>
        <div feature header>Int</div>
        <div feature header>Wis</div>
        <div feature header>Cha</div>
        <!-- content -->
        <div feature>${this.participant.strength}</div>
        <div feature>${this.participant.dexterity}</div>
        <div feature>${this.participant.constitution}</div>
        <div feature>${this.participant.intelligence}</div>
        <div feature>${this.participant.wisdom}</div>
        <div feature>${this.participant.charisma}</div>
      </div>
      <hr>
      <p><b>Saves:</b> Dex+${this.participant.dexterity_save || '0'} Con+${this.participant.constitution_save || '0'} Wis+${this.participant.wisdom_save || '0'}  Cha+${this.participant.charisma_save || '0'}</p>
      <p><b>Senses:</b> ${this.participant.senses}</p>      
      <p><b>Damage Immunities:</b> ${this.participant.damage_immunities}</p>      
      <p><b>Languages:</b> ${this.participant.languages}</p>      
      <p><b>Challenge:</b> ${this.participant.challenge_rating}</p>  
    `;
  }

  static get properties() {
    return {
      participant: { type: Object },
    };
  }
}

window.customElements.define('dm-participant', DmParticpant);
