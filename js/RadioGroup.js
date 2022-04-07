import InputGroup from "./InputGroup";
import {css} from 'lit';

class RadioGroup extends InputGroup {
  static get styles() {
    return [
      InputGroup.styles,
      css`
       
      .default label {
        position: relative;
        padding-left: 24px;
        cursor: pointer;
        margin-right: 1rem;
        display: inline-block;
      }

      .default label:before {
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        width: 18px;
        height: 18px;
        border: 1px solid #ddd;
        border-radius: 100%;
        background: #fff;
      }

      .default label:after {
        content: "";
        width: 12px;
        height: 12px;
        background: var(--accent);
        position: absolute;
        top: 4px;
        left: 4px;
        border-radius: 100%;
        -webkit-transition: all 0.2s ease;
        transition: all 0.2s ease;
      }

      .default label:not(.selected):after {
        opacity: 0;
        -webkit-transform: scale(0);
        transform: scale(0);
      }

      .default label.selected:after {
        opacity: 1;
        -webkit-transform: scale(1);
        transform: scale(1);
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

  reportValidity() {}

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
    //TODO
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
