import { LitElement, html, css } from "lit";
import { repeat } from "lit/directives/repeat.js";

class Select extends LitElement {
  _value = [];

  static get properties() {
    return {
      items: { type: Array },
      value: { type: Object },
    };
  }

  constructor() {
    super();
    this.items = [];
  }

  render() {
    return html`<select @change=${this.fireChange.bind(this)} size="1">
      ${repeat(
        this.items,
        (item) => item.id,
        (item, index) => {
          item = this.makeItem(item);
          return html`<option
            .selected=${this.isSelected(item)}
            value="${item.value}"
          >
            ${item.label}
          </option>`;
        }
      )}
    </select>`;
  }

  change(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  fireChange() {
    this.dispatchEvent(
      new Event("change", { bubbles: true, cancelable: false })
    );
  }

  isSelected(item) {
    return this._value == item.value;
  }

  makeItem(item) {
    return typeof item === "string" ? { value: item, label: item } : item;
  }

  get value() {
    return this._value;
  }

  set value(value) {
    this._value = value;
  }
}
export default Select;
window.customElements.define("xw-select", Select);
