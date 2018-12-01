import { html } from '@polymer/lit-element';
import { DmPageView } from './dm-page-view';
import { SharedStyles } from './shared-styles';

class DmCharactersView extends DmPageView {
  render() {
    return html`
      ${SharedStyles}
      <style>
        
            
      </style>
      <section>
        
      </section>
`;
  }
}

window.customElements.define('dm-characters-view', DmCharactersView);
