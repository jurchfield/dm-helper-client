import { html } from '@polymer/lit-element';
import { DmPageView } from './dm-page-view';

import { SharedStyles } from './shared-styles';

class MyView404 extends DmPageView {
  render() {
    return html`
      ${SharedStyles}
      <section>
        <h2>Oops! You hit a 404</h2>
        <p>The page you're looking for doesn't seem to exist. Head back
           <a href="/">home</a> and try again?
        </p>
      </section>
    `;
  }
}

window.customElements.define('my-view404', MyView404);
