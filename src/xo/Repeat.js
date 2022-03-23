import Group from "./Group";

/**
 * XO Repeat Control (```<xo-repeat/>```) - Repeats underlying structure for all items in *.items* Array.
 */
class Repeat extends Group {
  static get properties() {
    return {
      items: {
        type: Array,
      },
      layout: {
        type: String,
      },
      fields: {
        type: Array,
      },
    };
  }

  set fields(value) {
    if (!Array.isArray(value))
      throw Error("Invalid fields property value for repeat.");

    this._fields = value;
    this.refresh();
  }

  get fields() {
    return this._fields;
  }

  set items(value) {
    this._items = value;
    console.log("ITEMS: ", value);

    if (this.hasUpdated) {
      this.refresh();
      this.requestUpdate();
    }
  }

  get items() {
    return this._items;
  }

  refresh() {
    this.innerHTML = "";

    let index = 0;
    this.items.forEach((item) => {
      let group = this.createControl(
        this.context,
        "group",
        {
          fields: this.fields,
          classes: ["xo-ri"],
          index: index,
        },
        {
          scope: item,
          index: index++,
        }
      );
      group.setAttribute("data-index", index);
      this.appendChild(group);
    });
  }

  getContainerClasses() {
    let c = super.getContainerClasses();
    return c + " xo-rep";
  }
}

export default Repeat;
window.customElements.define("xo-repeat", Repeat);
