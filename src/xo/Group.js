import Control from "./Control";
import { css, html } from "lit";

/**
 * XO Group Control (```<xo-group/>```)
 */
class Group extends Control {
  static get properties() {
    return {
      layout: { type: String, attribute: true },
      align: { type: String, attribute: true },
      ui: { type: String, attribute: true },
      fields: { type: Array },
    };
  }

  renderInput() {
    return html`<div class="${this.getGroupClasses()}">
      <slot></slot>
    </div>`;
  }

  /**
   * Sets the declarative fields Array to append children with.
   * @param value {Array}
   */
  set fields(value) {
    this._fields = value;

    for (let field of this._fields) {
      let element = this.createControl(this.context, field.type, field);
      this.appendChild(element);
    }
  }

  /**
   * @returns {Array} - Array of schema fields that define the children to be appended.
   */
  get fields() {
    return this._fields;
  }

  getGroupClasses() {
    return `xo-grp ${this.layout?.startsWith("hor") ? "hor" : "ver"} ${
      this.align ?? ""
    }`;
  }

  getContainerClasses() {
    return `${super.getContainerClasses()} xo-gc ${
      this.ui ? "type-" + this.ui : ""
    }`;
  }
}
export default Group;
window.customElements.define("xo-group", Group);
