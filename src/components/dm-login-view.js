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
        @iron-form-submit="${this._onFormSubmitted.bind(this)}">
        <form login-form>
          <paper-input 
            label="Email" 
            name="email"
            error-message="Invalid email."
            type="email"
            auto-validate
            required>
          </paper-input>
          <paper-input 
            label="Password" 
            type="password" 
            name="password"
            required>
          </paper-input>
          <div button-container>
            <paper-button raised @click="${this._onLogIn.bind(this)}">Login </paper-button>
            <paper-button raised @click="${this._onSignUp.bind(this)}">Sign Up </paper-button>
          </div>
        </form>
      </iron-form>
    `;
  }

  static get properties() {
    return {
      _type: { type: String },
    };
  }

  _onLogIn() {
    this._type = 'signInWithEmailAndPassword';
    this.shadowRoot.querySelector('#login-form').submit();
  }

  _onFormSubmitted({ detail: { email, password } }) {
    const auth = firebase.auth();

    auth[this._type](email, password)
      .then(res => this.dispatchEvent(new CustomEvent('login', { detail: res })))
      .catch((err) => {
        this.showToast(err.message);
        console.error(err);
      });
  }

  _onSignUp() {
    this._type = 'createUserWithEmailAndPassword';
    this.shadowRoot.querySelector('#login-form').submit();
  }
}

window.customElements.define('dm-login-view', DmLoginView);
