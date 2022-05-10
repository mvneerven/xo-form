import Group from "./Group";
import { html } from "lit";

/**
 * Page Control
 */
class Page extends Group {
  constructor() {
    super(...arguments);
    this.hidden = true;
  }
  connectedCallback() {
    super.connectedCallback();

    this.closest("xo-form").on("page", (e) => {
      this.hidden = e.target.page !== this.index;
    });

    this.hidden = this.index !== 1;
  }

  render() {
    if (this.hidden) return html``;

    if (this.childNodes.length === 0) console.warn(`${this} has no children`);

    return html`<fieldset
      ?hidden=${this.hidden}
      data-page="${this.index}"
      class="xo-cn ${this.getContainerClasses()}"
    >
      <legend>${this.label}</legend>
      <slot></slot>
    </fieldset>`;

    
  }

  updated(){
    this.form.emit("page-updated", {
      index: this.index
    })
  }

  static get properties() {
    return {
      index: { type: Number, attribute: true }
    };
  }

  toString() {
    return `Page ${this.index}`;
  }
}

window.customElements.define("xo-page", Page);
export default Page;
