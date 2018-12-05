import { html } from '@polymer/lit-element';

export const SharedStyles = html`
<style>
  :host {
    display: block;
    box-sizing: border-box;
    --lumo-primary-text-color: var(--app-primary-color);
    --lumo-font-family: var(--app-primary-font);
  }

  h1, h2, h3 {
    color: var(--app-dark-text-color);
  }
  
  .attributes-table {
    display: grid;
    width: 50%;
  }

  .attributes-table-row {
    display: grid;
    grid-template-columns: repeat(2, 50%);
    border: 1px solid lightgray;
    padding: 1%;
    font-size: 14pt;
  }

  .attributes-table-row:nth-of-type(odd) {
    background: var(--app-section-even-color);
  }

  p {
    font-size: 12pt;
  }

  vaadin-combo-box {
    width: 100%;
  }

  @media only screen and (max-width: 640px) {
    .attributes-table {
      width: 100%;
    }
  }
</style>
`;
