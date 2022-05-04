import Control from "./Control";
import { html } from "lit";
import { repeat } from "lit/directives/repeat.js";

/**
 * Repeats underlying structure for all items in the Array the control is bound to.
 */
class Repeat extends Control {
  _items = [];

  constructor() {
    super(...arguments);
    this._container = false;
  }

  static get properties() {
    return {
      layout: {
        type: String
      },
      fields: {
        type: Array
      }
    };
  }

  set bind(value) {
    super.bind = value;
    this.form.model.addBinding({
      control: this,
      rawValue: value,
      property: "items",
      binding: value
    });

    this._items = this.form.model.get(value);
  }

  set items(value) {
    this._items = value;

    this.requestUpdate();
  }

  get items() {
    return this._items;
  }

  get bind() {
    return super.bind;
  }

  render() {
    if (!this._items) return html``;

    let result = html`
      ${repeat(
        this._items,
        (item) => item.id,
        (item, index) => {
          return this.renderGroup(item, index);
        }
      )}
    `;

    return result;
  }

  renderGroup(item, index) {
    console.debug("Rendering group", this.scope, this.fields);

    return html`<xo-group
      .scope=${item}
      ._parent=${this}
      .container=${false}
      .fields=${this.fields}
    ></xo-group>`;
  }

  getContainerClasses() {
    let c = super.getContainerClasses();
    return c + " xo-rep";
  }
}

export default Repeat;
window.customElements.define("xo-repeat", Repeat);
