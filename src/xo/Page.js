import Group from "./Group";
import Control from "./Control";
import { html } from "lit";

class Page extends Group {

  constructor(){
    super(...arguments);
    this.hidden = true;
    
  }
  connectedCallback() {
    super.connectedCallback();

    this.closest("xo-form").addEventListener("xo-page", (e) => {
      this.hidden = e.target.page !== this.index;
    });

    this.hidden = this.index !== 1;
  }

  render() {
    return html`${this.injectedStyles}
      <fieldset
        ${this.hidden ? "hidden" : ""}
        data-page="${this.index}"
        class="xo-cn ${this.getContainerClasses()}"
      >
        <legend>${this.label}</legend>
        <slot></slot>
      </fieldset>`;
  }

  static get properties() {
    return {
      index: { type: Number, attribute: true },
    };
  }
}

window.customElements.define("xo-page", Page);
export default Page;
