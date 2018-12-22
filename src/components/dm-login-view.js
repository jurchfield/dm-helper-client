import { html } from '@polymer/lit-element';
import { DmPageView } from './dm-page-view';
import { SharedStyles } from './shared-styles';

import '@polymer/iron-form';
import '@polymer/paper-button';
import '@polymer/paper-input/paper-input';

import './dm-card';

class DmLoginView extends DmPageView {
  render() {
    return html` 
      ${SharedStyles}
      <style>
        [button-container] {
          text-align:center;
        }

        paper-button {
          width: 15%;
        }

        paper-button.create-account {
          background-color: var(--app-primary-color);
          color: var(--app-light-text-color);
        }
      </style>
      <dm-card showActions>
        <div slot="header">Login In</div>
        <div slot="content">
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
            </form>
          </iron-form>
        </div>
        <div slot="actions">
          <div button-container>
            <paper-button 
              raised
              @click="${this._onLogIn.bind(this)}">
                Login
            </paper-button>
            <paper-button
              class="create-account"
              raised
              @click="${this._onSignUp.bind(this)}">
                Sign Up
              </paper-button>
          </div>
        </div>
      </dm-card>
      
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
