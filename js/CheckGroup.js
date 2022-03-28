import InputGroup from "./InputGroup";

class CheckGroup extends InputGroup {
  _value = [];

  static get styles() {
    return [
      InputGroup.styles
    ]; 
  }

  static get properties() {
    return InputGroup.properties;
  }

  get inputType() {
    return "checkbox";
  }

  toggleCheck(e) {
    e.stopPropagation();

    if (e.target.checked) {
      this._value.push(e.target.value);
    } else {
      let ix = this._value.indexOf(e.target.value);
      if (ix !== -1) this._value.splice(ix, 1);
    }

    this.dispatchEvent(
      new Event("change", { bubbles: true, cancelable: false })
    );

    this.requestUpdate();
  }

  checkValidity() {
    return this.required? this.value.length > 0 : true
  }

  reportValidity() {}

  isSelected(item) {
    return this._value.includes(item.value);
  }

  get value() {
    return this._value;
  }

  set value(value) {
    if (!Array.isArray(value)) return;

    this._value = value;
  }
}
export default CheckGroup;
window.customElements.define("xw-checkgroup", CheckGroup);
