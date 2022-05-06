import Control from "./Control";
import { css, html } from "lit";

/**
 * Group Control
 */
class Group extends Control {
  static get properties() {
    return {
      layout: { type: String, attribute: true },
      align: { type: String, attribute: true },
      ui: { type: String, attribute: true },
      children: { type: Array }
    };
  }

  renderInput() {
    return html`<div class="${this.getGroupClasses()}">
      <slot></slot>
    </div>`;
  }

  /**
   * Sets the children to be appended.
   * @param value {Array}
   */
  set children(value) {
    const me = this;
    this.innerHTML = "";
    this._children = value;

    for (let field of this._children) {
      let element = this.createControl(this, field.type, field);
      this.appendChild(element);
    }
  }

  /**
   * @returns {Array} - Array of children to be appended.
   */
  get children() {
    return this._children;
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
