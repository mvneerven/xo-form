import InputGroup from "./InputGroup";
import { css } from "lit";

class RadioGroup extends InputGroup {
  static get styles() {
    return [
      InputGroup.styles,
      css`
        .default label:before {
          border-radius: 100%;
        }

        .default label:after {
          border-radius: 100%;
        }
      `
    ];
  }

  static get properties() {
    return InputGroup.properties;
  }

  onInput(e) {
    e.stopPropagation();
  }

  reportValidity() {
    // TBD
  }

  toggleCheck(e) {
    e.stopPropagation();

    if (e.target.checked) {
      this._value = e.target.value;
    }

    this.dispatchEvent(
      new Event("change", { bubbles: true, cancelable: false })
    );
    this.requestUpdate();
  }

  checkValidity() {
    return this.required && !this.value ? false : true;
  }
  isSelected(item) {
    return this._value === item.value;
  }

  get inputType() {
    return "radio";
  }

  get value() {
    return this._value;
  }

  set value(value) {
    this._value = value;
  }
}
export default RadioGroup;
window.customElements.define("xw-radiogroup", RadioGroup);
