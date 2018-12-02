import { LitElement, html } from '@polymer/lit-element';
import { setPassiveTouchGestures } from '@polymer/polymer/lib/utils/settings';
import { installOfflineWatcher } from 'pwa-helpers/network';
import { installRouter } from 'pwa-helpers/router';
import { updateMetadata } from 'pwa-helpers/metadata';

import '@polymer/iron-iconset-svg/iron-iconset-svg';
import '@polymer/app-layout/app-drawer/app-drawer';
import '@polymer/paper-icon-button';
import '@polymer/app-layout/app-drawer-layout/app-drawer-layout';
import '@polymer/app-layout/app-header/app-header';
import '@polymer/app-layout/app-scroll-effects/effects/waterfall';
import '@polymer/app-layout/app-toolbar/app-toolbar';
import '@polymer/app-layout/app-scroll-effects/app-scroll-effects';
import './snack-bar';

class DmApp extends LitElement {
  render() {
    return html`
    <style>
      :host {
        display: block;

        --app-primary-color: rgb(23, 95, 124);
        --app-secondary-color: #293237;
        --app-dark-text-color: var(--app-secondary-color);
        --app-light-text-color: white;
        --app-section-even-color: #f7f7f7;
        --app-section-odd-color: white;

        --app-header-background-color: white;
        --app-header-text-color: var(--app-dark-text-color);
        --app-header-selected-color: var(--app-primary-color);

        --app-drawer-background-color: var(--app-secondary-color);
        --app-drawer-text-color: var(--app-light-text-color);
        --app-drawer-selected-color: var(--app-primary-color);
      }

      [main-title] {
        font-family: 'TiamatRegular';
        text-transform: uppercase;
        color: var(--app-light-text-color);
        font-size: 26pt;
      }

      [logo] {
        width: 10%;
      }

      [logo-container] {
        text-align: right;
      }

      [toolbar-heading] {
        font-family: 'TiamatRegular';
        text-transform: uppercase;
        color: var(--app-dark-text-color);
      }

      /* Workaround for IE11 displaying <main> as inline */
      main {
        display: block;
        padding: 2%;
      }

      .page {
        display: none;
      }

      .page[active] {
        display: block;
      }

      section a {
        display: block;
        text-decoration: none;
        color: var(--app-dark-text-color);
        margin: 5% 0 5% 0;
      }

      section a[selected] {
        color: var(--app-drawer-selected-color);
      }

      section {
        margin-left: 7%;
        font-size: 14pt;
      }

      app-header {
        background-color: var(--app-primary-color);
      }

      paper-icon-button {
        --paper-icon-button-ink-color: white;
      }

      app-drawer-layout:not([narrow]) [drawer-toggle] {
        display: none;
      }

    </style>
    <app-drawer-layout>
      <app-drawer slot="drawer">
        <app-toolbar>
          <h2 toolbar-heading>Tools</h2>
          
        </app-toolbar>
        <section>
          <a ?selected="${this._page === 'spellSearch'}" href="/spellSearch">Spell Search</a>
          <a ?selected="${this._page === 'weaponsSearch'}" href="/weaponsSearch">Weapon Search</a>
        </section>
      </app-drawer>
      <app-header-layout>
        <app-header slot="header" fixed shadow>
          <app-toolbar>
            <paper-icon-button icon="menu" drawer-toggle></paper-icon-button>
            <div main-title>${this.appTitle}</div>
            <div logo-container>
              <img logo src="https://images-na.ssl-images-amazon.com/images/I/61etDYZn75L.png" alt="logo">
            </div>
          </app-toolbar>
        </app-header>
        <main role="main">
          <dm-spells-view class="page" ?active="${this._page === 'spellSearch'}"></dm-spells-view>
          <dm-weapons-view class="page" ?active="${this._page === 'weaponsSearch'}"></dm-weapons-view>
          <my-view404 class="page" ?active="${this._page === 'view404'}"></my-view404>
        </main>
      </app-header-layout>
    </app-drawer-layout> 

    <snack-bar ?active="${this._snackbarOpened}">
        You are now ${this._offline ? 'offline' : 'online'}.</snack-bar>
    `;
  }

  static get properties() {
    return {
      appTitle: { type: String },
      _page: { type: String },
      _snackbarOpened: { type: Boolean },
      _offline: { type: Boolean },
    };
  }

  constructor() {
    super();

    // See https://www.polymer-project.org/3.0/docs/devguide/settings#setting-passive-touch-gestures
    setPassiveTouchGestures(true);
  }

  firstUpdated() {
    installRouter(this._locationChanged.bind(this));
    installOfflineWatcher(this._offlineChanged.bind(this));
  }

  updated(changedProps) {
    if (changedProps.has('_page')) {
      const pageTitle = `${this.appTitle} - ${this._page}`;
      updateMetadata({
        title: pageTitle,
        description: pageTitle,
      });
    }
  }

  _offlineChanged(offline) {
    const previousOffline = this._offline;
    this._offline = offline;

    // Don't show the snackbar on the first load of the page.
    if (previousOffline === undefined) {
      return;
    }

    clearTimeout(this.__snackbarTimer);
    this._snackbarOpened = true;
    this.__snackbarTimer = setTimeout(() => { this._snackbarOpened = false; }, 3000);
  }

  _locationChanged() {
    const path = window.decodeURIComponent(window.location.pathname);
    const page = path === '/' ? 'spellSearch' : path.slice(1);

    this._loadPage(page);
  }

  _loadPage(page) {
    const pages = {
      spellSearch: () => import('./dm-spells-view.js'),
      weaponsSearch: () => import('./dm-weapons-view.js'),
      def: () => import('./my-view404.js'),
    };

    (pages[page] || pages.def)();

    this._page = page;
  }
}

window.customElements.define('dm-app', DmApp);
