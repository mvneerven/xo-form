import Control from "./Control";
import { html } from "lit";
import { repeat } from "lit/directives/repeat.js";
import Model from "./Model";

/**
 * Repeats underlying structure for all items in the Array the control is bound to.
 */
class Repeat extends Control {
  _items = [];

  static get properties() {
    return {
      template: {
        type: Array
      }
    };
  }

  set bind(value) {
    super.bind = value;
    // add extra binding for length of array changing (delete)
    this.form.model.addBinding({
      control: this,
      rawValue: value,
      property: "touch",
      binding: value + "/length"
    });

    // add extra binding for adding/changing array items
    this.form.model.addBinding({
      control: this,
      rawValue: value,
      property: "touch",
      binding: value + "/*"
    });

    this._items = this.form.model.get(value);
  }

  get bind() {
    return super.bind;
  }

  set touch(value) {
    this.requestUpdate();
  }

  render() {
    this.removeChildBindings();

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

  removeChildBindings() {
    const me = this;
    let bindings = this.getBindings();

    const isControlUnderMe = (e) => {
      let repeat = e.control.closestElement("xo-repeat");
      return repeat === me;
    };

    Object.keys(bindings).forEach((binding) => {
      let boundInModel = this.form.model.bound[binding];
      if (Array.isArray(boundInModel)) {
        this.form.model.bound[binding] = boundInModel.filter((entry) => {
          return !isControlUnderMe(entry);
        });
      }
    });
  }

  // recursively search for binding expressions in template object
  getBindings() {
    let result = {};
    const gb = (o) => {
      Object.entries(o).forEach((entry) => {
        if (typeof entry[1] === "object") {
          gb(entry[1]);
        } else {
          let test = Model.testForExpressions(entry[1]);
          if (test.expressions.length) {
            test.expressions.forEach((xp) => {
              result[xp] = entry[0];
            });
          }
        }
      });
    };
    gb(this.template);
    return result;
  }

  renderGroup(item, index) {
    //console.debug("Rendering group", this.scope, this.template);

    return html`<xo-group
      data-index="${index}"
      .scope=${item}
      ._parent=${this}
      .container=${false}
      .children=${this.template}
    ></xo-group>`;
  }
}

export default Repeat;
window.customElements.define("xo-repeat", Repeat);
