import CheckGroup from "./CheckGroup";

class Checkbox extends CheckGroup {
  static get properties() {
    return {
      value: { type: Boolean },
      text: { type: String }
    };
  }

  get value() {
    return this._value[0]?.toString() == this.items[0]?.value.toString();
  }

  set value(value) {
    if (typeof value !== "boolean") value = false;

    this._value = [value];
  }

  set text(value) {
    this.items[0].label = value;
  }

  get text() {
    return this.items ? this.items[0].label : "On";
  }

  toggleCheck(e) {
    this._value = [];
    super.toggleCheck(e);
    this.requestUpdate();
  }

  isSelected(item) {
    return this.value;
  }

  constructor() {
    super(...arguments);
    this.items = [
      {
        value: true,
        label: "On"
      }
    ];
  }
}
export default Checkbox;
window.customElements.define("xw-checkbox", Checkbox);
