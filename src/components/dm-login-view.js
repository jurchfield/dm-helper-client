import { html } from '@polymer/lit-element';
import { DmPageView } from './dm-page-view';
import { SharedStyles } from './shared-styles';

import '@polymer/iron-form';
import '@polymer/paper-button';
import '@polymer/paper-input/paper-input';

class DmLoginView extends DmPageView {
  render() {
    return html` 
      ${SharedStyles}
      <style>
        [button-container] {
          text-align:center;
          padding-top: 2%;
        }

        paper-button {
          width: 15%;
        }
      </style>
      <iron-form 
        id="login-form"
        @iron-form-submit="${this._onLoginSubmitted.bind(this)}">
        <form login-form>
          <paper-input 
            label="Email" 
            name="email"
            error-message="Invalid email."
            type="email"
            required>
          </paper-input>
          <paper-input 
            label="Password" 
            type="password" 
            name="password"
            required>
          </paper-input>
          <div button-container>
            <paper-button raised @click="${this._onSubmit.bind(this)}">Login </paper-button>
          </div>
        </form>
      </iron-form>
    `;
  }

  _onSubmit() {
    this.shadowRoot.querySelector('#login-form').submit();
  }

  _onLoginSubmitted({ detail: { email, password } }) {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(res => this.dispatchEvent(new CustomEvent('login', { detail: res })))
      .catch(err => console.log(err));
  }
}

window.customElements.define('dm-login-view', DmLoginView);
