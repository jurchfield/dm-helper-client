import { html } from '@polymer/lit-element';

export const SharedStyles = html`
<style>
  :host {
    display: block;
    box-sizing: border-box;
  }

  h1, h2, h3 {
    color: var(--app-dark-text-color);
  }

  @font-face {
    font-family: 'TiamatRegular';
    font-style: normal;
    font-weight: normal;
    src: local('TiamatRegular'), url('../../fonts/tiamatregular.otf') format('opentype');
  }

  .attributes-table {
    display: grid;
    width: 50%;
  }

  .attributes-table-row {
    display: grid;
    grid-template-columns: 30% 70%;
    border: 1px solid lightgray;
    padding: 1%;
    font-size: 14pt;
  }

  .attributes-table-row:nth-of-type(odd) {
    background: var(--app-section-even-color);
  }

  p {
    font-size: 14pt;
  }
</style>
`;
