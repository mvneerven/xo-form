import Control from "./Control";
import { css, html } from "lit";

class Group extends Control {

 

  static get properties() {
    return {
      layout: { type: String, attribute: true },
      fields: { type: Array },
    };
  }

  renderInput() {
    return html`${this.injectedStyles}
      <div class="${this.getGroupClasses()}">
        <slot></slot>
      </div>`;
  }

  set fields(value) {
    this._fields = value;

    for (let field of this._fields) {
      let element = this.createControl(this.context, field.type, field);
      this.appendChild(element);
    }
  }

  get fields() {
    return this._fields;
  }

  getGroupClasses() {
    return `xo-grp ${this.layout?.startsWith("hor") ? "hor" : "ver"}`;
  }
}
export default Group;
window.customElements.define("xo-group", Group);
